<template>
    <q-page class="flex column">
        <ConversationBox :channel_n="channel"> </ConversationBox>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConversationBox from 'components/ConversationBox.vue';

export default defineComponent({
    name: 'PageIndex',
    components: { ConversationBox },
    props: {
       channel: {
           type: String
       } 
    }
});
</script>
