<template>
  <VTooltip :disabled="error === ''" :text="error">
    <template #activator="{ props }">
      <VChip density="compact" v-bind="props" data-test="chip-link" pill @click="toggle">
        <template #append v-if="item">
          <VBtn
            v-if="enabled"
            icon="mdi-check"
            color="primary"
            size="xs"
            class="ms-2 my-auto"
          ></VBtn>
          <VBtn v-else icon="mdi-account" color="secondary" size="xs" class="ms-2 my-auto"></VBtn>
        </template>
        <VAvatar start v-if="settings.useImages">
          <VImg
            :src="scryfallCard?.image_uris?.art_crop"
            :alt="scryfallCard?.name"
            @click.stop="nav"
          ></VImg>
        </VAvatar>
        {{ card.copies }} {{ card.name }}
      </VChip>
    </template>
  </VTooltip>
</template>

<script setup lang="ts">
import { useSettings } from '@/stores/settings'
import type { DeckCard, ScryfallCard } from '@/stores/sideboards'
import { useChipToggle } from '@/stores/toggler'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{ card: DeckCard; item?: string }>()

const settings = useSettings()

const toggler = useChipToggle()
toggler.$subscribe((_mutation, state) => {
  if (state.lastToggle !== props.item) {
    enabled.value = true
  }
})

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

const enabled = ref(true)

async function toggle() {
  if (props.item) {
    enabled.value = !enabled.value
    toggler.lastToggle = props.item
  }
}

function nav() {
  window.open(href.value, '_blank')
}
</script>
