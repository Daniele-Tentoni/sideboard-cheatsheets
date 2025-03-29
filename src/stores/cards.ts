import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ScryfallCard } from './sideboards'
import scryfall from '@/services/scryfall'

export class SideboardError extends Error {
  data: object

  constructor(message: string, data: object) {
    super(message)
    this.data = data
  }
}

export const useCards = defineStore('card', () => {
  const cards = ref<ScryfallCard[]>([])

  const calls: { [key: string]: Promise<ScryfallCard> } = {}

  const loading = ref(false)

  async function get(name: string): Promise<ScryfallCard> {
    const old = cards.value.find((f) => f.name === name)
    if (old) {
      return old
    }

    if (name in calls) {
      return calls[name]
    }

    try {
      loading.value = true
      const merged = name.replace(' ', '+').toLowerCase()
      const p = new Promise<ScryfallCard>(async function (res, rej) {
        try {
          const card = await scryfall.fuzzySearch(merged)
          cards.value.push(card)
          res(card)
        } catch (e) {
          rej(e)
        }
      })
      calls[name] = p
      return p
    } finally {
      loading.value = false
    }
  }

  return { cards, get, loading }
})
