<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12" md="6">
        <h3 data-test="card-title">
          <ManaIcon v-for="(n, i) in colors" :key="i" :icon="n"></ManaIcon>&nbsp;{{ name }}
          sideboard cheatsheets
        </h3>
      </VCol>
      <VSpacer></VSpacer>
      <VCol cols="auto" class="me-4">
        <VMenu max-width="400px">
          <template #activator="{ props }">
            <VBtn v-bind="props" data-test="view-menu-button" prepend-icon="mdi-view-list"
              >View</VBtn
            >
          </template>
          <template #default>
            <VList>
              <VListItem
                :prepend-icon="visualization === 'table' ? 'mdi-check' : 'mdi-table'"
                title="Table"
                @click="visualization = 'table'"
                data-test="view-menu-table-button"
              ></VListItem>
              <VListItem
                :prepend-icon="visualization === 'cards' ? 'mdi-check' : 'mdi-card-text'"
                title="Cards"
                @click="visualization = 'cards'"
                data-test="view-menu-cards-button"
              ></VListItem>
              <VListItem
                :prepend-icon="visualization === 'list' ? 'mdi-check' : 'mdi-list-view'"
                title="List"
                @click="visualization = 'list'"
                data-test="view-menu-list-button"
              ></VListItem>
            </VList>
          </template>
        </VMenu>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        Click on a card to mark it as took out or bringed in. Click on a card on another sideboard
        to reset data in previous sideboard. Click on a card image to open scryfall details.
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" md="6">
        <VCombobox
          v-model="opponentsFilter"
          :items="allOpponents"
          label="Opponents"
          placeholder="Filter opponents"
          hide-details
          clearable
        >
          <template #item="{ item, props }">
            <VListItem v-bind="props">
              <template #prepend>
                <VAvatar start>
                  <VImg
                    :src="isDeck(item.raw) ? item.raw?.art : lost"
                    alt="Archetype art"
                    data-test="archetype-art"
                  ></VImg>
                </VAvatar>
              </template>
              <template #title>
                <span v-if="isDeck(item.raw)">{{ item.raw.name }}</span>
                <span v-else>{{ item.raw }}</span>
              </template>
            </VListItem>
          </template>
        </VCombobox>
      </VCol>
      <VCol cols="auto" class="me-4">
        <VCheckbox
          v-model="settings.useImages"
          label="Display images"
          data-test="use-images-selector"
        ></VCheckbox>
      </VCol>
      <VCol cols="auto" class="me-4">
        <VCheckbox
          v-model="settings.useShortnames"
          label="Use shortnames"
          data-test="use-shortnames-selector"
        ></VCheckbox>
      </VCol>
    </VRow>
    <VRow v-if="visualization === 'table'">
      <VCol>
        <VDataTable :items="opponentsFiltered" :headers data-test="opponentsTable">
          <template #[`item.colors`]="{ item }">
            <ManaIcon v-for="(n, i) in item.colors" :key="i" :icon="n"></ManaIcon>
          </template>
          <template #[`item.out`]="{ item }">
            <VRow no-gutters>
              <VCol v-for="(out, i) in item.out" :key="i" cols="auto">
                <CardLink :card="out" :item="item.name"></CardLink>
              </VCol>
            </VRow>
          </template>
          <template #[`item.in`]="{ item }">
            <VRow no-gutters>
              <VCol v-for="(inn, i) in item.in" :key="i" cols="auto">
                <CardLink :card="inn" :item="item.name"></CardLink>
              </VCol>
            </VRow>
          </template>
        </VDataTable>
      </VCol>
    </VRow>
    <VRow v-if="visualization === 'cards'" no-gutters>
      <VCol v-for="(oppo, i) in opponentsFiltered" :key="i" cols="12" md="auto">
        <VCard data-test="opponentsCard">
          <template #title>
            <ManaIcon v-for="(n, i) in oppo.colors" :key="i" :icon="n"></ManaIcon>{{ oppo.name }}
          </template>
          <template #text>
            <VRow no-gutters>
              <VCol>
                <CardLink
                  v-for="(out, i) in oppo.out"
                  :key="i"
                  :card="out"
                  :item="oppo.name"
                ></CardLink>
              </VCol>
              <VCol>
                <CardLink
                  v-for="(inn, i) in oppo.in"
                  :key="i"
                  :card="inn"
                  :item="oppo.name"
                ></CardLink>
              </VCol>
            </VRow>
          </template>
        </VCard>
      </VCol>
    </VRow>
    <VRow v-if="visualization === 'list'">
      <VList v-for="(oppo, i) in opponentsFiltered" :key="i" class="mx-auto mb-4">
        <VListSubheader :title="oppo.name"></VListSubheader>
        <VListItem v-for="card in oppo.out" :key="card.name" prepend-icon="mdi-minus"
          ><CardLink :card :item="oppo.name"></CardLink
        ></VListItem>
        <VListItem v-for="card in oppo.in" :key="card.name" prepend-icon="mdi-plus"
          ><CardLink :card :item="oppo.name"></CardLink
        ></VListItem>
      </VList>
    </VRow>
    <VRow align="center" justify="end">
      <VCol cols="12" md="auto"> You can upload or download a csv file for this archetype. </VCol>
      <VCol v-if="cheatsheet" cols="12" md="auto">
        <UploadCsvButton :cheatsheet></UploadCsvButton>
        <DownloadCsvButton :cheatsheet></DownloadCsvButton>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import CardLink from '@/components/chips/CardChip.vue'
import { deckDb, lost, useSideboardStore, type Cheatsheet, type Deck } from '@/stores/sideboards'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ManaIcon from '@/components/ManaIcon.vue'
import { useSettings } from '@/stores/settings'
import { useAppTitle } from '@/composables/useAppTitle'
import DownloadCsvButton from '@/components/csv/DownloadCsvButton.vue'
import UploadCsvButton from '@/components/csv/UploadCsvButton.vue'
import { useLocalStorage } from '@vueuse/core'

const route = useRoute()

const settings = useSettings()

const sideboards = useSideboardStore()

const name = computed(() => route.params.name.toString())

const visualization = useLocalStorage<'table' | 'cards' | 'list'>(
  'sideboard-visualization',
  'table',
)

const cheatsheet = ref<Cheatsheet>()

const opponentsFilter = ref<string>()

const allOpponents = computed(() =>
  cheatsheet.value?.opponents.map((m) => deckDb.find((f) => f.name === m.name) ?? m.name),
)

function isDeck(obj: unknown): obj is Deck {
  return !!obj && typeof obj === 'object' && 'name' in obj
}

const opponentsFiltered = computed(() => {
  if (opponentsFilter.value) {
    const low = opponentsFilter.value.toLowerCase()
    return cheatsheet.value?.opponents?.filter((f) => f.name.toLowerCase().includes(low))
  }

  return cheatsheet.value?.opponents
})

const headers = computed(() => {
  const headers = []
  if (opponentsFiltered.value?.length !== 1) {
    headers.push({ key: 'name', title: 'Name' })
  }

  headers.push({ key: 'out', title: 'Out' }, { key: 'in', title: 'In' })
  return headers
})

const archetype = computed(() => deckDb.find((f) => f.name === cheatsheet.value?.archetype))
const colors = computed(() => archetype.value?.colors ?? lost)

async function load() {
  cheatsheet.value = sideboards.sideboards.find((f) => f.name === name.value)
}

watch(name, async () => {
  load()
})

useAppTitle(name.value)

onMounted(async () => {
  load()
})
</script>
