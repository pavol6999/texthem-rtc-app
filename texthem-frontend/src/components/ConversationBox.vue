<template>
    <div>
        <q-infinite-scroll @load="onLoad" reverse>
            <template v-slot:loading>
                <div class="row justify-center q-my-md">
                    <q-spinner color="primary" name="dots" size="40px" />
                </div>
            </template>

            <div class="column col justify-end q-pa-md">
                <div v-for="msg in curr_messages" :key="msg?.id" >
                    <div class="msg_group_right" v-if="msg != null && is_mine(msg.author)">
                        <q-chat-message :name="msg.author.nickname" :text="[msg.content]" :stamp="msg.created_at" sent
                            text-color="white" bg-color="primary" />

                        <q-avatar class="q-ml-md" color="primary" text-color="white">{{ initial(msg.author.nickname) }}
                        </q-avatar>
                    </div>

                    <div class="msg_group_left" v-else-if="msg != null">
                        <q-avatar class="q-mr-md" color="purple" text-color="white">{{ initial(msg.author.nickname) }}
                        </q-avatar>

                        <q-chat-message :name="msg.author.nickname" :text="[msg.content]" :stamp="msg.created_at"
                            text-color="white" :bg-color="has_mention(msg.content) ? 'accent' : 'purple'" />
                    </div>
                </div>
            </div>
        </q-infinite-scroll>

        <q-page-sticky expand position="top" class="current-channel">
            <q-toolbar class="bg-white text-black">

                <!--- just for alignment lol -->
                <q-btn  dense flat icon="delete" rounded color="white">
                    <span v-if="$q.screen.gt.xs"> Not the owner </span>
                </q-btn>

                <q-toolbar-title class="text-center">
                    <span v-if="$q.screen.gt.xs"> Active Channel -&nbsp;</span>
                    <span class="text-weight-bold text-primary">{{ activeChannel }}</span>
                </q-toolbar-title>

                <q-btn v-if="is_owner" dense flat rounded icon="delete" @click="confirm_delete = true" color="red">
                    <span v-if="$q.screen.gt.xs"> Delete Channel </span>
                </q-btn>

                <q-btn v-else dense flat rounded icon-right="logout" @click="confirm_leave = true" color="secondary">
                    <span v-if="$q.screen.gt.xs"> Leave Channel &nbsp;</span>
                </q-btn>
            </q-toolbar>
        </q-page-sticky>
    </div>

    <q-dialog v-model="confirm_delete">
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="delete" color="red" text-color="white" />
                <span class="q-ml-sm">Do you really wish to delete this channel?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="Delete Channel" color="red" @click="button_delete" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <q-dialog v-model="confirm_leave">
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="logout" color="primary" text-color="white" />
                <span class="q-ml-sm">Do you really wish to leave this channel?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="Leave Channel" color="red" @click="button_leave" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <q-page-sticky expand position="bottom-left" style="margin-left:10px; margin-bottom:5px">
        <UserTyping></UserTyping>
    </q-page-sticky>
</template>
<style scoped>
.current-channel {
    opacity: 0.8;
}
</style>
<script lang="ts">
import { defineComponent, ref } from "vue";
import UserTyping from './UserTyping.vue';
import { Message } from './interface/models';
import MessageSendBox from "./MessageSendBox.vue";
import { useQuasar } from "quasar";
import { SerializedMessage, User } from 'src/contracts';
import commandService from '../services/CommandService'

export default defineComponent({
    components: { UserTyping, MessageSendBox },
    setup() {
        const items = ref([{}, {}, {}, {}, {}, {}, {}])
        const $q = useQuasar()

        return {
            items,
            confirm_delete: ref(false),
            confirm_leave: ref(false),
            onLoad(index: any, done: any) {
                setTimeout(() => {
                    $q.notify({
                        position: 'top',
                        message: 'Jane wrote a message',
                        color: 'accent',

                    })


                }, 2000)
            }
        }
    },
    props: {
        channel_n: {
            type: String
        }
    },
    computed: {
        activeChannel(): string {
            return this.$store.getters['channels/activeChannel']
        },
        curr_messages(): SerializedMessage[] {
            return this.$store.getters['channels/currentMessages']
        },
        curr_user(): User {
            return this.$store.getters['auth/currUser']
        },
        is_owner(): boolean {
            for (let i = 0; i < this.curr_user.channels.length; i++) {
                if (this.curr_user.channels[i].name === this.activeChannel)
                    if (this.curr_user.channels[i].owner_id === this.curr_user.id)
                        return true
            }
            return false
        }
    },
    methods: {
        initial(name: string): string {
            return name.toUpperCase().split('')[0]
        },
        is_mine(author: User): boolean {
            return (author.id == this.curr_user.id)
        },
        has_mention(msg: string) : boolean {
            return msg.includes(this.curr_user.nickname)
        },
        async button_delete() {
            await commandService.handle('/quit', this.activeChannel, this.$store)
        },
        async button_leave() {
            await commandService.handle('/cancel', this.activeChannel, this.$store)
        }
    },
})
</script>

<style>
.msg_group_left {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
}

.msg_group_right {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
}
</style>
