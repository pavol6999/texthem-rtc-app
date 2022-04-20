import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
import { authService, authManager } from 'src/services';
import { LoginCredentials, RegisterData } from 'src/contracts';
import { QPullToRefresh } from 'quasar';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
    async check({ state, commit, dispatch }) {
        try {
            commit('AUTH_START');
            let res = await authService.me()
            if (res === null) {
                commit('AUTH_ERROR', null)
            } else {
                const user = res.user
                user.invitations = res.invitations
                user.channels = res.real_channels

                if (user?.id !== state.user?.id) {
                    console.log("idk")
                    // just logged in
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
    async inv_acc( {state, commit}, ch_name: string ) {
        if (state.user) {
            for (let i = 0; i < state.user.invitations.length; i++) {
                if (state.user.invitations[i].name === ch_name) {
                    commit('ACC_INV', state.user.invitations[i])
                }
            }
        }
    },
    async inv_dec( {state, commit}, ch_name: string) {
        if (state.user) {
            for (let i = 0; i < state.user.invitations.length; i++) {
                if (state.user.invitations[i].name === ch_name) {
                    commit('DEC_INV', state.user.invitations[i])
                }
            }
        }
    }
};

export default actions;
