<template>
    <div class="q-pa-md">
        <q-btn round outline class="without-icon" unelevated>
            <q-avatar :color="get_color(username)" text-color="white" :size="size">
                {{ initial }}
            </q-avatar>

            <q-menu class="row q-pa-md">
                <div class="column">
                    <div class="text-h6 q-mb-md">Settings</div>
                    <q-toggle :model-value="notifications" checked-icon="check" color="red"
                        @click="notifications = !notifications" unchecked-icon="clear" label="Notifications" />
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                    <q-avatar :color="get_color(username)" text-color="white" size="72px">
                        {{ initial }}
                    </q-avatar>

                    <div class="text-subtitle1 q-mt-sm q-mb-sm"> {{ username }} </div>

                    <q-btn color="primary" label="Logout" @click="logout" push size="sm" />
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
import { mapActions } from 'vuex'

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
        username(): string {            
            return this.$store.getters['auth/currUser'].nickname|| 'no name?'
        },
        initial(): string {
            return this.username.toUpperCase().split('')[0]
        },
        notifications: {
            get() {
                return this.$store.state.auth.user?.notifications || false
            },
            set(val: boolean) {
                this.$store.commit('auth/setNotifications', val)
            }
        }
    },
    methods: {
        ...mapActions('auth', ['logout']),
        get_color(name: string): string {
            let sum = 0
            name.split('').forEach(element => {
                sum = element.charCodeAt(0)*element.charCodeAt(0) + 27 + sum
            });            
            switch(sum % 6) {
                case 0: return 'green'
                case 1: return 'red'
                case 2: return 'purple'
                case 3: return 'grey'
                case 4: return 'blue'
                case 5: return 'brown'
            }
            return 'purple'
        },
    }
}
)
</script>
