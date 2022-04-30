import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ActivityInterface } from './state';

const getters: GetterTree<ActivityInterface, StateInterface> = {
    onlineUsers(context) {
        return context.users !== null ? context.users : [];
    },
    pendingInvitations(context) {
        return context.invitations !== null ? context.invitations : [];
    },
};

export default getters;
