<template>
    <div class="q-pa-md">
        <q-btn round outline class="without-icon" unelevated>
            <q-avatar :size="size">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-menu class="row q-pa-md">
                <div class="column">
                    <div class="text-h6 q-mb-md">Settings</div>
                    <q-toggle
                        :model-value="notifications"
                        checked-icon="check"
                        color="red"
                        @click="notifications = !notifications"
                        unchecked-icon="clear"
                        label="Notifications"
                    />
                    <q-toggle v-model="away" label="Away" />
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                    <q-avatar size="72px">
                        <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                    </q-avatar>

                    <div class="text-subtitle1 q-mt-sm q-mb-sm"> Meno Priezvisko </div>

                    <q-btn color="primary" label="Logout" push size="sm" v-close-popup />
                </div>
            </q-menu>
        </q-btn>
    </div>
</template>

<style scoped>
.without-icon i {
    display: none;
}
</style>

<script lang="ts">

import { defineComponent, ref } from 'vue'

export default defineComponent({
    props: {
        size: { type: String, default: '48px' }
    },
    setup() {
        return {

            away: ref(false)
        }
    },

    computed: {
        notifications: {
            get() {
                return this.$store.state.UserStore.notifications
            },
            set(val: boolean) {
                this.$store.commit('UserStore/setNotifications', val)
            }
        }
    }
}
)
</script>