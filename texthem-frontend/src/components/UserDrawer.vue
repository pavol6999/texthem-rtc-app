<template>
    <q-drawer v-model="rightSideDrawer" side="right" overlay elevated>
        <!-- drawer content -->
    </q-drawer>
</template>




<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({

    name: "UserDrawer",
    computed: {
        rightSideDrawer: {
            get() {
                return this.$store.state.mainStore.rightDrawerState
            },
            set(val: boolean) {

                this.$store.commit('mainStore/toggleRightDrawer', val)
            },
        }
        ,

    },
    // methods: {
    //     ...mapMutations('mainStore', {
    //         toggleRightSideDrawer: 'toggleRightSideDrawer'
    //     }),
    // }
})
</script>
