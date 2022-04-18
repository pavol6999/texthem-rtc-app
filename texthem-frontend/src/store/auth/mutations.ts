import { User } from 'src/contracts';
import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

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
        if (state.user)
            state.user.notifications = val
    },
    NEW_CHANNEL(state, new_ch) {
        console.log("mutation new channel:")
        console.log(new_ch)        
        state.user?.channels.push(new_ch)
    },
    CHANNEL_DELETED(state, ch) {
        if (state.user != null) {
            state.user.channels = state.user.channels.filter((e) => {
                return e.name != ch
            })
        }
    },
    LEFT_CHANNEL(state, ch) {
        console.log("mutation leaving channel:")
        console.log(ch)
        if (state.user != null) {
            // remove the channel from store
            state.user.channels = state.user.channels.filter((e) => {
               return e.id != ch.id
            })
        }
    },
    ACC_INV(state, new_ch) {
        console.log("mutation acc inv:")
        console.log(new_ch)     
        let clone = []
        if (state.user) {
            for (let i = 0; i < state.user?.invitations.length; i++) {
                if (state.user.invitations[i].name != new_ch.name)
                    clone.push(state.user.invitations[i])
            }
            state.user.invitations = clone
        }
        state.user?.channels.push(new_ch)
    },
    DEC_INV(state, new_ch) {
        console.log("mutation dec inv:")
        console.log(new_ch)     
        let clone = []
        if (state.user) {
            for (let i = 0; i < state.user?.invitations.length; i++) {
                if (state.user.invitations[i].name != new_ch.name)
                    clone.push(state.user.invitations[i])
            }
            state.user.invitations = clone
        }
    }
};

export default mutation;
