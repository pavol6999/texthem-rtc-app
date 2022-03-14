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
import Navbar from 'src/components/Navbar.vue'
export default {

    components: {
        Navbar
    },

}
</script>