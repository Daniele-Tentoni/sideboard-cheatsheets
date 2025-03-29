<template>
  <VContainer fluid>
    <VNavigationDrawer>
      <VListItem link :to="{ name: 'archetypes' }" title="Archetypes"></VListItem>
    </VNavigationDrawer>
    <RouterView></RouterView>
  </VContainer>
</template>
