<template>
  <VTooltip :text="help">
    <template #activator="{ props }">
      <VChip v-bind="props" rounded>
        <VAvatar start size="24">
          <VImg :src="selected?.art ?? lost" :alt="selected?.name"></VImg>
        </VAvatar>
        {{ help }}
      </VChip>
    </template>
  </VTooltip>
</template>

<script setup lang="ts">
import { deckDb, type Deck, lost } from '@/stores/sideboards'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{ deck?: Deck; name?: string }>()

const selected = ref<Deck>()

const help = computed(() => selected.value?.name  ?? props.name)

async function load() {
  if (props.deck) {
    selected.value = props.deck
  } else {
    selected.value = deckDb.find((f) => f.name === props.name)
  }
}

watch(props, async () => {
  await load()
})

onMounted(async () => {
  await load()
})
</script>
