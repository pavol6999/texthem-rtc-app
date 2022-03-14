<template>
    <q-header elevated class="bg-primary text-white">
        <q-toolbar>
            <q-btn dense flat v-if="isLoggedIn" round icon="menu" @click="toggleLeftDrawer" />

            <q-toolbar-title>
                <div class="absolute-center">
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                    </q-avatar>TextThem
                </div>
            </q-toolbar-title>
            <q-btn dense v-if="isLoggedIn" round flat icon="group" @click="toggleRightDrawer" />
        </q-toolbar>
    </q-header>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters, mapMutations } from 'vuex'



export default defineComponent({

    name: "Navbar",
    computed: {
        ...mapGetters('mainStore', {
            leftSideDrawer: 'leftSideDrawer',
            rightSideDrawer: 'rightSideDrawer'
        }),
        ...mapGetters('UserStore', {
            isLoggedIn: 'isLoggedIn'
        })
    },
    methods: {
        ...mapMutations('mainStore', {
            toggleLeftDrawer: 'toggleLeftDrawer',
            toggleRightDrawer: 'toggleRightDrawer',
        }),
        ...mapMutations('UserStore', {
            changeLoggedStatus: 'changeLoggedStatus'
        }),
    }
}



)
</script>
