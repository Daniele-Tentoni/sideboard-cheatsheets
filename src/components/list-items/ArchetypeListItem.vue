<template>
  <VListItem>
    <template #prepend>
      <VAvatar size="32">
        <VImg :src :alt></VImg>
      </VAvatar>
    </template>
    <template #title>
      {{ name }}
    </template>
  </VListItem>
</template>

<script setup lang="ts">
import { lost } from '@/stores/sideboards'
import { computed } from 'vue'

const p = defineProps<{ name: string; art?: string }>()

const alt = computed(() => p.name)
const src = computed(() => p.art ?? lost)
</script>
