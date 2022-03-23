<template>
    <q-infinite-scroll @load="onLoad" reverse>
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
                <q-spinner color="primary" name="dots" size="40px" />
            </div>
        </template>

        <div class="column col justify-end q-pa-md">
            <q-chat-message
                name="me"
                avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                :text="['hey, how are you?']"
                stamp="7 minutes ago"
                sent
                bg-color="primary"
            />
            <q-chat-message
                name="Jane"
                avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                :text="[
                'doing fine, how r you?']"
                stamp="4 minutes ago"
                text-color="white"
                bg-color="accent"
            />
            <q-chat-message
                name="Jane"
                avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                :text="[
                    'I just feel like typing a really, really, REALLY long message to annoy you...'
                ]"
                stamp="4 minutes ago"
                text-color="white"
                bg-color="accent"
            />
            <q-chat-message
                name="Jane"
                avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                :text="['Did it work?']"
                stamp="1 minutes ago"
                text-color="white"
                bg-color="accent"
            />
            <q-chat-message
                bg-color="accent"
                name="Jane"
                avatar="https://cdn.quasar.dev/img/avatar3.jpg"
            >
                <q-spinner-dots size="2rem" />
            </q-chat-message>
        </div>
    </q-infinite-scroll>

    <q-page-sticky expand position="top" class="current-channel">
        <q-toolbar class="bg-white text-black">
            <q-toolbar-title class="text-center">
                Active Channel -
                <span class="text-weight-bold text-primary">{{ channel_n }}</span>
            </q-toolbar-title>
        </q-toolbar>
    </q-page-sticky>
</template>
<style scoped>
.current-channel {
    opacity: 0.8;
}
</style>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    setup() {
        const items = ref([{}, {}, {}, {}, {}, {}, {}])

        return {
            items,
            onLoad(index: any, done: any) {
                setTimeout(() => {
                    items.value.splice(0, 0, {}, {}, {}, {}, {}, {}, {})
                    done()
                }, 2000)
            }
        }
    },
    props: {
        channel_n: {
            type: String
        }
    }

})
</script>