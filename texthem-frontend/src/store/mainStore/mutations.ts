import { MutationTree } from 'vuex';
import { GlobalStateInterface } from './state';

const mutation: MutationTree<GlobalStateInterface> = {
    toggleLeftDrawer(state: GlobalStateInterface) {
        state.leftDrawerState = !state.leftDrawerState;
    },
    toggleRightDrawer(state: GlobalStateInterface) {
        state.rightDrawerState = !state.rightDrawerState;
    },
    toggleMobileNavbar(state: GlobalStateInterface) {
        state.mobileNavbarState = !state.mobileNavbarState;
    },
};

export default mutation;
