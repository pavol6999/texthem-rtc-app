<template>
    <q-layout view="hHh lpR fFf">
        <Navbar></Navbar>
        <q-drawer v-model="leftDrawerOpen" side="left" overlay elevated>
            <!-- drawer content -->
        </q-drawer>

        <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
            <!-- drawer content -->
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import { ref } from 'vue'
import Navbar from 'src/components/Navbar.vue'
export default {
    setup() {
        const leftDrawerOpen = ref(false)
        const rightDrawerOpen = ref(false)

        return {
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value
            },

            rightDrawerOpen,
            toggleRightDrawer() {
                rightDrawerOpen.value = !rightDrawerOpen.value
            }
        }
    },
    components: {
        Navbar
    }
}
</script>