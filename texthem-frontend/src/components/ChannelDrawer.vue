<template>
    <q-drawer v-model="leftSideDrawer" side="left" bordered>

        <p> Channel: {{ curr_channel }} </p>

        <q-expansion-item v-if="public_list.length !== 0"
            label="Public channels"
            icon="public"
            class="q-mb-sm"
        >
            <q-container v-for="item in public_list" :key="item.channel_name">
                
                <q-item clickable v-ripple @click="() => switch_channel(item.channel_name)">

                    <q-item-section avatar>
                        <q-avatar color="primary">
                            {{ item.channel_name.split('')[0] }}
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>{{ item.channel_name }}</q-item-label>
                    </q-item-section>
                </q-item>

            </q-container>
        </q-expansion-item>

        <q-separator/>

        <q-expansion-item v-if="private_list.length !== 0"
            label="Private channels"
            icon="unlocked"
            class="q-mb-sm"
        >
            <q-item v-for="item in private_list" :key="item.channel_name" class="q-mb-sm" clickable v-ripple @click="() => switch_channel(item.channel_name)">
                <q-item-section avatar>
                    <q-avatar color="primary">
                        {{ item.channel_name.split('')[0] }}
                    </q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.channel_name }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-expansion-item>

        <q-separator/> 

        <q-expansion-item v-if="invitation_list.length !== 0"
            label="Invitations"
            icon="mail"
        >
            <q-item v-for="item in invitation_list" :key="item.channel_name" class="q-mb-sm" clickable v-ripple @click="() => switch_channel(item.channel_name)">
                <q-item-section avatar>                    
                    <q-avatar color="primary">
                        {{ item.channel_name.split('')[0] }}
                    </q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.channel_name }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-expansion-item>

    </q-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { Channel } from 'components/models';

export default defineComponent({

    name: "ChannelDrawer",
    data() {
        const channels: Channel[] = [
            {channel_name: "Public1", ch_type:"public"},
            {channel_name: "Private1", ch_type:"private"},
            {channel_name: "Public2", ch_type:"public"},
            {channel_name: "Inv1", ch_type:"invitation"}
        ]
        return {
            channels,
            collapse_open: false
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
            return this.channels.filter(e => e.ch_type ==="public")
        },
        private_list(): Channel[] {
            return this.channels.filter(e => e.ch_type ==="private")
        },
        invitation_list(): Channel[] {
            return this.channels.filter(e => e.ch_type ==="invitation")
        },        
        curr_channel(): string {
            return this.$router.currentRoute._value.params.channel
        }
    },
    methods: {
        switch_channel(dest) {
            this.$router.push("/" + dest)
        }
    }
})
</script>
