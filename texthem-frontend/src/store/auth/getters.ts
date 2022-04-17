import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const getters: GetterTree<AuthStateInterface, StateInterface> = {
    currUser(context) {
        return context.user
    },
    debug_all(context) {
        return context
    }
};

export default getters;
