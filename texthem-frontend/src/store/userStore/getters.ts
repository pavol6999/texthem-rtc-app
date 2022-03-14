import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { UserStateInterface } from './state';

const getters: GetterTree<UserStateInterface, StateInterface> = {
    getJWT(state: UserStateInterface) {
        return state.jwt;
    },
    isLoggedIn(state: UserStateInterface) {
        return state.isLogged;
    },
    getUsername(state: UserStateInterface) {
        return state.username;
    },
};

export default getters;
