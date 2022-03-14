export interface GlobalStateInterface {
    leftDrawerState: boolean;
    rightDrawerState: boolean;
    mobileNavbarState: boolean;
}

import { LocalStorage, SessionStorage } from 'quasar';

function state(): GlobalStateInterface {
    return {
        leftDrawerState: true,
        rightDrawerState: true,
        mobileNavbarState: false,
    };
}

export default state;
