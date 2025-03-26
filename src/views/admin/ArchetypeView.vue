<template>
  <VContainer fluid>
    <VDataTable :items="deckDb" :headers>
      <template #[`item.art`]="{ item }">
        <VImg :src="item.art"></VImg>
      </template>
      <template #[`item.colors`]="{ item }">
        <ManaIcon v-for="(color, i) in item.colors" :key="i" :icon="color"></ManaIcon>
      </template>
      <template #[`item.actions`]="{ item }">
        <ModalCard
          icon="mdi-pencil"
          btn="Edit"
          :title="item.name"
          subtitle="Edit archetype"
          tooltip="Edit the archetype"
        >
          <VCombobox v-model="selectedName"></VCombobox>
          <VSkeletonLoader type="image" :loading>
            <VImg :src="selectedImage(item.art)"></VImg>
          </VSkeletonLoader>
        </ModalCard>
      </template>
    </VDataTable>
  </VContainer>
</template>

<script setup lang="ts">
import ModalCard from '@/components/modal/ModalCard.vue'
import ManaIcon from '@/components/ManaIcon.vue'
import { useCards } from '@/stores/cards'
import { deckDb, type ScryfallCard } from '@/stores/sideboards'
import { refDebounced } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const headers = computed(() =>
  Object.keys(deckDb[0])
    .map((m) => ({ key: m, title: m.substring(0, 1).toUpperCase().concat(m.substring(1)) }))
    .concat({ key: 'actions', title: 'Actions' }),
)

const cards = useCards()
const loading = ref(false)
const selectedName = ref<string>()
const debouncedSelectedCard = refDebounced(selectedName, 1000)
const selectedCard = ref<ScryfallCard>()
const selectedImage = computed(() => (art: string) => {
  if (selectedCard.value) {
    return selectedCard.value?.image_uris.art_crop
  }

  return art
})

watch(debouncedSelectedCard, async (val) => {
  if (!val) {
    return
  }

  try {
    loading.value = true
    const res = await cards.get(val)
    if (res) {
      selectedCard.value = res
    }
  } finally {
    loading.value = false
  }
})
</script>
