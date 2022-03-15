<template>
    <q-drawer v-model="leftSideDrawer" side="left" bordered>


        <q-expansion-item v-if="public_list.length !== 0"
            expand-separator
            label="Public channels"
        >
            <q-item v-for="item in public_list" :key="item.channel_name" class="q-mb-sm" clickable v-ripple>
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

        <q-expansion-item v-if="private_list.length !== 0"
            expand-separator
            label="Private channels"
        >
            <q-item v-for="item in private_list" :key="item.channel_name" class="q-mb-sm" clickable v-ripple>
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

        <q-expansion-item v-if="invitation_list.length !== 0"
            expand-separator
            label="Invitations"
        >
            <q-item v-for="item in invitation_list" :key="item.channel_name" class="q-mb-sm" clickable v-ripple>
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

interface Channel {
    channel_name: string,
    ch_type: string
}

export default defineComponent({

    name: "ChannelDrawer",
    data() {
        const channels: Channel[] = [
            {channel_name: "public1", ch_type:"public"},
            {channel_name: "private1", ch_type:"private"},
            {channel_name: "public2", ch_type:"public"},
            {channel_name: "inv1", ch_type:"invitation"}
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
        }
    }
})
</script>
