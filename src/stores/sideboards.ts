import { defineStore } from 'pinia'
import { ref } from 'vue'
import jund from "@/assets/sideboards/jund_wildfire.json"

export type ScryfallCard = {
  name: string
  image_uris: {
    art_crop: string
  }
  scryfall_uri: string
}

export type DeckCard = {
  copies: number
  name: string
}

export type Deck = {
  id?: number
  name: string
  art: string
  colors?: string
  date?: Date
}

export type Sideboard = {
  name: string
  colors?: string
  in?: DeckCard[]
  out?: DeckCard[]
  note?: string[]
}

export type Cheatsheet = {
  art: string
  name: string
  archetype?: Deck
  opponents: Sideboard[]
}

export const deckDb: Deck[] = [
  {
    id: 1,
    name: 'Jund Wildfire',
    art: 'https://cards.scryfall.io/art_crop/front/4/9/492d77e5-acc6-41b8-8930-f39d69234919.jpg?1604196948',
    colors: 'BGR',
  },
  {
    id: 2,
    name: 'Golgari Glee',
    art: 'https://cards.scryfall.io/art_crop/front/5/e/5ea568df-04a1-4012-98ec-ba75e189e0ca.jpg?1702429591',
    colors: 'BG',
  },
]

export const useSideboardStore = defineStore('sideboard', () => {
  const loading = ref(false)

  const sideboards = ref<Cheatsheet[]>([
    {
      art: 'https://cards.scryfall.io/art_crop/front/4/9/492d77e5-acc6-41b8-8930-f39d69234919.jpg?1604196948',
      name: 'Jund Wildfire',
      archetype: {
        name: 'Jund Wildfire',
        art: 'https://cards.scryfall.io/art_crop/front/4/9/492d77e5-acc6-41b8-8930-f39d69234919.jpg?1604196948',
        colors: 'BGR',
      },
      opponents: jund,
    },
    {
      art: 'https://cards.scryfall.io/art_crop/front/5/e/5ea568df-04a1-4012-98ec-ba75e189e0ca.jpg?1702429591',
      name: 'Gruul Monsters',
      archetype: {
        name: 'Gruul Monsters',
        art: 'https://cards.scryfall.io/art_crop/front/5/e/5ea568df-04a1-4012-98ec-ba75e189e0ca.jpg?1702429591',
      },
      opponents: [
        {
          name: 'Jund Wildfire',
          in: [
            {
              copies: 4,
              name: 'Eldrazi Repurposer',
            },
            {
              copies: 4,
              name: 'Writhing Chrysalis',
            },
          ],
          out: [
            { copies: 4, name: 'Vines of Vastwood' },
            { copies: 4, name: 'Spinewoods Paladin' },
          ],
        },
      ],
    },
  ])

  function update(name: string, opponents: Sideboard[]) {
    const cheat = sideboards.value.find((f) => f.name === name)
    if (cheat) {
      const opponentMap = new Map()
      cheat.opponents.forEach((i) => opponentMap.set(i.name, i))
      opponents.forEach((i) => opponentMap.set(i.name, i))
      cheat.opponents = Array.from(opponentMap.values())
      console.log('Updates as: ', JSON.stringify(cheat.opponents))
    }
  }

  return { loading, sideboards, update }
})
