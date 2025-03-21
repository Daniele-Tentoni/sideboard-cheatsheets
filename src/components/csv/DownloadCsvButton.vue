<template>
  <VBtn prepend-icon="mdi-download" @click="download">Download</VBtn>
</template>

<script setup lang="ts">
import type { Cheatsheet, Sideboard } from '@/stores/sideboards'

const p = defineProps<{ cheatsheet: Cheatsheet }>()

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
  const csvData = convertToCSV(p.cheatsheet.opponents)
  downloadCSV(csvData, `${p.cheatsheet.name}.csv`)
}
</script>
