<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const drawer = ref(false)
</script>

<template>
  <VApp>
    <VAppBar>
      <VAppBarNavIcon @click="drawer = !drawer"></VAppBarNavIcon>
      <VAppBarTitle>Sideboards</VAppBarTitle>
    </VAppBar>
    <VNavigationDrawer mobile v-model="drawer"></VNavigationDrawer>
    <VMain>
      <RouterView />
    </VMain>
  </VApp>
</template>
