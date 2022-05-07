import { RawMessage, SerializedMessage, User } from '../contracts';
import { BootParams, SocketManager } from './SocketManager';
import { Notify } from 'quasar';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
    loadUsers() {
        throw new Error('Method not implemented.');
    }

    format_notify(message: SerializedMessage, channel: string): string {
        const maxlen = 25;
        let content = message.content;
        if (message.content.length > maxlen)
            content = content.slice(0, maxlen) + '...';

        return `${
            message.author!.nickname
        } (in channel ${channel}) sent: ${content}`;
    }

    public subscribe({ store }: BootParams): void {
        const channel = this.namespace.split('/').pop() as string;

        this.socket.on('message', (message: SerializedMessage) => {
            store.commit('channels/NEW_MESSAGE', { channel, message });

            // todo check whether user should receive notifs
            let notifs_on = store.state.auth.user?.notifications;

            if (notifs_on) {
                let formatted_notif = this.format_notify(message, channel);
                Notify.create({
                    timeout: 5000,
                    closeBtn: 'X',
                    position: 'top',
                    color: 'orange',
                    message: formatted_notif,
                });

                if (!('Notification' in window)) {
                    alert('This browser does not support desktop notification');
                }

                // Let's check whether notification permissions have already been granted
                else if (Notification.permission === 'granted') {
                    // If it's okay let's create a notification
                    var notification = new Notification(
                        `New message in ${channel}`,
                        {
                            body: formatted_notif,
                        }
                    );
                }

                // Otherwise, we need to ask the user for permission
                else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(function (
                        permission
                    ) {
                        // If the user accepts, let's create a notification
                        if (permission === 'granted') {
                            var notification = new Notification(
                                `New message in ${channel}`,
                                {
                                    body: formatted_notif,
                                }
                            );
                        }
                    });
                }
            }
        });

        this.socket.on('channelDeleted', (channel_name) => {
            store.commit('auth/CHANNEL_DELETED', channel_name);
            store.commit('channels/CLEAR_DELETED_CHANNEL', channel_name);
        });
        this.socket.on('user:new', (params: any) => {
            console.log('params', params);
            store.commit('channels/NEW_USER', {
                channel: params.channel,
                user: params.user,
            });
        });
        this.socket.on('user:leave', (params: any) => {
            console.log('leave', params);
            store.commit('channels/LEAVE_USER', {
                channel: params.channel,
                user: params.user,
            });
        });

        this.socket.on(
            'someoneTyping',
            ({
                channel,
                user,
                message,
            }: {
                channel: string;
                user: string;
                message: string;
            }) => {
                store.commit('channels/TYPING', { channel, user, message });
            }
        );
    }

    public addMessage(message: RawMessage): Promise<SerializedMessage> {
        return this.emitAsync('addMessage', message);
    }

    public addTyping(channel: string, user: string, message: string) {
        this.emitAsync('someoneTyping', channel, user, message);
    }

    public removeChannel(channel_name: string): Promise<void> {
        console.log('yea this happens');
        return this.emitAsync('removeChannel', channel_name);
    }

    public loadMessages(): Promise<SerializedMessage[]> {
        return this.emitAsync('loadMessages');
    }

    public loadNewMessages(
        lastMessageTimeStamp: any
    ): Promise<SerializedMessage[]> {
        console.log(typeof lastMessageTimeStamp);
        return this.emitAsync('loadNewMessages', lastMessageTimeStamp);
    }

    public notify(user: User): Promise<void> {
        return this.emitAsync('notify', user);
    }

    public notifyLeave(user: User): Promise<void> {
        return this.emitAsync('notifyLeave', user);
    }
}

class ChannelService {
    private channels: Map<string, ChannelSocketManager> = new Map();
    private slash_connection: Map<string, ChannelSocketManager> = new Map();

    public join(name: string): ChannelSocketManager {
        if (this.channels.has(name)) {
            console.info(`User is already joined in channel "${name}"`);
        }
        console.log('joined');
        // connect to given channel namespace
        const channel = new ChannelSocketManager(`/channels/${name}`);
        this.channels.set(name, channel);
        return channel;
    }

    // public joinblanknamespace(): void {
    //     const tmp = new ChannelSocketManager('/');
    //     this.slash_connection.set('/', tmp);
    // }

    public leave(name: string): boolean {
        const channel = this.channels.get(name);

        if (!channel) {
            return false;
        }

        // disconnect namespace and remove references to socket
        channel.destroy();
        return this.channels.delete(name);
    }

    public in(name: string): ChannelSocketManager | undefined {
        return this.channels.get(name);
    }
}

export default new ChannelService();
