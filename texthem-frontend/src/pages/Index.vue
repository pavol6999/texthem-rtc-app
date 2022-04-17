<template>
    <q-page class="flex column">
        <ConversationBox v-if="activeChannel != null"></ConversationBox>
        <NoChannelPage v-else></NoChannelPage>
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
    },
    computed: {
        activeChannel(): string | null {
            return this.$store.getters['channels/activeChannel']
        }
    }
});
</script>
