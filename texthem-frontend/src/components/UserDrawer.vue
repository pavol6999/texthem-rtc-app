<template>
    <q-drawer v-model="rightSideDrawer" side="right" overlay elevated>
        <!-- drawer content -->
    </q-drawer>
</template>




<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default defineComponent({

    name: "UserDrawer",
    computed: {
        ...mapGetters('mainStore', {
            rightSideDrawer: 'rightSideDrawer'
        }),
    }
})
</script>
