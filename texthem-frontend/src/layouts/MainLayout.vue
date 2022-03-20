<template>
    <q-layout view="lHh LpR lFr">
        <Navbar></Navbar>
        <ChannelDrawer></ChannelDrawer>
        <UserDrawer></UserDrawer>
        <q-footer elevated class="bg-primary">
            <MessageSendBox></MessageSendBox>
        </q-footer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import Navbar from 'src/components/Navbar.vue'
import ChannelDrawer from 'src/components/ChannelDrawer.vue'
import UserDrawer from 'src/components/UserDrawer.vue'
import MessageSendBox from 'src/components/MessageSendBox.vue'
export default {

    components: {
        Navbar,
        ChannelDrawer,
        UserDrawer,
        MessageSendBox,
    }

}
</script>