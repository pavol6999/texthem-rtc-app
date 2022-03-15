<template>
    <q-drawer v-model="leftSideDrawer" side="left" bordered>
        <!-- drawer content -->
    </q-drawer>
</template>




<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({

    name: "ChannelDrawer",
    computed: {
        leftSideDrawer: {
            get() {
                return this.$store.state.mainStore.leftDrawerState
            },
            set(val: boolean) {

                this.$store.commit('mainStore/toggleLeftDrawer', val)
            },
        },
    }
})
</script>
