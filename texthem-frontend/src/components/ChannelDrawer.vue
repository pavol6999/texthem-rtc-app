<template>
    <q-drawer v-model="leftSideDrawer" side="left" bordered>
        <div class="text-h4 row justify-center" style="margin-top:15px">Channels</div>
        <q-expansion-item v-if="invitation_list.length !== 0" label="Invitations" header-class="text-yellow"
            icon="mail">
            <q-item v-for="item in invitation_list" :active="link === item.channel_name" :key="item.channel_name"
                active-class="sel_item">
                <q-item-section avatar>
                    <q-avatar color="primary">{{ item.channel_name.split('')[0] }}</q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.channel_name }}</q-item-label>
                </q-item-section>

                <q-btn round size="sm" class="inv_btn" color="green" icon="check" />
                <q-btn round size="sm" class="inv_btn" color="red" icon="close" />
            </q-item>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item v-if="public_list.length !== 0" label="Public channels" icon="public" class="q-mb-sm">
            <q-item v-for="item in public_list" :active="link === item.name" :key="item.name" clickable v-ripple
                @click="() => switch_channel(item.name)" active-class="sel_item">
                <q-item-section avatar>
                    <q-avatar color="primary">{{ item.name.split('')[0] }}</q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.name }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item v-if="private_list.length !== 0" label="Private channels" icon="unlocked" class="q-mb-sm">
            <q-item v-for="item in private_list" :active="link === item.name" :key="item.name" clickable v-ripple
                @click="() => switch_channel(item.name)" active-class="sel_item">
                <q-item-section avatar>
                    <q-avatar color="primary">{{ item.name.split('')[0] }}</q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.name }}</q-item-label>
                </q-item-section>

            </q-item>
        </q-expansion-item>

        <q-separator />
        <div style="
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

import { Channel, Invitation } from './interface/models';

export default defineComponent({

    name: "ChannelDrawer",
    data() {
        const channels: Channel[] = [


            { name: "Public1", type: "public" },
            { name: "Private1", type: "private" },
            { name: "Public2", type: "public" },
            { name: "Inv1", type: "invitation" }
        ]
        const invitations: Invitation[] = [
            { channel_name: "Inv1" }
        ]
        return {
            channels,
            invitations,
            collapse_open: false,
            link: ref(this.$router.currentRoute.value.params.channel),
            message: '',
            loading: false
        }
    },
    computed: {

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
        invitation_list(): Invitation[] {
            return this.invitations
        },
        ...mapGetters('channels', {
            channels: 'joinedChannels',
            lastMessageOf: 'lastMessageOf'
        }),

        activeChannel() {
            return this.$store.state.channels.active
        }
    },
    methods: {
        switch_channel(dest: string) {
            this.link = dest
            this.$router.push("/channels/" + dest)
        },
        async send() {
            this.loading = true
            await this.addMessage({ channel: this.activeChannel, message: this.message })
            this.message = ''
            this.loading = false
        },
        ...mapMutations('channels', {
            setActiveChannel: 'SET_ACTIVE'
        }),
        ...mapActions('auth', ['logout']),
        ...mapActions('channels2', ['addMessage'])

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

