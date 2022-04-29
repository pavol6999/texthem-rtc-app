<template>
    <div v-show="message.startsWith('/')"
        v-bind:style="$q.screen.lt.sm ? { 'margin-left': '0%' } : { 'margin-left': '15%' }" style="width:500px;"
        class="row">
        <TransitionGroup name="list">
            <q-list>
                <TransitionGroup name="list">
                    <template v-for="(items, index) in commands" :key="items">
                        <q-item v-if="('/' + index).startsWith(message)">
                            <q-item-section><b>/{{ index }}</b> - {{ items }} {{

                            }}
                            </q-item-section>
                        </q-item>
                    </template>
                </TransitionGroup>

            </q-list>
        </TransitionGroup>
    </div>

</template>


<script langs=" ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
    name: "HelpList",
    props: {
        message: String,
    },
    data() {
        return {

            commands: {
                join: "Create a channel or join an existing one",
                cancel: "Leave the current channel",
                quit: "Delete this channel. Must have administrator privileges",
                list: "List users currently joined in this channel",
                invite: "Invite a user to this channel",
                revoke: "Remove a user from this channel. Must have administrator privileges in private channel",
                kick: "Kick a user from this channel",
            }

        }

    },
    methods: {}
})
</script>
<style  scoped>
.list-move .list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.list-leave-active {
    position: absolute;
}
</style>
