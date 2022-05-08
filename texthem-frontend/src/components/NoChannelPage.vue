<style scoped>
.img-no-chat {
    margin-top: 5%;

    margin-bottom: 5%;
}

.text-empty-channel {
    margin-left: 5%;
    margin-right: 5%;
}
</style>

<template>
    <div class="col">
        <div class="col-0 col-md-6 flex justify-center content-center">
            <img src="~assets/empty_channel.svg" class="responsive img-no-chat" width="350" />
        </div>
        <div class="col-12 col-md-6 flex justify-center text-empty-channel">
            <div>
                <p class="col-12 text-h6 text-center text-weight-bold">To view content of a channel, you need to select
                    a channel from the channel drawer.</p>
                <p class="col-12 text-subtitle-2 text-center text-weight-medium">You can also create a new channel using
                    the "/join" command in command line </p>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';


export default defineComponent({
    mounted() {
        let $q = useQuasar()
    },
})


</script>
