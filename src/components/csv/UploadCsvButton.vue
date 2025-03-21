<template>
  <VDialog max-width="600px">
    <template #activator="{ props: dialog }">
      <VTooltip text="Upload a new csv file">
        <template #activator="{ props: tooltip }">
          <VBtn prepend-icon="mdi-upload" v-bind="{ ...dialog, ...tooltip }">Upload</VBtn>
        </template>
      </VTooltip>
    </template>
    <template #default="{ isActive }">
      <UploadFileCard v-model:is-active="isActive.value" @upload="uploadSideboard"></UploadFileCard>
    </template>
  </VDialog>
</template>

<script setup lang="ts">
import UploadFileCard from '@/components/csv/UploadFileCard.vue'
import { useSideboardStore, type Cheatsheet, type Sideboard } from '@/stores/sideboards'

const p = defineProps<{ cheatsheet: Cheatsheet }>()

const sideboards = useSideboardStore()

function uploadSideboard(opponents: Sideboard[]) {
  console.log('Update', p.cheatsheet.name, opponents.length)
  sideboards.update(p.cheatsheet.name, opponents)
}
</script>
