<script setup lang="ts">
import CardLink from '@/components/CardLink.vue'
import { type Sideboard, useSideboardStore } from '@/stores/sideboards'
import { computed, ref } from 'vue'

const sideboards = useSideboardStore()

const filterName = ref('')

const filterOpponents = ref('')

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
</script>

<template>
  <VContainer fluid>
    <VDataTable :items :loading>
      <template #top>
        <VRow>
          <VCol>
            <VAutocomplete
              v-model="filterName"
              :items="names"
              placeholder="Filter name"
            ></VAutocomplete>
          </VCol>
          <VCol>
            <VAutocomplete
              v-model="filterOpponents"
              :items="opponentNames"
              placeholder="Filter opponents"
            ></VAutocomplete>
          </VCol> </VRow
      ></template>
      <template #item.name="{ item }">
        <VDialog max-width="800px">
          <template #activator="{ props }">
            <VBtn variant="text" v-bind="props" data-test="dialog-activator">{{ item.name }}</VBtn>
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
                  <template #item.in="{ item }">
                    <CardLink v-for="(inn, i) in item.in" :key="i" :card="inn"></CardLink>
                  </template>
                  <template #item.out="{ item }">
                    <CardLink v-for="(out, i) in item.out" :key="i" :card="out"></CardLink>
                  </template>
                </VDataTable>
              </template>
              <template #actions>
                <VBtn data-test="close-btn" @click="isActive.value = false" prepend-icon="mdi-close"
                  >Close</VBtn
                >
              </template>
            </VCard>
          </template>
        </VDialog>
      </template>
      <template #item.opponents="{ item }">
        <VChip v-for="(j, i) in item.opponents" :key="i">{{ j.name }}</VChip>
      </template>
      <template #no-data> No sideboard cheatsheets for the selected deck. </template>
    </VDataTable>
  </VContainer>
</template>
