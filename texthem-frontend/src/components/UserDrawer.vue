<template>
    <q-drawer v-model="rightSideDrawer" side="right" elevated>
        <div class="row justify-center">
            <q-btn v-show="false" color="primary" @click="toggle_random">
                Shuffle offline/online users
                <q-tooltip
                    class="bg-accent"
                >we can test animations of users going online/offline. Not all online members are automatically typing, this is a demo</q-tooltip>
            </q-btn>
        </div>
        <q-item-label header>Online</q-item-label>
        <TransitionGroup name="list">
            <q-item
                v-for="item in online_list"
                :key="item.username"
                clickable
                class="q-my-sm"
                @click="() => show_user(item)"
                v-ripple
            >
                <q-item-section side>
                    <q-spinner-comment color="secondary" size="2em" />
                </q-item-section>
                <q-item-section avatar>
                    <q-avatar
                        color="yellow"
                        text-color="primary"
                        class="circle"
                    >{{ item.username.split('')[0] }}</q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.username }}</q-item-label>
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
            <q-item
                v-for="item in offline_list"
                :key="item.username"
                class="q-mb-sm"
                clickable
                @click="() => show_user(item)"
                v-ripple
            >
                <q-item-section avatar>
                    <q-avatar color="primary" text-color="grey">{{ item.username.split('')[0] }}</q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label class="offline_usrname">{{ item.username }}</q-item-label>
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
                <q-avatar color="primary" text-color="grey">{{ clicked_user.username.split('')[0] }}</q-avatar>
                <span class="q-ml-sm">{{ clicked_user.username }}</span>
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
import { defineComponent, ref } from 'vue'

import { Member } from 'src/components/interface/models';


export default defineComponent({
    setup() {
        const user_dialog = ref(false)
        const clicked_user = ref<Member>({ username: '', online: true })
        return { user_dialog, clicked_user }
    },
    name: "UserDrawer",
    data() {
        const users1: Member[] = [
            { username: 'John', online: true },
            { username: 'Anna', online: false },
            { username: 'Peter', online: false },
            { username: 'Suzan', online: true }
        ]

        const users2: Member[] = [
            { username: 'Brock', online: true },
            { username: 'Roman', online: true },
            { username: 'Ferdo', online: false },
            { username: 'Alfred', online: false }
        ]

        const users3: Member[] = [
            { username: 'Waldo', online: true },
            { username: 'William', online: true },
            { username: 'Martha', online: false },
            { username: 'Yvonne', online: false }
        ]

        const typedMsg = "This message is being typed.. dont look in here"
        return { 
            typedMsg,
            users1,
            users2,
            users3 
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
        }
        ,
        online_list(): Member[] {
            return this.curr_users().filter(e => e.online === true)
        },
        offline_list(): Member[] {
            return this.curr_users().filter(e => e.online === false)
        },
        activeChannel() {
            return this.$store.getters['channels/activeChannel']
        },
    },
    methods: {
        toggle_random(): void {
            let idx = Math.floor(Math.random() * this.curr_users().length)
            this.curr_users()[idx].online = !this.curr_users()[idx].online
        },
        show_user(member: Member): void {
            this.clicked_user = member
            this.user_dialog = true
        },
        curr_users(): Member[] {
            let curr: Member[] = []
            switch (this.activeChannel) {
                case ('Public1'):
                    curr = this.users1
                    break;
                case ('Public2'):
                    curr = this.users2
                    break;
                case ('Private1'):
                    curr = this.users3
                    break;
                default:
                    break;
            }
            return curr
        }
    }

})
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