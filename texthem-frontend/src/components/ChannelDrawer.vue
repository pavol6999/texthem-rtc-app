<template>
    <q-drawer v-model="leftSideDrawer" show-if-above side="left" bordered>
        <!-- drawer content -->
    </q-drawer>
</template>




<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default defineComponent({

    name: "ChannelDrawer",
    computed: {
        ...mapGetters('mainStore', {
            leftSideDrawer: 'leftSideDrawer',

        }),
    }
})
</script>
