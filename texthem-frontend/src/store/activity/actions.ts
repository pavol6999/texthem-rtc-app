import { api } from 'src/boot/axios';
import { toRaw } from 'vue';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ActivityInterface } from './state';
import { activityService, channelService } from 'src/services';
import { join } from 'path';
const actions: ActionTree<ActivityInterface, StateInterface> = {
    async removed_user({ state, commit }, { channel, username }) {
        await channelService.in(channel)?.sendKick(username);
    },

    async invite({ state, commit }, { channel, user }) {
        try {
            commit('INVITE_START');
            let res = await api.post('channelInvite', {
                name: channel,
                username: user,
            });
            if (res.status == 200) {
                const invitee = state.users.find((u) => u.nickname == user);

                if (invitee) {
                    await activityService.sendInvite(invitee);
                }
            }

            if (res === null) {
                commit('INVITE_ERROR', null);
            } else {
                commit('INVITE_SUCCESS', res);
            }
        } catch (err) {
            commit('INVITE_ERROR', err);
            throw err;
        }
    },

    async join_ch({ state, commit, rootState, dispatch }, ch_name: string) {
        await dispatch(
            'channels/newUser',
            { user: rootState.auth.user, channel_name: ch_name },
            { root: true }
        );
    },

    async inv_acc({ state, commit, rootState, dispatch }, ch_name: string) {
        let clone = [];

        if (rootState.auth.user) {
            for (let i = 0; i < state.invitations.length; i++) {
                if (state.invitations[i].name === ch_name) {
                    let payload = {
                        invite: state.invitations[i],
                        root: rootState,
                    };
                    commit('ACC_INV', payload);

                    dispatch('channels/join', ch_name, { root: true });
                    await dispatch(
                        'channels/newUser',
                        { user: rootState.auth.user, channel_name: ch_name },
                        { root: true }
                    );
                    // rootState.auth.user.channels.push(state.invitations[i]);
                }
            }
        }
    },
    async inv_dec({ state, commit, rootState }, ch_name: string) {
        let clone = [];
        if (rootState.auth.user) {
            for (let i = 0; i < state.invitations.length; i++) {
                if (state.invitations[i].name === ch_name) {
                    commit('DEC_INV', state.invitations[i]);
                }
            }
        }
    },
};

export default actions;
