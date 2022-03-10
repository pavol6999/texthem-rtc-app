<template>
  <q-layout view="hHh LpR fFf">
    <NavbarVue></NavbarVue>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">Razvan Stoenescu</div>
          <div>@rstoenescu</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import NavbarVue from 'src/components/Navbar.vue'

export default {
  setup() {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  components: {
    NavbarVue
  }
}
</script>

<style scoped>
.navbar-color {
  background-color: #443eb7;
}
</style>