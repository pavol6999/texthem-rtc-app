<template>
    <q-layout view="hhh lpR fFf">
        <Navbar disabled></Navbar>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>


<script lang="ts">

import { defineComponent } from "vue"
import Navbar from "../components/Navbar.vue"


export default defineComponent({
    components: {
        Navbar
    }
})
</script>
