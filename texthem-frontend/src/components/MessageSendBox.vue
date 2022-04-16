<template>
    <q-toolbar class="justify-center">
        <q-input bottom-slots hide-bottom-space v-model="message" label="Write your message !" dark rounded standout
            maxlength="128" class="chat-box align-center"
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
            return this.$store.state.channels.active
        }
    },
    components: {
        UserProfile
    },
    methods: {
        async send() {
            this.loading = true
            await commandService.handle(this.message)
            await this.addMessage({ channel: this.activeChannel, message: this.message })
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

