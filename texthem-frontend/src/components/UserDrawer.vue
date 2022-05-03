<template>
    <q-drawer v-model="rightSideDrawer" side="right" elevated>

        <q-item-label header>Online</q-item-label>
        <TransitionGroup name="list">
            <q-item v-for="item in online_list" :key="item.nickname" clickable class="q-my-sm" v-ripple>

                <q-item-section side>
                    <q-spinner-comment color="secondary" size="2em" />
                </q-item-section>
                <q-item-section avatar>
                    <q-avatar color="yellow" text-color="primary" class="circle">{{ item.nickname.split('')[0] }}
                    </q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.nickname }}</q-item-label>
                    <q-item-label caption>is writing...</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-badge color="green">Online</q-badge>
                </q-item-section>
            </q-item>
        </TransitionGroup>

        <q-separator />
        <q-item-label header>Offline</q-item-label>
        <TransitionGroup name="list" tag="ul">
            <q-item v-for="item in offline_list" :key="item.nickname" class="q-mb-sm" clickable v-ripple>
                <q-item-section avatar>
                    <q-avatar color="primary" text-color="grey">{{ item.nickname.split('')[0] }}</q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label class="offline_usrname">{{ item.nickname }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-badge color="grey">Offline</q-badge>
                </q-item-section>
            </q-item>
        </TransitionGroup>
    </q-drawer>
    <q-dialog v-model="user_dialog" transition-show="fade" transition-hide="fade">
        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section class="row items-center justify-center">
                <q-avatar color="primary" text-color="grey">{{ clicked_user.nickname.split('')[0] }}</q-avatar>
                <span class="q-ml-sm">{{ clicked_user.nickname }}</span>
            </q-card-section>
            <q-card-section>
                <q-input filled v-model="typedMsg" autogrow disable readonly />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Exit" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>


<script lang="ts">
import { User } from 'src/contracts'
import { defineComponent, ref } from 'vue'




export default defineComponent({
    setup() {
        const user_dialog = ref(false)
        // const clicked_user = ref<User>({ nickname: '', online: true })
        return { user_dialog }
    },
    name: "UserDrawer",

    computed: {
        rightSideDrawer: {
            get() {
                return this.$store.state.mainStore.rightDrawerState
            },
            set(val: boolean) {
                this.$store.commit('mainStore/toggleRightDrawer', val)
            },
        }
        ,
        async online_list(): Promise<User[]> {
            console.log('kkt')
            await this.sleep(1000);
            console.log('kkt5')
            let users = this.curr_users.filter(o1 => this.online_users.some(o2 => o1.id === o2.id))
            users.push(this.active_user)
            console.log(users)
            return users

        },
        async offline_list(): Promise<User[]> {
            await this.sleep(1000);
            return this.curr_users.filter(o1 => !this.online_users.some(o2 => o1.id === o2.id)).filter(({ id }) => id !== this.active_user.id);
        },
        activeChannel() {
            return []
        },
        curr_users(): User[] {

            return this.$store.getters['channels/currentUsers']
        },
        online_users(): User[] {
            return this.$store.getters['activity/onlineUsers']
        },
        active_user(): User {
            return this.$store.getters['auth/currUser']
        },

    },
    methods: {
        sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

}


)
</script>

<style>
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.offline_usrname {
    opacity: 0.2;
}

.scroll {
    overflow: hidden;
}
</style>
