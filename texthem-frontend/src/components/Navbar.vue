<template>
    <q-header elevated class="bg-primary text-white">
        <q-toolbar class="navbar-color">
            <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

            <q-toolbar-title class="absolute-center">
                <q-avatar>
                    <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                </q-avatar>TexThem
            </q-toolbar-title>
        </q-toolbar>
    </q-header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const leftDrawerOpen = ref(false)
        return {
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value
            }
        }
    },
})
</script>
