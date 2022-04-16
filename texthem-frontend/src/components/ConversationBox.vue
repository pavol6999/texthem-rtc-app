<template>
    <div>
        <q-infinite-scroll @load="onLoad" reverse>
            <template v-slot:loading>
                <div class="row justify-center q-my-md">
                    <q-spinner color="primary" name="dots" size="40px" />
                </div>
            </template>

            <div class="column col justify-end q-pa-md">
                <div v-for="msg in curr_messages()" :key="msg.id">
                    <div class="msg_group_right" v-if="msg.sender_is_user">
                        <q-chat-message :name="msg.sender_name" :text="[msg.msg_text]" :stamp="msg.msg_age" sent
                            text-color="white" bg-color="primary" />

                        <q-avatar class="q-ml-md" color="primary" text-color="white">{{ msg.sender_name.split('')[0] }}
                        </q-avatar>
                    </div>

                    <div class="msg_group_left" v-else>
                        <q-avatar class="q-mr-md" color="purple" text-color="white">{{ msg.sender_name.split('')[0] }}
                        </q-avatar>

                        <q-chat-message :name="msg.sender_name" :text="[msg.msg_text]" :stamp="msg.msg_age"
                            text-color="white" :bg-color="msg.mention ? 'accent' : 'purple'" />
                    </div>
                </div>
            </div>
        </q-infinite-scroll>

        <q-page-sticky expand position="top" class="current-channel">
            <q-toolbar class="bg-white text-black">
                <q-btn dense flat rounded icon="delete" @click="confirm = true" color="red">
                    <q-label v-if="$q.screen.gt.xs">Delete Channel</q-label>
                </q-btn>
                <q-toolbar-title class="text-center">
                    <q-label v-if="$q.screen.gt.xs">Active Channel -&nbsp;</q-label>

                    <span class="text-weight-bold text-primary">{{ activeChannel }}</span>
                </q-toolbar-title>

                <q-btn dense flat rounded icon-right="logout" color="secondary">
                    <q-label v-if="$q.screen.gt.xs">Leave Channel&nbsp;</q-label>
                </q-btn>
            </q-toolbar>
        </q-page-sticky>
    </div>

    <q-dialog v-model="confirm" persistent>
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="folder_delete" color="primary" text-color="white" />
                <span class="q-ml-sm">Do you really wish to delete this channel?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="Delete Channel" color="red" v-close-popup />
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
export default defineComponent({
    components: { UserTyping, MessageSendBox },
    setup() {
        const items = ref([{}, {}, {}, {}, {}, {}, {}])
        const $q = useQuasar()



        return {
            items,
            confirm: ref(false),
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
    methods: {
        curr_messages(): Message[] {
            let curr_msgs: Message[] = []
            switch (this.channel_n) {
                case ('Public1'):
                    curr_msgs = this.messages1
                    break;
                case ('Public2'):
                    curr_msgs = this.messages2
                    break;
                case ('Private1'):
                    curr_msgs = this.messages3
                    break;
                default:
                    break;
            }
            return curr_msgs
        }
    },
    data() {
        const messages1: Message[] = [
            { id: 1, sender_name: "me", sender_is_user: true, msg_age: '7 minutes ago', msg_text: 'This message includes a mention @messie', mention: true },
            { id: 2, sender_name: "Jane", sender_is_user: false, msg_age: '4 minutes ago', msg_text: 'doin fine, hbu?', mention: false },
            { id: 3, sender_name: "Jane", sender_is_user: false, msg_age: '4 minutes ago', msg_text: 'I just feel like typing a really, really, REALLY long message to annoy you...', mention: false },
            { id: 4, sender_name: "Jane", sender_is_user: false, msg_age: '1 minute ago', msg_text: 'Did it work?', mention: false }
        ]

        const messages2: Message[] = [
            { id: 1, sender_name: "me", sender_is_user: true, msg_age: '7 minutes ago', msg_text: 'msg2 ja', mention: false },
            { id: 2, sender_name: "Jane", sender_is_user: false, msg_age: '4 minutes ago', msg_text: 'This message includes a mention @messie', mention: true },
            { id: 3, sender_name: "me", sender_is_user: true, msg_age: '4 minutes ago', msg_text: 'mgs 2 I just feel like typing a really, really, REALLY long message to annoy you...', mention: false },
            { id: 4, sender_name: "Jane", sender_is_user: false, msg_age: '1 minute ago', msg_text: 'msg2 Did it work?', mention: false }
        ]

        const messages3: Message[] = [
            { id: 1, sender_name: "me", sender_is_user: true, msg_age: '7 minutes ago', msg_text: 'msg 3 Hey, how are you?', mention: false },
            { id: 2, sender_name: "Jane", sender_is_user: false, msg_age: '4 minutes ago', msg_text: 'This message includes a mention @messie', mention: true },
            { id: 3, sender_name: "me", sender_is_user: true, msg_age: '4 minutes ago', msg_text: 'msg3 I just feel like typing a really, really, REALLY long message to annoy you...', mention: false },
            { id: 4, sender_name: "me", sender_is_user: true, msg_age: '1 minute ago', msg_text: 'msg3 Did it work?', mention: false }
        ]

        return {
            messages1,
            messages2,
            messages3
        }
    }

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
