import { createPinia, setActivePinia } from 'pinia'
import { useCards } from './../cards'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import scryfall from '@/services/scryfall'
import fuzzy from '../../../cypress/fixtures/scryfall/eviscerators_insight_fuzzy.json'

describe('Use cards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('Load cards from scryfall', async () => {
    const spy = vi.spyOn(scryfall, 'fuzzySearch')
    spy.mockImplementationOnce(async (name: string) => {
      await Promise.resolve()
      return fuzzy
    })
    const cards = useCards()
    const res = await cards.get('prova')
    expect(spy).toHaveBeenCalledOnce()
    expect(res).to.have.property('name', "Eviscerator's Insight")
  })
})
