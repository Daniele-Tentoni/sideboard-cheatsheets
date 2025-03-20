<template>
  <VContainer fluid>
    <VDataTable :items="archetypes"></VDataTable>
  </VContainer>
</template>

<script setup lang="ts">
import { useSideboardStore } from '@/stores/sideboards';
import { computed } from 'vue';

const sideboards = useSideboardStore();

const archetypes = computed(() => sideboards.sideboards.map(m => m.archetype).filter(f => !!f));
</script>
