<template>
  <VContainer fluid>
    <VDataTable :items :loading :headers>
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
                  <VImg height="24px" :src="deckArt(item.archetype)"></VImg>
                </VAvatar>
              </template>
              {{ item.name }}
            </VBtn>
          </template>
          <template #default="{ isActive }">
            <VCard>
              <template #prepend>
                <VAvatar size="24">
                  <VImg height="24px" :src="deckArt(item.archetype)"></VImg>
                </VAvatar>
              </template>
              <template #title>
                <span data-test="card-title">{{ item.name }} sideboard cheatsheets</span>
              </template>
              <template #text>
                Here you will find sideboard about:
                <VTextField
                  v-model="opponentsFilter"
                  label="Filter"
                  placeholder="Filter opponents"
                ></VTextField>
                <ArchetypeChip
                  v-for="(oppo, i) in opponentsFiltered(item.opponents)"
                  :key="i"
                  :name="oppo.name"
                ></ArchetypeChip>
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
import ArchetypeChip from '@/components/chips/ArchetypeChip.vue'
import { deckDb, lost, type Sideboard, useSideboardStore } from '@/stores/sideboards'
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

const headers = [
  { key: 'name', title: 'Name' },
  { key: 'opponents', title: 'Opponents' },
]

function deckArt(name?: string) {
  return deckDb.find((f) => f.name === name)?.art ?? lost
}
</script>
