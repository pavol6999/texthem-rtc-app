<template>
    <q-header elevated class="bg-primary text-white">
        <q-toolbar>
            <q-btn
                dense
                flat
                v-if="isLoggedIn && !disabled"
                round
                icon="menu"
                @click="leftSideDrawer = !leftSideDrawer"
            >
                <q-label v-if="$q.screen.gt.xs" style="margin-left: 10px; margin-top:2px">Channels</q-label>
            </q-btn>

            <q-toolbar-title>
                <div class="absolute-center">
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                    </q-avatar>TextThem
                </div>
            </q-toolbar-title>
            <!-- <UserProfile></UserProfile> -->
            <q-btn
                v-if="isLoggedIn && !disabled"
                rounded
                flat
                icon-right="group"
                @click="rightSideDrawer = !rightSideDrawer"
            >
                <q-label v-if="$q.screen.gt.xs" style="margin-right: 10px; margin-top:2px">Users</q-label>
            </q-btn>
        </q-toolbar>
    </q-header>
</template>



<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import UserProfile from './UserProfile.vue'


export default defineComponent({

    name: "Navbar",
    components: { UserProfile },
    props: {
        disabled: {
            type: Boolean,
            default: false,
        }
    },
    computed: {

        rightSideDrawer: {
            get() {
                return this.$store.state.mainStore.rightDrawerState
            },
            set(val: boolean) {

                this.$store.commit('mainStore/toggleRightDrawer', val)
            },
        },
        leftSideDrawer: {
            get() {
                return this.$store.state.mainStore.leftDrawerState
            },
            set(val: boolean) {

                this.$store.commit('mainStore/toggleLeftDrawer', val)
            },
        },
        ...mapGetters('UserStore', {
            isLoggedIn: 'isLoggedIn'
        })
    },
    methods: {
        // ...mapMutations('mainStore', {
        //     toggleLeftDrawer: 'toggleLeftDrawer',

        // }),
        ...mapMutations('UserStore', {
            changeLoggedStatus: 'changeLoggedStatus'
        }),
    }
}



)
</script>
