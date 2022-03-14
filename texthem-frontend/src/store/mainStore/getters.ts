import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { GlobalStateInterface } from './state';

const getters: GetterTree<GlobalStateInterface, StateInterface> = {
    leftSideDrawer(state: GlobalStateInterface) {
        return state.leftDrawerState;
    },
    rightSideDrawer(state: GlobalStateInterface) {
        return state.rightDrawerState;
    },
    mobileNavbar(state: GlobalStateInterface) {
        return state.mobileNavbarState;
    },
};

export default getters;
