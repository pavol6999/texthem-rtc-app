<template>
    <q-toolbar class="justify-center">
        <q-input bottom-slots hide-bottom-space v-model="text" label="Write your message !" dark rounded standout
            maxlength="128" class="chat-box align-center"
            v-bind:style="$q.screen.lt.md ? { 'width': '100%' } : { 'width': '80%' }">
            <template v-slot:before>
                <UserProfile size="3.5rem"></UserProfile>
            </template>

            <template v-slot:append>
                <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
            </template>

            <template v-slot:after>
                <q-btn round flat icon="send" />
            </template>
        </q-input>
    </q-toolbar>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import UserProfile from './UserProfile.vue'
export default defineComponent({
    name: "MessageSendBox",
    setup() {
        return {
            text: ref(''),

        }
    },
    components: {
        UserProfile
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

