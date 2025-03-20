<template>
  <VTooltip :disabled="error === ''" :text="error">
    <template #activator="{ props }">
      <VChip density="compact" v-bind="props" data-test="chip-link" :href target="_blank" pill link>
        <VAvatar start v-if="settings.useImages">
          <VImg :src="scryfallCard?.image_uris?.art_crop" :alt="scryfallCard?.name"></VImg>
        </VAvatar>
        {{ card.copies }} {{ card.name }}
      </VChip>
    </template>
  </VTooltip>
</template>

<script setup lang="ts">
//
import { useSettings } from '@/stores/settings'
import type { DeckCard, ScryfallCard } from '@/stores/sideboards'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{ card: DeckCard }>()

const settings = useSettings()

onMounted(async () => {
  await loadCard(props.card.name)
})

watch(props, async () => {
  await loadCard(props.card.name)
})

const href = computed(() => scryfallCard.value?.scryfall_uri ?? '')

const scryfallCard = ref<ScryfallCard>()

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
