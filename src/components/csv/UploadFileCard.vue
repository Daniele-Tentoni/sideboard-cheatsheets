<template>
  <VCard>
    <template #title>Upload new csv</template>
    <template #subtitle>Use this function to bulk copy your existing cheatsheets.</template>
    <template #text>
      <VRow>
        <VCol>
          <p>The format of the csv fields should follow this semantic:</p>
          <VTable>
            <thead>
              <tr>
                <td>Name</td>
                <td>Out</td>
                <td>In</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>First deck name</td>
                <td>List of all cards to take out</td>
                <td>List of all cards to drop in</td>
              </tr>
            </tbody>
          </VTable>
          <p>Export the cheatsheet in this csv file:</p>
          <p>
            <VCode> Name,Out,In </VCode>
          </p>
          <p>
            <VCode> BG Glee,"4 Chrysalis, ...","3 Duress, ..." </VCode>
          </p>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          You can download the example file
          <a download="example.csv" href="/example.csv">here</a>.
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VFileInput
            label="New file"
            accept="text/csv"
            @update:model-value="uploadedFile"
          ></VFileInput>
        </VCol>
      </VRow>
    </template>
    <template #actions>
      <VBtn prepend-icon="mdi-upload" @click="isActive = false">Upload</VBtn>
    </template>
  </VCard>
</template>

<script setup lang="ts">
import { type DeckCard, type Sideboard } from '@/stores/sideboards'

const isActive = defineModel<boolean>('isActive')

const emits = defineEmits<{ (e: 'upload', data: Sideboard[]): void }>()

function handleFileUpload(event: { target: { files: File[] } }) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = function (e) {
    if (e.target) {
      const text = e.target.result
      if (typeof text === 'string') {
        const data = parseCSV(text)
        console.log(data) // L'array generato
      } else {
        console.error('Il tipo non è stringa: ', text)
      }
    }
  }
  reader.readAsText(file)
}

async function uploadedFile(f: File | File[]) {
  if (f instanceof File) {
    const a = await f.text()
    const data = parseCSV(a)
    console.log(data) // L'array generato
    emits('upload', data)
  }
}

function parseCSV(text: string) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
  const headers = lines[0].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/) // Estrarre le intestazioni
  const result: { name: string; in: DeckCard[]; out: DeckCard[] }[] = []

  lines.slice(1).forEach((line) => {
    const [name, outCards, inCards] = line
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map((field) => field.replace(/"/g, '').trim())

    const parseCards = (cardString: string) => {
      if (!cardString) {
        return []
      }

      const parts = cardString.split(', ')

      return parts.map((card) => {
        const [copies, ...nameParts] = card.split(' ')
        return { copies: parseInt(copies, 10), name: nameParts.join(' ') }
      })
    }

    result.push({
      name,
      in: parseCards(inCards),
      out: parseCards(outCards),
    })
  })

  return result
}
</script>
