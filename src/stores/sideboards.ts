import { defineStore } from 'pinia'
import { ref } from 'vue'
import jund from '@/assets/sideboards/jund_wildfire.json'

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
  updated?: Date
}

export type Visibility = 'private' | 'link' | 'public'

export type Cheatsheet = {
  art?: string
  name: string
  archetype?: string
  opponents: Sideboard[]
  visibility: Visibility
}

export const lost =
  'https://cards.scryfall.io/art_crop/front/7/9/79b2c547-0d9e-4fd7-a399-347ad908c70b.jpg?1702429390'

export const whiteWeenie = {
  id: 3,
  name: 'White Weenie',
  art: 'https://cards.scryfall.io/art_crop/front/0/8/08a5007f-06a0-40fa-a252-c38baa6b5c6f.jpg?1736467608',
  colors: 'W',
}

export const gruulMonsters = {
  id: 4,
  name: 'Gruul Monsters',
  art: 'https://cards.scryfall.io/art_crop/front/5/e/5ea568df-04a1-4012-98ec-ba75e189e0ca.jpg?1702429591',
  colors: 'GR',
}

export const monoUTerror = {
  id: 4,
  name: 'Mono Blue Terror',
  art: 'https://cards.scryfall.io/art_crop/front/4/2/42f01cba-43d4-46ad-b7a5-d7631b0e1347.jpg?1673306903',
  colors: 'U',
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
  whiteWeenie,
  gruulMonsters,
  {
    id: 5,
    name: 'Mono Red Kuldotha',
    art: 'https://cards.scryfall.io/art_crop/front/7/e/7ee07266-a95d-4cd8-9863-1664922e9490.jpg?1710406507',
    colors: 'R',
  },
  {
    id: 6,
    name: 'Mono Blue Faeries',
    art: 'https://cards.scryfall.io/art_crop/front/1/c/1c487f1a-a51d-449c-827d-c7b9381acb34.jpg?1562009681',
    colors: 'U',
  },
]

export const useSideboardStore = defineStore('sideboard', () => {
  const loading = ref(false)

  const sideboards = ref<Cheatsheet[]>([
    {
      art: 'https://cards.scryfall.io/art_crop/front/4/9/492d77e5-acc6-41b8-8930-f39d69234919.jpg?1604196948',
      name: 'Jund Wildfire',
      archetype: 'Jund Wildfire',
      opponents: jund,
      visibility: 'public',
    },
    {
      art: 'https://cards.scryfall.io/art_crop/front/5/e/5ea568df-04a1-4012-98ec-ba75e189e0ca.jpg?1702429591',
      name: 'Gruul Monsters',
      archetype: 'Gruul Monsters',
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
      visibility: 'public',
    },
    {
      name: 'White Weenie',
      archetype: 'White Weenie',
      opponents: [],
      visibility: 'public',
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
