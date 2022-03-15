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
            />

            <q-toolbar-title>
                <div class="absolute-center">
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                    </q-avatar>TextThem
                </div>
            </q-toolbar-title>
            <q-btn
                dense
                v-if="isLoggedIn && !disabled"
                round
                flat
                icon="group"
                @click="rightSideDrawer = !rightSideDrawer"
            />
        </q-toolbar>
    </q-header>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters, mapMutations } from 'vuex'



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
