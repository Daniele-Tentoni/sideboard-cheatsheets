import { SideboardError } from '@/stores/cards'
import type { ScryfallCard } from '@/stores/sideboards'

export default {
  async artImage() {
    const res = await fetch('https://api.scryfall.com/cards/art_crop')
    const jj = await res.json()
    return jj
  },
  async fuzzySearch(name: string) {
    const scryfallCard = await fetch('https://api.scryfall.com/cards/named?fuzzy=' + name)
    if (scryfallCard.ok) {
      const card: ScryfallCard = await scryfallCard.json()
      return card
    }

    const obj = await scryfallCard.json()
    const e = new SideboardError('Get card error', obj)
    throw e
  },
}
