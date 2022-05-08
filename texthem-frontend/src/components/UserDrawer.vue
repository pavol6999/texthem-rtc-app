<template>
    <q-drawer v-model="rightSideDrawer" v-if="activeChannel" side="right" elevated>

        <q-item-label header>Online</q-item-label>
        <TransitionGroup name="list">
            <q-item v-for="item in online_list" :key="item.nickname" clickable class="q-my-sm" v-ripple>

                <q-item-section side v-show="isTyping(item.nickname)">
                    <q-spinner-comment color="secondary" size="2em" />
                </q-item-section>
                <q-item-section avatar>
                    <q-avatar v-bind:color="get_color(item.nickname)" text-color="accent" class="circle">{{
                        initial(item.nickname)
                    }}
                    </q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.nickname }}</q-item-label>
                    <q-item-label caption v-show="isTyping(item.nickname)">is writing...</q-item-label>
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
                    <q-avatar :color="get_color(item.nickname)" text-color="grey">
                    {{ initial(item.nickname) }}
                    </q-avatar>
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
import { mapGetters } from 'vuex'




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
        online_list(): User[] {

            let users = this.curr_users.filter((o1: User) => this.online_users.some(o2 => o1.id === o2.id))
            users.push(this.active_user)

            return users ? users : []

        },
        offline_list(): User[] {
            let users = this.curr_users.filter(o1 => !this.online_users.some(o2 => o1.id === o2.id)).filter(({ id }) => id !== this.active_user.id);
            return users ? users : []
        },

        typers() {
            return this.$store.getters['channels/typers']
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
        ...mapGetters('channels', {
            activeChannel: 'activeChannel',
        }),

    },
    methods: {
        initial(name: string): string {
            return name.toUpperCase().split('')[0]
        },
        get_color(name: string): string {
            let sum = 0
            name.split('').forEach(element => {
                sum = element.charCodeAt(0) * element.charCodeAt(0) + 27 + sum
            });
            switch (sum % 6) {
                case 0: return 'green'
                case 1: return 'red'
                case 2: return 'purple'
                case 3: return 'grey'
                case 4: return 'blue'
                case 5: return 'brown'
            }
            return 'purple'
        },
        sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        isTyping(username: string) {
            //let typer = this.typers?.some((o: any) => o.nickname === username)
            if (this.typers[this.activeChannel] != undefined && username in this.typers[this.activeChannel] && this.typers[this.activeChannel][username] != "") {
                return true


            }

            return false
            // return typer != undefined ? typer : false
        },
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
