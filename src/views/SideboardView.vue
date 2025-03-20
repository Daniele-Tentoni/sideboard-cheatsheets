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
                          ></VImg>
                        </VAvatar>
                      </template>
                      <template #title>{{ item.raw }}</template>
                    </VListItem>
                  </template>
                </VCombobox>
              </VCol>
              <VCol cols="auto" class="me-4">
                <VCheckbox v-model="settings.useImages" label="Display images"></VCheckbox>
              </VCol>
              <VCol cols="auto" class="me-4">
                <VCheckbox v-model="settings.useShortnames" label="Use shortnames"></VCheckbox>
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
      <VCol cols="12" md="auto">
        <VDialog max-width="600px">
          <template #activator="{ props: dialog }">
            <VTooltip text="Upload a new csv file">
              <template #activator="{ props: tooltip }">
                <VBtn prepend-icon="mdi-upload" v-bind="{ ...dialog, ...tooltip }">Upload</VBtn>
              </template>
            </VTooltip>
          </template>
          <template #default="{ isActive }">
            <UploadFileCard
              v-model:is-active="isActive.value"
              @upload="uploadSideboard"
            ></UploadFileCard>
          </template>
        </VDialog>
        <VBtn prepend-icon="mdi-download" @click="download">Download</VBtn>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import CardLink from '@/components/CardLink.vue'
import { useSideboardStore, type Cheatsheet, type Sideboard } from '@/stores/sideboards'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ManaIcon from '@/components/ManaIcon.vue'
import { useSettings } from '@/stores/settings'
import UploadFileCard from '@/components/csv/UploadFileCard.vue'
import { useAppTitle } from '@/composables/useAppTitle'

const route = useRoute()

const settings = useSettings()

const sideboards = useSideboardStore()

const name = computed(() => route.params.name.toString())

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

function uploadSideboard(opponents: Sideboard[]) {
  console.log('Update', name.value, opponents.length)
  sideboards.update(name.value, opponents)
}

function convertToCSV(data: Sideboard[] | undefined) {
  let csv = 'Deck,In Cards,Out Cards\n'

  data?.forEach((deck) => {
    const inCards = deck?.in?.map((card) => `${card.copies} ${card.name}`).join(', ')
    const outCards = deck?.out?.map((card) => `${card.copies} ${card.name}`).join(', ')
    csv += `${deck.name},"${inCards}","${outCards}"\n`
  })

  return csv
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('hidden', '')
  a.setAttribute('href', url)
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

async function download() {
  const csvData = convertToCSV(cheatsheet.value?.opponents)
  downloadCSV(csvData, `${name.value}.csv`)
}

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
