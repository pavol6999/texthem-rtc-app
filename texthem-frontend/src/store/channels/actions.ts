import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelsStateInterface } from './state';
import { channelService } from 'src/services';
import { RawMessage } from 'src/contracts';
import { api } from 'src/boot/axios';
import ChannelService from 'src/services/ChannelService';

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
    async join({ commit }, channel: string) {
        try {
            commit('LOADING_START');
            const messages = await channelService.join(channel).loadMessages();
            let users = (await api.get('listUsers/' + channel)).data.items;

            commit('LOADING_SUCCESS', { channel, messages, users });
        } catch (err) {
            commit('LOADING_ERROR', err);
            throw err;
        }
    },
    async loadNewMessages(
        { commit, state },
        { channel: channel, timestamp: timestamp }
    ) {
        try {
            commit('NEW_MESSAGE_LOADING_START');

            const messages = await channelService
                .in(channel)
                ?.loadNewMessages(timestamp);
            commit('NEW_MESSAGE_LOADING_SUCCESS', { channel, messages });
        } catch (err) {
            commit('LOADING_ERROR', err);
            throw err;
        }
    },

    // async joinblanknamespace( {commit} ) {
    //     await channelService.joinblanknamespace()
    // },
    async leave({ getters, commit, rootState }, channel: string | null) {
        const leaving: string[] =
            channel !== null ? [channel] : getters.joinedChannels;

        leaving.forEach(async (c) => {
            await channelService.in(c)?.notifyLeave(rootState.auth.user!);
            channelService.leave(c);

            commit('CLEAR_CHANNEL', c);
        });
    },
    async addMessage(
        { commit },
        { channel, message }: { channel: string; message: RawMessage }
    ) {
        const newMessage = await channelService
            .in(channel)
            ?.addMessage(message);
        commit('NEW_MESSAGE', { channel, message: newMessage });
    },

    async newUser({ commit }, { user, channel_name }) {
        await channelService.in(channel_name)?.notify(user);
    },

    async someoneTyping(
        { commit, state },
        {
            channel,
            message,
            user,
        }: { channel: string; user: string; message: string }
    ) {
        ChannelService.in(channel)?.addTyping(channel, user, message);
    },
};

export default actions;
