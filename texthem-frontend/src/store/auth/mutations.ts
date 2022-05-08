import { User } from 'src/contracts';
import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';
import { activityService, channelService } from 'src/services';

const mutation: MutationTree<AuthStateInterface> = {
    AUTH_START(state) {
        state.status = 'pending';
        state.errors = [];
    },
    AUTH_SUCCESS(state, user: User | null) {
        state.status = 'success';
        state.user = user;
    },
    AUTH_ERROR(state, errors) {
        state.status = 'error';
        state.errors = errors;
    },
    setNotifications(state, val: boolean) {
        if (state.user) {
            state.user.notifications = val;    
            activityService.setNotifState(state.user);
        }
    },
    NEW_CHANNEL(state, new_ch) {
        console.log('mutation new channel:');
        console.log(new_ch);
        state.user?.channels.push(new_ch);
    },
    CHANNEL_DELETED(state, ch) {
        if (state.user != null) {
            state.user.channels = state.user.channels.filter((e) => {
                return e.name != ch;
            });
        }
    },
    LEFT_CHANNEL(state, ch) {
        console.log('mutation leaving channel:');
        console.log(ch);
        if (state.user != null) {
            // remove the channel from store
            state.user.channels = state.user.channels.filter((e) => {
                return e.id != ch.id;
            });
        }
    },
    LEFT_CHANNEL_NAME(state, ch) {
        if (state.user != null) {
            state.user.channels = state.user.channels.filter(e => {
                return e.name != ch
            })
        }
    }
};

export default mutation;
