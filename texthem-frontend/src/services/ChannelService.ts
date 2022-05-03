import { RawMessage, SerializedMessage } from '../contracts';
import { BootParams, SocketManager } from './SocketManager';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
    loadUsers() {
        throw new Error('Method not implemented.');
    }
    public subscribe({ store }: BootParams): void {
        const channel = this.namespace.split('/').pop() as string;

        this.socket.on('message', (message: SerializedMessage) => {
            store.commit('channels/NEW_MESSAGE', { channel, message });
        });

        this.socket.on('channelDeleted', (channel_name) => {
            store.commit('auth/CHANNEL_DELETED', channel_name);
            store.commit('channels/CLEAR_DELETED_CHANNEL', channel_name);
        });
    }

    public addMessage(message: RawMessage): Promise<SerializedMessage> {
        return this.emitAsync('addMessage', message);
    }

    public removeChannel(channel_name: string): Promise<void> {
        console.log('yea this happens');
        return this.emitAsync('removeChannel', channel_name);
    }

    public loadMessages(): Promise<SerializedMessage[]> {
        return this.emitAsync('loadMessages');
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
