<template>
    <div>
        <q-scroll-area reverse ref='area' v-show="is_data_fetched" style="width: 100%; height: calc(100vh - 150px); "
            @scroll="scrollHandler">


            <div class="column col justify-end q-pa-md">
                <div v-for="msg in curr_messages" :key="msg?.id">
                    <div class="msg_group_right" v-if="msg != null && is_mine(msg.author)">
                        <q-chat-message :name="msg.author.nickname" :text="[msg.content]" :stamp="nice_stamp(msg.created_at)" sent
                            text-color="white" bg-color="primary">
                        </q-chat-message>

                        <q-avatar class="q-ml-md" color="primary" text-color="white">{{ initial(msg.author.nickname) }}
                        </q-avatar>

                        <q-tooltip anchor="center right" self="top right">
                            {{ real_date(msg.created_at) }}
                        </q-tooltip>
                    </div>


                    <div class="msg_group_left" v-else-if="msg != null">
                        <q-avatar class="q-mr-md" color="purple" text-color="white">{{ initial(msg.author.nickname) }}
                        </q-avatar>

                        <q-chat-message :name="msg.author.nickname" :text="[msg.content]" :stamp="nice_stamp(msg.created_at)"
                            text-color="white" :bg-color="has_mention(msg.content) ? 'accent' : 'purple'" />

                        <q-tooltip anchor="center left" self="top left">
                            {{ real_date(msg.created_at) }}
                        </q-tooltip>
                    </div>
                </div>
            </div>
        </q-scroll-area>

        <q-page-sticky expand position="top" class="current-channel">
            <q-toolbar class="bg-white text-black">

                <!--- just for alignment lol -->
                <q-btn dense flat icon="delete" rounded color="white">
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

    <q-page-sticky expand position="bottom-left" style="margin-left: 50%; margin-bottom: 20px;">

        <q-btn v-show="bottom" round size="md" color="secondary" @click="scrollMessages()" icon="arrow_downward">
            <q-tooltip class="bg-accent">Scroll to bottom</q-tooltip>
        </q-btn>



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
import { QScrollArea, useQuasar } from "quasar";
import { SerializedMessage, User } from 'src/contracts';
import commandService from '../services/CommandService'
import { date } from 'quasar'

export default defineComponent({
    components: { UserTyping, MessageSendBox },
    data() {

        return {
            bottom: false,
            is_data_fetched: false
        }
    },
    setup() {
        return {
            confirm_delete: ref(false),
            confirm_leave: ref(false),
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
            if (!this.is_data_fetched) {
                this.is_data_fetched = true;
                this.scrollMessages()
            }

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
        },
    },
    // watch: {
    //     curr_messages: {
    //         handler() {
    //             this.$nextTick(() => {
    //                 const area = this.$refs.area as QScrollArea

    //                 // area && area.setScrollPercentage('vertical', 1.1)

    //                 const target = (this.$refs.area as QScrollArea).getScrollTarget()
    //                 target && (target.scrollTop = Number.MAX_SAFE_INTEGER)
    //             })
    //         },
    //         deep: true
    //     }
    // },
    methods: {

        async scrollHandler(ctx: any) {

            if ((ctx.verticalPercentage < 0.05 && ctx.verticalPercentage != 0) && this.is_data_fetched) {
                this.bottom = true
                if (this.curr_messages != undefined && this.curr_messages.length > 0) {
                    // forgive me for I have sinned
                    let timestamp = (this.curr_messages[0] as any).created_at

                    await this.$store.dispatch('channels/loadNewMessages', { channel: this.activeChannel, timestamp: timestamp })
                }



            }
            if (ctx.verticalPercentage > 0.95 || ctx.verticalPosition == 0) {

                this.bottom = false
            }
            else {
                this.bottom = true
            }

        },
        real_date(stamp: string): string {
            let sent_at = date.extractDate(stamp, 'YYYY-MM-DDTHH:mm:ss')            
            return date.formatDate(sent_at, 'DD.MM.YYYY HH:mm')
        },
        nice_stamp(stamp: string): string {
            let now = new Date()
            let tmp: string
            let sent_at = date.extractDate(stamp, 'YYYY-MM-DDTHH:mm:ss')            

            let diff = date.getDateDiff(now, sent_at, 'seconds')

            let diff_s = diff % 60
            let diff_m = Math.floor(diff / 60)
            let diff_h = Math.floor(diff_m / 60)
            let diff_days = Math.floor(diff_h / 24)

            if (diff_days > 0) {
                if (diff_days > 1)
                    tmp = 'days'
                else 
                    tmp = 'day'
                return diff_days.toString() + ' ' + tmp + ' ago';
            }
            if (diff_h > 0) {
                if (diff_h > 1)
                    tmp = 'hours'
                else 
                    tmp = 'hour'
                return diff_h.toString() + ' ' + tmp + ' ago';
            }
            if (diff_m > 0) {
                if (diff_m > 1)
                    tmp = 'minutes'
                else 
                    tmp = 'minute'
                return diff_m.toString() + ' ' + tmp + ' ago';
            }
            if (diff_s > 0) {
                if (diff_s > 1)
                    tmp = 'seconds'
                else 
                    tmp = 'second'
                return diff_s.toString() + ' ' + tmp + ' ago';
            }

            return 'now'

        },
        initial(name: string): string {
            return name.toUpperCase().split('')[0]
        },
        is_mine(author: User): boolean {
            return (author.id == this.curr_user.id)
        },
        has_mention(msg: string): boolean {
            return msg.includes('@' + this.curr_user.nickname)
        },

        scrollMessages() {
            const area = this.$refs.area as QScrollArea

            area && area.setScrollPercentage('vertical', 1.1)
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

.scroll {
    overflow: auto !important;
}
</style>
