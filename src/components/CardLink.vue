<template>
  <VTooltip :disabled="error === ''" :text="error">
    <template #activator="{ props }">
      <VChip v-bind="props" data-test="chip-link" :href target="_blank">{{ card.name }}</VChip>
    </template>
  </VTooltip>
</template>

<script setup lang="ts">
import type { DeckCard } from '@/stores/sideboards'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{ card: DeckCard }>()

onMounted(async () => {
  await loadCard(props.card.name)
})

watch(props, async () => {
  await loadCard(props.card.name)
})

const href = computed(() => scryfallCard.value?.scryfall_uri)

const scryfallCard = ref()

const error = ref('')

async function loadCard(name: string) {
  try {
    const merged = name.replace(' ', '+').toLowerCase()
    const res = await fetch('https://api.scryfall.com/cards/named?fuzzy=' + merged)
    scryfallCard.value = await res.json()
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message)
      error.value = e.message
    }
  } finally {
  }
}
</script>
