import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useSettings = defineStore('settings', () => {
  const useImages = useLocalStorage('images', true)
  const useShortnames = useLocalStorage('shortnames', true)

  return { useImages, useShortnames }
})
