<template>
  <VApp>
    <VAppBar>
      <VAppBarNavIcon @click="drawer = !drawer"></VAppBarNavIcon>
      <VAppBarTitle>
        <AppTitle :title="appTitleStore.title"></AppTitle>
      </VAppBarTitle>
      <template #append>
        <VResponsive>
          <VMenu>
            <template #activator="{ props: menu }">
              <VTooltip text="Accounts coming soon">
                <template #activator="{ props: tooltip }">
                  <VBtn v-bind="mergeProps(menu, tooltip)" icon="mdi-account"> </VBtn>
                </template>
              </VTooltip>
            </template>
            <template #default>
              <VList>
                <VListItem>Accounts coming soon</VListItem>
              </VList>
            </template>
          </VMenu>
        </VResponsive>
      </template>
    </VAppBar>
    <VNavigationDrawer mobile v-model="drawer">
      <VListItem link :to="{ name: 'home' }" title="Home" prepend-icon="mdi-home"></VListItem>
      <VListItem link :to="{ name: 'archetypes' }" title="Archetypes" prepend-icon="mdi-format-list-bulleted-type"></VListItem>
    </VNavigationDrawer>
    <VMain>
      <RouterView />
    </VMain>
    <VFooter app>
      Daniele Tentoni, 2025
    </VFooter>
  </VApp>
</template>

<script setup lang="ts">
import { mergeProps, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useAppTitle, useAppTitleStore } from './composables/useAppTitle'
import AppTitle from './components/navbar/AppTitle.vue'

const drawer = ref(false)

useAppTitle('Sideboards')

const appTitleStore = useAppTitleStore()
</script>
