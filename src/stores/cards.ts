import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ScryfallCard } from './sideboards'

export class SideboardError extends Error {
  data: object

  constructor(message: string, data: object) {
    super(message)
    this.data = data
  }
}

export const useCards = defineStore('card', () => {
  const cards = ref<ScryfallCard[]>([])

  const loading = ref(false)

  async function get(name: string): Promise<ScryfallCard> {
    const old = cards.value.find((f) => f.name === name)
    if (old) {
      return old
    }

    try {
      loading.value = true
      const merged = name.replace(' ', '+').toLowerCase()
      const res = await fetch('https://api.scryfall.com/cards/named?fuzzy=' + merged)
      if (res.ok) {
        const card = await res.json()
        cards.value.push(card)
        return card
      }

      const obj = await res.json()
      const e = new SideboardError('Get card error', obj)
      throw e
    } finally {
      loading.value = false
    }
  }

  return { cards, get, loading }
})
