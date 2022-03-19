<template>
    <q-page class="flex column">
        <ConversationBox></ConversationBox>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConversationBox from 'components/ConversationBox.vue';

export default defineComponent({
    name: 'PageIndex',
    components: { ConversationBox },
    data() {

    },
});
</script>
