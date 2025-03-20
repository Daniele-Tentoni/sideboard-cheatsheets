<template>
  <VContainer fluid>
    <VDataTable :items :loading :headers density="compact">
      <template #top>
        <VRow align="center">
          <VCol cols="auto" align-self="center">
            <VIcon class="ma-auto">mdi-filter</VIcon>
          </VCol>
          <VCol>
            <VAutocomplete
              v-model="filterName"
              :items="names"
              label="Deck name"
              placeholder="Filter by deck name"
              hide-details
            ></VAutocomplete>
          </VCol>
          <VCol>
            <VAutocomplete
              v-model="filterOpponents"
              :items="opponentNames"
              label="Opponent deck"
              placeholder="Filter by opponent deck"
              hide-details
            ></VAutocomplete>
          </VCol> </VRow
      ></template>

      <template #[`item.name`]="{ item }">
        <VDialog max-width="800px">
          <template #activator="{ props }">
            <VBtn variant="text" v-bind="props" data-test="dialog-activator">
              <template #prepend>
                <VAvatar size="24">
                  <VImg height="24px" :src="item.archetype?.art"></VImg>
                </VAvatar>
              </template>
              {{ item.name }}
            </VBtn>
          </template>
          <template #default="{ isActive }">
            <VCard>
              <template #title>
                <span data-test="card-title">{{ item.name }} sideboard cheatsheets</span>
              </template>
              <template #text>
                <VDataTable :items="opponentsFiltered(item.opponents)">
                  <template #top>
                    <VTextField
                      v-model="opponentsFilter"
                      label="Filter"
                      placeholder="Filter opponents"
                    ></VTextField>
                  </template>
                  <template #[`item.in`]="{ item }">
                    <CardLink v-for="(inn, i) in item.in" :key="i" :card="inn"></CardLink>
                  </template>
                  <template #[`item.out`]="{ item }">
                    <CardLink v-for="(out, i) in item.out" :key="i" :card="out"></CardLink>
                  </template>
                </VDataTable>
              </template>
              <template #actions>
                <VBtn data-test="close-btn" @click="isActive.value = false" prepend-icon="mdi-close"
                  >Close</VBtn
                >
                <VBtn
                  data-test="open-btn"
                  :to="{ name: 'sideboard', params: { name: item.name } }"
                  prepend-icon="mdi-open-in-new"
                  >Open</VBtn
                >
              </template>
            </VCard>
          </template>
        </VDialog>
      </template>
      <template #[`item.opponents`]="{ item }"> {{ item.opponents.length }} sideboards </template>
      <template #no-data> No sideboard cheatsheets for the selected deck. </template>
    </VDataTable>
  </VContainer>
</template>

<script setup lang="ts">
import CardLink from '@/components/CardLink.vue'
import { useCards } from '@/stores/cards'
import { type Sideboard, useSideboardStore } from '@/stores/sideboards'
import { computed, ref } from 'vue'

const sideboards = useSideboardStore()

const filterName = ref<string>()

const filterOpponents = ref<string>()

const items = computed(() => {
  if (filterName.value) {
    const low = filterName.value.toLowerCase()
    return sideboards.sideboards.filter((f) => f.name.toLowerCase().includes(low))
  }

  return sideboards.sideboards
})

const loading = computed(() => sideboards.loading)

const opponentsFilter = ref('')

const opponentsFiltered = computed(() => (opponents: Sideboard[]) => {
  if (opponentsFilter.value) {
    const low = opponentsFilter.value.toLowerCase()
    return opponents.filter((f) => f.name.toLowerCase().includes(low))
  }

  return opponents
})

const names = computed(() => sideboards.sideboards.map((m) => m.name))
const opponentNames = computed(() =>
  sideboards.sideboards.flatMap((f) => f.opponents.map((m) => m.name)),
)

const cards = useCards()

const headers = [
  { key: 'name', title: 'Name' },
  { key: 'opponents', title: 'Opponents' },
]

async function getUrl(name: string) {
  const card = await cards.get(name)
  if (card?.image_uris?.art_crop) {
    return card?.image_uris?.art_crop
  }

  const r = Math.floor(Math.random() * 1000)
  return `https://picsum.photos/200/300?random=${r}`
}
</script>
