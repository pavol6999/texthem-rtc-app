<template>
    <q-header elevated class="bg-primary text-white">
        <q-toolbar>
            <q-btn dense flat round icon="menu" @click="leftDrawerState = !leftDrawerState" />

            <q-toolbar-title>
                <div class="absolute-center">
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                    </q-avatar>TextThem
                </div>
            </q-toolbar-title>

            <!-- <q-btn dense flat round icon="menu" @click="toggleRightDrawer" /> -->
        </q-toolbar>
    </q-header>
</template>


<script lang="ts">
import { defineComponent } from 'vue'



export default defineComponent({
    // setup() {
    //     const $store = useStore()
    name: "Navbar",
    computed: {
        leftDrawerState: {
            get() {
                return this.$store.state.mainStore.leftDrawerState
            },
            set(val) {
                this.$store.commit('mainStore/toggleLeftDrawer', val)
            }
        },
    }
}


)
</script>
