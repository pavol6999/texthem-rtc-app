export interface GlobalStateInterface {
    leftDrawerState: boolean;
    rightDrawerState: boolean;
    mobileNavbarState: boolean;
}

function state(): GlobalStateInterface {
    return {
        leftDrawerState: false,
        rightDrawerState: false,
        mobileNavbarState: false,
    };
}

export default state;
