import { api } from "src/boot/axios";
import { channelService } from 'src/services';

class CommandManager {
    // create a channel or join a public one
    async join(command: string, channel: string | null, store: any): Promise<void> {
        let args = command.split(' ')
        let channel_name: string
        let make_private = false

        if (args.length >= 2) {
            channel_name = args[1]
            if (args.length >= 3 && args[2] === 'private')
                make_private = true;
            let res = await api.post('channelJoin', { name: channel_name, private: make_private } )
            if (res.status == 200) {
                console.log(res.data.new_channel)
                store.commit('auth/NEW_CHANNEL', res.data.new_channel)
            }
        }
    }
    // leave this channel
    async cancel(command: string, channel: string | null, store: any): Promise<void> {
        let channel_name = channel
        if (channel != null) {
            let res = await api.post('channelCancel', { name: channel_name })
            if (res.status == 200) {
                console.log(res.data.left_channel)
                await store.commit('auth/LEFT_CHANNEL', res.data.left_channel)
                await store.dispatch('channels/leave', channel_name, { root: true });
                if (channel_name && res.data.was_removed)
                    await channelService.in(channel_name)?.removeChannel(channel_name);
                store.commit('channels/CLEAR_CHANNEL', channel_name)
            }
        } else {
            console.log("not in a channel rn")
        }
    }
    // delete this channel (creator only)
    async quit(command: string, channel: string | null, store: any): Promise<void> {
        if (channel != null) {            
            let res = await api.post('channelQuit', { name: channel })
            if (res.status == 200) {
                console.log(res.data.left_channel)
                await store.commit('auth/LEFT_CHANNEL', res.data.left_channel)
                await store.dispatch('channels/leave', null, { root: true });
                if (channel && res.data.was_removed)
                    await channelService.in(channel)?.removeChannel(channel)
                store.commit('channels/CLEAR_CHANNEL', channel)
            } else {
                console.log(res.status)
                console.log("insufficient auth probably")
            }
        } else {
            console.log("not in a channel rn")
        }
    }

    // list users of the channel
    async list(command: string, channel: string | null, store: any): Promise<String[]> {
        if (channel != null) {
            let res = await api.get('channelList/' + channel)
            return res.data.user_list
        } else {
            console.log("not in a channel rn")
            return []
        }
    }
    // invite someone to a channel
    async invite(command: string, channel: string | null, store: any): Promise<void> {
        let args = command.split(' ')
        if (channel != null && args.length >= 2) {
            let user = args[1]
            let res = await api.post('channelInvite', { name: channel, username: user })
        } else {
            console.log("no channel or invalid format")
        }
    }
    // remove someone from a private channel
    revoke(params: any): never {
        throw new Error('Method not implemented.');
    }
    // kick someone from a public channel
    kick(params: any): never {
        throw new Error('Method not implemented.');
    }


    // main
    handle(command: string, channel: string | null, store: any): any {
        switch(command.split(' ')[0]) {
            case '/join':
                this.join(command, channel, store)
                break
            case '/cancel':
                this.cancel(command, channel, store)
                break
            case '/quit':
                this.quit(command, channel, store)
                break
            case '/list':
                return this.list(command, channel, store)
            case '/invite':
                this.invite(command, channel, store)
            default:
                break
        }
    }
}

export default new CommandManager();
