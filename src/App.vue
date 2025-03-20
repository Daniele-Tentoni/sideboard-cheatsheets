<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useAppTitle, useAppTitleStore } from './composables/useAppTitle'

const drawer = ref(false)

useAppTitle('Sideboards')

const appTitleStore = useAppTitleStore()
</script>

<template>
  <VApp>
    <VAppBar>
      <VAppBarNavIcon @click="drawer = !drawer"></VAppBarNavIcon>
      <VAppBarTitle>{{ appTitleStore.title }}</VAppBarTitle>
      <template #append>
        <VResponsive>
          <VTooltip text="Accounts coming soon">
            <template #activator="{ props }">
              <VBtn v-bind="props" icon="mdi-account"> </VBtn> </template
          ></VTooltip>
        </VResponsive>
      </template>
    </VAppBar>
    <VNavigationDrawer mobile v-model="drawer">
      <VListItem link :to="{ name: 'home' }" title="Home" prepend-icon="mdi-home"></VListItem>
      <VListItem link :to="{ name: 'archetypes' }" title="Archetypes"></VListItem>
    </VNavigationDrawer>
    <VMain>
      <RouterView />
    </VMain>
  </VApp>
</template>
