<template>
    <HelpList :message="message" class="bg-grey-14"></HelpList>
    <q-toolbar elevated class="justify-center bg-primary">

        <q-input bottom-slots label-slot hide-bottom-space v-model="message" label="Write your message !" dark rounded
            standout maxlength="128" class="chat-box align-center"
            v-bind:style="$q.screen.lt.md ? { 'width': '100%' } : { 'width': '80%' }" :disable="loading"
            @keydown.enter.prevent="send">


            <template v-slot:before>
                <UserProfile size="3.5rem"></UserProfile>

            </template>

            <template v-slot:append>

                <q-icon v-if="message !== ''" name="close" @click="message = ''" class="cursor-pointer" />
            </template>



            <template v-slot:after>
                <q-btn :disable="loading" @click="send" round flat icon="send" />
            </template>
        </q-input>
    </q-toolbar>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import { mapActions } from 'vuex'
import UserProfile from './UserProfile.vue'
import commandService from '../services/CommandService'
import HelpList from './HelpList.vue'

export default defineComponent({
    name: "MessageSendBox",
    data() {
        return {
            message: '',
            loading: false,


        }

    },
    computed: {
        activeChannel() {
            return this.$store.getters['channels/activeChannel']
        }
    },
    components: {
        UserProfile,
        HelpList


    },
    watch: {
        showCommands(command) {
            console.log(command)
        }
    },
    methods: {
        async send() {
            this.loading = true
            if (this.message.split('')[0] == '/') {
                console.info('is a command')
                let res = await commandService.handle(this.message, this.activeChannel, this.$store)

                if (res != null) {
                    let msg = "List of users: "
                    for (let i = 0; i < res.length; i++) {
                        msg += ('\t' + res[i])
                    }
                    this.$store.commit('channels/NEW_MESSAGE',
                        {
                            channel: this.activeChannel,
                            message: {
                                author: {
                                    nickname: 'console'
                                },
                                content: msg
                            }
                        })
                }
                // await this.$store.dispatch('auth/check')
            } else {
                if (this.activeChannel != null) {
                    if (this.message.trim().length > 0)
                        await this.addMessage({ channel: this.activeChannel, message: this.message })
                } else {
                    console.warn("no channel but sent regular message")
                }
            }
            this.message = ''
            this.loading = false
        },
        ...mapActions('channels', ['addMessage'])
    }
})
</script>
<style stylus>
.chat-box {
    /* width: 100%; */
    padding-top: 0.75em;
    padding-bottom: 0.75em;
}
</style>

