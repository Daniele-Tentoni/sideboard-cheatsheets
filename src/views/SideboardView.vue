<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12" md="6">
        <h3 data-test="card-title">
          <ManaIcon v-for="(n, i) in cheatsheet?.archetype?.colors" :key="i" :icon="n"></ManaIcon
          >&nbsp;{{ name }} sideboard cheatsheets
        </h3>
      </VCol>
      <VSpacer></VSpacer>
      <VCol cols="auto" class="me-4">
        <VMenu max-width="400px">
          <template #activator="{ props }">
            <VBtn v-bind="props" data-test="view-menu-button">View</VBtn>
          </template>
          <template #default>
            <VList>
              <VListItem
                :prepend-icon="visualization === 'table' ? 'mdi-check' : ''"
                title="Table"
                @click="visualization = 'table'"
                data-test="view-menu-table-button"
              ></VListItem>
              <VListItem
                :prepend-icon="visualization === 'cards' ? 'mdi-check' : ''"
                title="Cards"
                @click="visualization = 'cards'"
                data-test="view-menu-cards-button"
              ></VListItem>
            </VList>
          </template>
        </VMenu>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VDataTable density="compact" :items="opponentsFiltered" :headers>
          <template #top>
            <VRow>
              <VCol>
                <VCombobox
                  v-model="opponentsFilter"
                  :items="allOpponents"
                  label="Opponents"
                  placeholder="Filter opponents"
                  clearable
                >
                  <template #item="{ props, item }">
                    <VListItem v-bind="props">
                      <template #prepend>
                        <VAvatar start>
                          <VImg
                            :src="
                              sideboards.sideboards.find((f) => f.name === item.raw)?.archetype?.art
                            "
                            data-test="archetype-art"
                          ></VImg>
                        </VAvatar>
                      </template>
                      <template #title>{{ item.raw }}</template>
                    </VListItem>
                  </template>
                </VCombobox>
              </VCol>
              <VCol cols="auto" class="me-4">
                <VCheckbox v-model="settings.useImages" label="Display images" data-test="use-images-selector"></VCheckbox>
              </VCol>
              <VCol cols="auto" class="me-4">
                <VCheckbox v-model="settings.useShortnames" label="Use shortnames" data-test="use-shortnames-selector"></VCheckbox>
              </VCol>
            </VRow>
          </template>
          <template #[`item.colors`]="{ item }">
            <ManaIcon v-for="(n, i) in item.colors" :key="i" :icon="n"></ManaIcon>
          </template>
          <template #[`item.out`]="{ item }">
            <VRow no-gutters>
              <VCol v-for="(out, i) in item.out" :key="i">
                <CardLink :card="out" :item="item.name"></CardLink>
              </VCol>
            </VRow>
          </template>
          <template #[`item.in`]="{ item }">
            <VRow no-gutters>
              <VCol v-for="(inn, i) in item.in" :key="i">
                <CardLink :card="inn" :item="item.name"></CardLink>
              </VCol>
            </VRow>
          </template>
        </VDataTable>
      </VCol>
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
import CardLink from '@/components/CardLink.vue'
import { useSideboardStore, type Cheatsheet } from '@/stores/sideboards'
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

const visualization = useLocalStorage<'table' | 'cards'>('sideboard-visualization', 'table')

const cheatsheet = ref<Cheatsheet>()

const opponentsFilter = ref('')

const allOpponents = computed(() => cheatsheet.value?.opponents.map((m) => m.name))

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
