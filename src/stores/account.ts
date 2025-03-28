import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAccounts = defineStore('account', () => {
  const user = ref('')

  return { user }
})
