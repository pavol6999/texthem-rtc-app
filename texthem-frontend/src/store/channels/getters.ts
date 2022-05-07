import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelsStateInterface } from './state';

const getters: GetterTree<ChannelsStateInterface, StateInterface> = {
    joinedChannels(context) {
        return Object.keys(context.messages);
    },
    typers(context) {
        return context.typing !== null ? context.typing : [];
    },
    currentMessages(context) {
        return context.active !== null ? context.messages[context.active] : [];
    },
    currentUsers(context) {
        return context.active !== null ? context.users[context.active] : [];
    },
    lastMessageOf(context) {
        return (channel: string) => {
            const messages = context.messages[channel];
            return messages.length > 0 ? messages[messages.length - 1] : null;
        };
    },
    debug_all(context) {
        return context;
    },
    activeChannel(context) {
        return context.active;
    },
};

export default getters;
