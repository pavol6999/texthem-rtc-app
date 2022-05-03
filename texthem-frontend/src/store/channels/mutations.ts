import { SerializedMessage, User } from 'src/contracts';
import { MutationTree } from 'vuex';
import { ChannelsStateInterface } from './state';

const mutation: MutationTree<ChannelsStateInterface> = {
    LOADING_START(state) {
        state.loading = true;
        state.error = null;
    },
    LOADING_SUCCESS(
        state,
        {
            channel,
            messages,
            users,
        }: { channel: string; messages: SerializedMessage[]; users: User[] }
    ) {
        state.loading = false;
        state.messages[channel] = messages;
        state.users[channel] = users;
    },
    LOADING_ERROR(state, error) {
        state.loading = false;
        state.error = error;
    },
    CLEAR_CHANNEL(state, channel) {
        state.active = null;
        delete state.messages[channel];
        delete state.users[channel];
    },
    CLEAR_DELETED_CHANNEL(state, channel) {
        if (state.active == channel) {
            console.log('current channel was removed');
            state.active = null;
            delete state.messages[channel];
            delete state.users[channel];
        } else {
            console.log('some other channel was removed');
        }
    },
    SET_ACTIVE(state, channel: string) {
        state.active = channel;
    },
    NEW_MESSAGE(
        state,
        { channel, message }: { channel: string; message: SerializedMessage }
    ) {
        state.messages[channel].push(message);
    },
};

export default mutation;
