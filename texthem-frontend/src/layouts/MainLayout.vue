<template>
    <q-layout view="lhh LpR fFf">
        <Navbar></Navbar>
        <ChannelDrawer></ChannelDrawer>
        <UserDrawer></UserDrawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import Navbar from 'src/components/Navbar.vue'
import ChannelDrawer from 'src/components/ChannelDrawer.vue'
import UserDrawer from 'src/components/UserDrawer.vue'

export default {

    components: {
        Navbar,
        ChannelDrawer,
        UserDrawer,

    },

}
</script>