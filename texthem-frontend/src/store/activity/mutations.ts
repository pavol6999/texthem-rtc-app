import { Channel } from 'src/components/interface/models';
import { User } from 'src/contracts';
import { MutationTree } from 'vuex';
import { ActivityInterface } from './state';

const mutation: MutationTree<ActivityInterface> = {
    USER_CONNECTED(state, user: User) {
        state.users.push(user);
    },

    USER_DISCONNECTED(state, user: User) {
        state.users = state.users.filter((u) => u.id != user.id);
    },
    ONLINE_USERS_LIST(state, users: User[]) {
        state.users = users;
    },

    INVITATIONS_LIST(state, invitations: Channel[]) {
        state.invitations = invitations;
    },

    INVITE_START(state) {
        state.status = 'pending';
        state.errors = [];
    },
    INVITE_SUCCESS(state) {
        state.status = 'success';
        state.errors = [];
    },
    INVITE_ERROR(state, errors) {
        state.status = 'error';
        state.errors = errors;
    },

    ACC_INV(state, payload) {
        console.log('mutation acc inv:');
        console.log(payload);
        let clone = [];

        for (let i = 0; i < state.invitations.length; i++) {
            if (state.invitations[i].name != payload.invite.name)
                clone.push(state.invitations[i]);
        }
        state.invitations = clone;
        payload.root.auth.user!.channels.push(payload.invite);
        // state.user?.channels.push(new_ch)
    },
    DEC_INV(state, new_ch) {
        console.log('mutation dec inv:');
        console.log(new_ch);
        let clone = [];

        for (let i = 0; i < state.invitations.length; i++) {
            if (state.invitations[i].name != new_ch.name)
                clone.push(state.invitations[i]);
        }
        state.invitations = clone;
    },
};

export default mutation;
