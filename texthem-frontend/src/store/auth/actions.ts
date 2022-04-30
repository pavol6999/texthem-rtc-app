import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
import { authService, authManager } from 'src/services';
import { LoginCredentials, RegisterData } from 'src/contracts';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
    async check({ state, commit, dispatch }) {
        try {
            commit('AUTH_START');
            let res = await authService.me();
            if (res === null) {
                commit('AUTH_ERROR', null);
            } else {
                const user = res.user;

                user.channels = res.real_channels;

                if (user?.id !== state.user?.id) {
                    console.log('idk');
                    // just logged in?
                    // await dispatch('channels/joinblanknamespace', null, { root: true })
                    // await dispatch('channels/join', 'general', { root: true });
                }
                commit('AUTH_SUCCESS', user);
                return user !== null;
            }
        } catch (err) {
            commit('AUTH_ERROR', err);
            throw err;
        }
    },
    async register({ commit }, form: RegisterData) {
        try {
            commit('AUTH_START');
            const user = await authService.register(form);
            commit('AUTH_SUCCESS', null);
            return user;
        } catch (err) {
            commit('AUTH_ERROR', err);
            throw err;
        }
    },
    async login({ commit }, credentials: LoginCredentials) {
        try {
            commit('AUTH_START');
            const apiToken = await authService.login(credentials);
            commit('AUTH_SUCCESS', null);
            // save api token to local storage and notify listeners
            authManager.setToken(apiToken.token);
            return apiToken;
        } catch (err) {
            commit('AUTH_ERROR', err);
            throw err;
        }
    },
    async logout({ commit, dispatch }) {
        try {
            commit('AUTH_START');
            await authService.logout();
            commit('AUTH_SUCCESS', null);
            // remove api token and notify listeners
            await dispatch('channels/leave', null, { root: true });
            authManager.removeToken();
        } catch (err) {
            commit('AUTH_ERROR', err);
            throw err;
        }
    },
};

export default actions;
