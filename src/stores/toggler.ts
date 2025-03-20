import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChipToggle = defineStore('toggle', () => {
  const lastToggle = ref('')

  return { lastToggle }
})
