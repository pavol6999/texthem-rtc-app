<template>
    <q-page class="flex column">
        <ConversationBox v-if="channel" :channel_n="channel"></ConversationBox>
        <NoChannelPage v-if="!channel"></NoChannelPage>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConversationBox from 'components/ConversationBox.vue';
import NoChannelPage from 'components/NoChannelPage.vue';
export default defineComponent({
    name: 'PageIndex',
    components: { ConversationBox, NoChannelPage },
    props: {
        channel: {
            type: String
        }
    }
});
</script>
