import { defineStore } from 'pinia'
import { ref } from 'vue'

export type DeckCard = {
  copies: number
  name: string
}

export type Sideboard = {
  name: string
  in?: DeckCard[]
  out?: DeckCard[]
  note?: string[]
}

export const useSideboardStore = defineStore('sideboard', () => {
  const loading = ref(false)

  const sideboards = ref<{ name: string; opponents: Sideboard[] }[]>([
    {
      name: 'Jund Wildfire',
      opponents: [
        {
          name: 'Golgari Glee',
          in: [
            { copies: 3, name: 'Duress' },
            { copies: 1, name: 'Thorn of the Black Rose' },
            { copies: 2, name: 'Avenging Hunter' },
            { copies: 2, name: 'Snuff Out' },
          ],
          out: [
            { copies: 4, name: 'Writhing Chrysalis' },
            { copies: 2, name: 'Toxin Analysis' },
            { copies: 1, name: 'Blood Fountain' },
            { copies: 1, name: 'Nihil Spellbomb' },
          ],
        },
      ],
    },
    {
      name: 'Gruul Monsters',
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

  return { loading, sideboards }
})
