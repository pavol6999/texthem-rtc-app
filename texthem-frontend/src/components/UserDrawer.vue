<template>
    <q-drawer v-model="rightSideDrawer" side="right" elevated>
        <button @click="toggle_random">Toggle random</button>

        <q-item-label header>Online</q-item-label>
        <TransitionGroup name="list" tag="ul">
            <q-item
                v-for="item in online_list"
                :key="item.username"
                class="q-mb-sm"
                clickable
                @click="() => show_user(item)"
                v-ripple
            >
                <q-item-section avatar>
                    <q-avatar color="primary" text-color="white">{{ item.username.split('')[0] }}</q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.username }}</q-item-label>
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
    <q-dialog v-model="user_dialog" transition-show="rotate" transition-hide="rotate">
        <q-card>
            <q-card-section class="row items-center justify-center">
                <q-avatar color="primary" text-color="grey">{{ clicked_user.username.split('')[0] }}</q-avatar>
                <span class="q-ml-sm">{{ clicked_user.username }}</span>
            </q-card-section>
            <q-card-section>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</q-card-section>
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
        const members: Member[] = [
            { username: 'John', online: true },
            { username: 'Anna', online: false },
            { username: 'Peter', online: false },
            { username: 'Suzan', online: true }
        ]
        return { members }
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
            return this.members.filter(e => e.online === true)
        },
        offline_list(): Member[] {
            return this.members.filter(e => e.online === false)
        }

    },
    methods: {
        toggle_random(): void {
            let idx = Math.floor(Math.random() * this.members.length)
            this.members[idx].online = !this.members[idx].online
        },
        show_user(member: Member): void {
            this.clicked_user = member
            this.user_dialog = true

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