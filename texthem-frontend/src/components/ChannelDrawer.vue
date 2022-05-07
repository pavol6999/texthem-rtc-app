<template>
    <q-drawer v-model="leftSideDrawer" side="left" bordered>
        <div class="text-h4 row justify-center" style="margin-top:15px; margin-bottom:15px">Channels</div>
        <q-expansion-item v-if="invitation_list.length !== 0" label="Invitations" header-class="text-yellow"
            icon="mail">
            <q-item v-for="item in invitation_list" :key="item.name" active-class="sel_item">
                <q-item-section avatar>
                    <q-avatar color="primary">{{ initial(item.name) }}</q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.name }}</q-item-label>
                </q-item-section>

                <q-btn round size="sm" class="inv_btn" color="green" icon="check" @click="inv_accept(item.name)" />
                <q-btn round size="sm" class="inv_btn" color="red" icon="close" @click="inv_decline(item.name)" />
            </q-item>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item v-if="public_list.length !== 0" label="Public channels" icon="public" class="q-mb-sm">
            <q-scroll-area style="height: 30vh">
                <q-item v-for="item in public_list" :active="activeChannel === item.name" :key="item.name" clickable
                    v-ripple @click="() => switch_channel(item.name)" active-class="sel_item">
                    <q-item-section avatar>
                        <q-avatar color="primary">{{ initial(item.name) }}</q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>{{ item.name }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-scroll-area>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item v-if="private_list.length !== 0" label="Private channels" icon="unlocked" class="q-mb-sm">
            <q-item v-for="item in private_list" :active="activeChannel === item.name" :key="item.name" clickable
                v-ripple @click="() => switch_channel(item.name)" active-class="sel_item">
                <q-item-section avatar>
                    <q-avatar color="primary">{{ initial(item.name) }}</q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.name }}</q-item-label>
                </q-item-section>

            </q-item>
        </q-expansion-item>

        <q-separator />
        <div v-if="false" style="
            display: flex;
            justify-content: center;
        ">
            <q-btn dense rounded icon="add" flat color="blue" style="margin-top:15px">Create a new channel</q-btn>
        </div>
    </q-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { channelService } from 'src/services';
import { Channel } from './interface/models';
import { api } from "src/boot/axios";

export default defineComponent({

    name: "ChannelDrawer",
    computed: {
        channels() {
            return this.$store.getters['auth/currUser'].channels
        },
        invitations() {
            return this.$store.getters['activity/pendingInvitations']
        },
        leftSideDrawer: {
            get() {
                return this.$store.state.mainStore.leftDrawerState
            },
            set(val: boolean) {

                this.$store.commit('mainStore/toggleLeftDrawer', val)
            },
        },
        public_list(): Channel[] {
            return this.channels.filter((e: { type: string; }) => e.type === "public")
        },
        private_list(): Channel[] {
            return this.channels.filter((e: { type: string; }) => e.type === "private")
        },
        invitation_list(): Channel[] {
            return this.invitations
        },
        ...mapGetters('channels2', {
            // channels: 'joinedChannels',
            lastMessageOf: 'lastMessageOf'
        }),
        activeChannel() {
            let ch = this.$store.getters['channels/activeChannel']
            return ch
        }
    },
    methods: {
        async inv_accept(ch_name: string) {
            let res = await api.post('inviteAccept', { name: ch_name })
            if (res.status == 200) {
                this.$store.dispatch('activity/inv_acc', ch_name)

            }
        },
        async inv_decline(ch_name: string) {
            let res = await api.post('inviteDecline', { name: ch_name })
            if (res.status == 200) {
                this.$store.dispatch('activity/inv_dec', ch_name)
            }
        },
        initial(name: string): string {
            return name.toUpperCase().split('')[0]
        },
        ...mapMutations('channels', {
            setActiveChannel: 'SET_ACTIVE'
        }),
        ...mapActions('auth', ['logout']),
        ...mapActions('channels2', ['addMessage']),

        switch_channel(dest: string) {
            this.setActiveChannel(dest)
            //if (!this.$store.getters['channels/joinedChannels'].includes(dest))
            //  this.$store.dispatch('channels/join', dest, { root: true });

        }
    }

});
</script>

<style>
.sel_item {
    color: white;
    background: #9c27b0;
}

.inv_btn {
    margin: 4px;
}
</style>

