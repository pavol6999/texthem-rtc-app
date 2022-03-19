import { MutationTree } from 'vuex';
import { GlobalStateInterface } from './state';

const mutation: MutationTree<GlobalStateInterface> = {
    toggleLeftDrawer(state: GlobalStateInterface, value: boolean) {
        state.leftDrawerState = value
    },
    toggleRightDrawer(state: GlobalStateInterface, value: boolean) {
        state.rightDrawerState = value;
    },
    toggleMobileNavbar(state: GlobalStateInterface, value: boolean) {
        state.mobileNavbarState = value
    },
};

export default mutation;
