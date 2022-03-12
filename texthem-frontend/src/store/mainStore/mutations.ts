import { MutationTree } from 'vuex';
import { GlobalStateInterface } from './state';

const mutation: MutationTree<GlobalStateInterface> = {
    toggleLeftDrawer(state: GlobalStateInterface, active: boolean) {
        state.leftDrawerState = active;
    },
    toggleRightDrawer(state: GlobalStateInterface, active: boolean) {
        state.rightDrawerState = active;
    },
    toggleMobileNavbar(state: GlobalStateInterface, active: boolean) {
        state.mobileNavbarState = active;
    },
};

export default mutation;
