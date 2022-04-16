<template>
    <div class="text-left text-body2" style="color:darkgray">
        Someone is typing !
        <span v-if="$q.screen.gt.xs">Check the user drawer to see who is typing 🖋</span>
        <span v-if="$q.screen.lt.sm">Swipe right to see who!</span>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {

    },
})
</script>
