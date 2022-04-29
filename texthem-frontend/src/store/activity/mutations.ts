import { User } from 'src/contracts';
import { MutationTree } from 'vuex';
import { ActivityInterface } from './state';

const mutation: MutationTree<ActivityInterface> = {
    LOADING_START(state) {
        state.loading = true;
        state.error = null;
    },
    LOADING_SUCCESS(
        state,
        { channel, users }: { channel: string; users: User[] }
    ) {
        state.loading = false;
        state.users[channel] = users;
    },
    LOADING_ERROR(state, error) {
        state.loading = false;
        state.error = error;
    },
    CLEAR_CHANNEL(state, channel) {
        state.active = null;
        delete state.users[channel];
    },
    CLEAR_DELETED_CHANNEL(state, channel) {
        if (state.active == channel) {
            console.log('current channel was removed');
            state.active = null;
            delete state.users[channel];
        } else {
            console.log('some other channel was removed');
        }
    },
    SET_ACTIVE(state, channel: string) {
        state.active = channel;
    },
    NEW_USER(state, { channel, user }: { channel: string; user: User }) {
        state.users[channel].push(user);
    },
};

export default mutation;
