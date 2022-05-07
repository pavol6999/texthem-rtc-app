import { AxiosResponse } from 'axios';
import { User } from 'src/contracts';
import { authManager } from '.';
import { BootParams, SocketManager } from './SocketManager';

class ActivitySocketManager extends SocketManager {
    public subscribe({ store }: BootParams): void {
        this.socket.on('user:list', (onlineUsers: User[]) => {
            console.log('Online users list', onlineUsers);
            store.commit('activity/ONLINE_USERS_LIST', onlineUsers);
        });

        this.socket.on('user:invitations', (invitations: any[]) => {
            console.log('Invitations list', invitations);
            store.commit('activity/INVITATIONS_LIST', invitations);
        });

        this.socket.on('user:online', (user: User) => {
            console.log('User is online', user);
            store.commit('activity/USER_CONNECTED', user);
        });

        this.socket.on('user:offline', (user: User) => {
            console.log('User went offline', user);
            store.commit('activity/USER_DISCONNECTED', user);
        });

        authManager.onChange((token) => {
            if (token) {
                this.socket.connect();
            } else {
                this.socket.disconnect();
            }
        });
    }

    public async sendInvite(user: User) {
        return this.emitAsync('user:refresh', user);
    }

    public async setNotifState(user: User) {
        return this.emitAsync('user:change_notif_state', user)
    }
}

export default new ActivitySocketManager('/');
