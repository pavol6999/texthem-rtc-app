<template>
    <q-header elevated class="bg-primary text-white">
        <q-toolbar>
            <q-item dense clickable flat v-if="!disabled" icon="menu" @click="leftSideDrawer = !leftSideDrawer">
                <q-item-section avatar>
                    <q-icon rounded name="menu" />
                </q-item-section>
                <q-item-section>
                    <q-item-label v-if="$q.screen.gt.xs" style="margin-left: -10px; ">Channels
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-toolbar-title>
                <div class="absolute-center">
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                    </q-avatar>TextThem
                </div>
            </q-toolbar-title>

            <q-item dense v-if="!disabled" rounded clickable flat icon-right="group"
                @click="rightSideDrawer = !rightSideDrawer">
                <q-item-section avatar>
                    <q-icon right rounded name="group" />
                </q-item-section>
                <q-item-section>
                    <q-item-label v-if="$q.screen.gt.xs" style="margin-right: 10px; ">Users</q-item-label>
                </q-item-section>
            </q-item>
        </q-toolbar>
    </q-header>
</template>



<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import UserProfile from './UserProfile.vue'


export default defineComponent({

    name: "Navbar",

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
