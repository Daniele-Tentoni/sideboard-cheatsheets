<template>
  <VContainer fluid>
    <VDataTable :items :loading :headers>
      <template #top>
        <VRow align="center">
          <VCol cols="auto" align-self="center">
            <VIcon class="ma-auto">mdi-filter</VIcon>
          </VCol>
          <VCol>
            <VCombobox
              data-test="filter-by-name"
              v-model="filterName"
              :items="names"
              label="Deck name"
              placeholder="Filter by name"
              hide-details
              clearable
              return-object
              item-title="name"
              item-value="name"
            >
              <template #item="{ item, props }">
                <ArchetypeListItem
                  v-bind="props"
                  :name="item.raw.name"
                  :art="item.raw.art"
                ></ArchetypeListItem>
              </template>
            </VCombobox>
          </VCol>
          <VCol>
            <VTooltip text="Filter all cheatsheets by opponent deck lists">
              <template #activator="{ props }">
                <VCombobox
                  v-bind="props"
                  v-model="filterOpponents"
                  :items="opponentNames"
                  label="Opponent deck"
                  placeholder="Filter by opponent deck"
                  hide-details
                  multiple
                  return-object
                  clearable
                  item-title="name"
                  item-value="name"
                >
                  <template #item="{ item, props }">
                    <ArchetypeListItem
                      v-bind="props"
                      :name="item.raw.name"
                      :art="item.raw.art"
                    ></ArchetypeListItem>
                  </template>
                </VCombobox>
              </template>
            </VTooltip>
          </VCol>
        </VRow>
      </template>
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
      <template #[`item.actions`]="{ item }">Admin {{ item.name }}</template>
      <template #no-data> No sideboard cheatsheets for the selected deck. </template>
    </VDataTable>
  </VContainer>
</template>

<script setup lang="ts">
import ArchetypeChip from '@/components/chips/ArchetypeChip.vue'
import { deckDb, lost, type Sideboard, useSideboardStore } from '@/stores/sideboards'
import { useAccounts } from '@/stores/account'
import { computed, ref } from 'vue'
import ArchetypeListItem from '@/components/list-items/ArchetypeListItem.vue'

type Artwork = { name: string; art?: string }

const accounts = useAccounts()

const sideboards = useSideboardStore()

const filterName = ref<Artwork>()

const filterOpponents = ref<Artwork[]>()

const names = computed<Artwork[]>(() =>
  sideboards.sideboards.map((m) => ({ name: m.name, art: m.art })),
)

const opponentNames = computed(() => {
  const allNames: Artwork[] = sideboards.sideboards.flatMap((f) => f.opponents)

  const reduced = allNames.reduce((prev, curr) => {
    if (prev.map((m) => m.name).includes(curr.name)) {
      return prev
    }

    prev.push(curr)
    return prev
  }, [] as Artwork[])
  return reduced
})

const items = computed(() => {
  let filtered = sideboards.sideboards
  if (filterName.value?.name) {
    const low = filterName.value.name.toLowerCase()
    filtered = filtered.filter((f) => f.name.toLowerCase().includes(low))
  }

  if (filterOpponents.value?.length) {
    filtered = filtered.filter((f) =>
      f.opponents
        .map((m) => m.name)
        .some((s) => filterOpponents.value!.map((m) => m.name).includes(s)),
    )
  }

  return filtered
})

const loading = computed(() => sideboards.loading)

const opponentsFilter = ref<string>()

const opponentsFiltered = computed(() => (opponents: Sideboard[]) => {
  if (opponentsFilter.value) {
    const low = opponentsFilter.value.toLowerCase()
    return opponents.filter((f) => f.name.toLowerCase().includes(low))
  }

  return opponents
})

const headers = computed(() => {
  const items = [
    { key: 'name', title: 'Name' },
    { key: 'opponents', title: 'Opponents' },
  ]
  if (accounts.user === 'admin') {
    items.push({ key: 'actions', title: 'Actions' })
  }

  return items
})

function deckArt(name?: string) {
  return deckDb.find((f) => f.name === name)?.art ?? lost
}
</script>
