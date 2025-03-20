import { defineStore } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'

export const useAppTitleStore = defineStore('appTitle', () => {
  const title = ref('')

  return { title }
})

export function useAppTitle(title: string) {
  const appTitle = useAppTitleStore()
  let previous: string

  onMounted(() => {
    previous = appTitle.title
    appTitle.title = title
  })

  onUnmounted(() => {
    appTitle.title = previous
  })
}
