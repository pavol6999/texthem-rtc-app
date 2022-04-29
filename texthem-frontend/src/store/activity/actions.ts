import { api } from 'src/boot/axios';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ActivityInterface } from './state';

const actions: ActionTree<ActivityInterface, StateInterface> = {
    async list({ commit }, channel: string) {
        try {
            commit('LOADING_START');
            let res = await api.get('listUsers/' + channel);
            const users = res.data!.items;

            commit('LOADING_SUCCESS', { channel, users });
        } catch (err) {
            commit('LOADING_ERROR', err);
            throw err;
        }
    },
};

export default actions;
