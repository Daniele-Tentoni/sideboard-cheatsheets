<template>
  <VFadeTransition>
    <div v-if="stringTitle">{{ title }}</div>
    <div v-else>
      <ManaIcon v-for="(n, i) in titleColors" :key="i" :icon="n"></ManaIcon>&nbsp;{{ titleName }}
    </div>
  </VFadeTransition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const p = defineProps<{ title: string | { name: string; colors: string } }>()

const stringTitle = computed(() => typeof p.title === 'string')

const titleColors = computed(
  () => typeof p.title === 'object' && 'colors' in p.title && p.title?.colors,
)

const titleName = computed(() => typeof p.title === 'object' && 'name' in p.title && p.title?.name)
</script>
