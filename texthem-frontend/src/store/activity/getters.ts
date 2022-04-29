import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ActivityInterface } from './state';

const getters: GetterTree<ActivityInterface, StateInterface> = {
    listUsers(context) {
        return context.active !== null ? context.users[context.active] : [];
    },
    activeChannel(context) {
        return context.active;
    },
};

export default getters;
