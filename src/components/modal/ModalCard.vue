<template>
  <VDialog max-width="800px">
    <template #activator="{ props: dialog }">
      <VTooltip :text="tooltip">
        <template #activator="{ props: tooltip }">
          <VBtn v-bind="{ ...dialog, ...tooltip }" :prepend-icon="icon">{{ btn }}</VBtn>
        </template>
      </VTooltip>
    </template>
    <template #default="{ isActive }">
      <VCard>
        <template #prepend>
          <VIcon>{{ icon }}</VIcon>
        </template>
        <template #title>{{ title }}</template>
        <template #subtitle>{{ subtitle }}</template>
        <template #append>
          <VTooltip text="Close">
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                icon="mdi-close"
                variant="text"
                @click="isActive.value = false"
                color="error"
              ></VBtn>
            </template>
          </VTooltip>
        </template>
        <template #text>
          <slot></slot>
        </template>
        <template #actions>
          <slot name="actions"></slot>
          <VSpacer></VSpacer>
          <VTooltip text="Close">
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                @click="isActive.value = false"
                prepend-icon="mdi-close"
                color="error"
                >Close</VBtn
              >
            </template>
          </VTooltip>
        </template>
      </VCard>
    </template>
  </VDialog>
</template>

<script setup lang="ts">
defineProps<{ tooltip: string; btn: string; icon: string; title: string; subtitle: string }>()
</script>
