import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GlobalStateInterface } from './state';

const actions: ActionTree<GlobalStateInterface, StateInterface> = {
    someAction(/* context */) {
        // your code
    },
};

export default actions;
