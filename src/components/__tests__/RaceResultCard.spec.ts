import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import RaceResultCard from '../RaceResultCard.vue'
import type { RaceResult } from '../../store/types'

describe('RaceResultCard.vue', () => {
  const mockResults: RaceResult[] = [
    {
      position: 1,
      horse: {
        id: 1,
        name: 'Thunder Bolt',
        color: '#ff0000',
        condition: 85,
        position: 1200,
        speed: 1,
      },
      time: 10.5,
    },
    {
      position: 2,
      horse: {
        id: 2,
        name: 'Lightning Flash',
        color: '#00ff00',
        condition: 92,
        position: 1200,
        speed: 1,
      },
      time: 11.2,
    },
    {
      position: 3,
      horse: {
        id: 3,
        name: 'Storm Rider',
        color: '#0000ff',
        condition: 78,
        position: 1200,
        speed: 1,
      },
      time: 12.1,
    },
    {
      position: 4,
      horse: {
        id: 4,
        name: 'Wind Walker',
        color: '#ffff00',
        condition: 88,
        position: 1200,
        speed: 1,
      },
      time: 12.8,
    },
  ]

  it('renders card header with round and distance', () => {
    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: mockResults,
        roundNumber: 3,
        distance: 1600,
      },
    })

    expect(wrapper.find('.round-badge').text()).toBe('R3')
    expect(wrapper.find('.distance').text()).toBe('1600m')
  })

  it('renders card header without round and distance when not provided', () => {
    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: mockResults,
      },
    })

    expect(wrapper.find('.round-badge').exists()).toBe(false)
    expect(wrapper.find('.distance').exists()).toBe(false)
  })

  it('displays top 3 results in podium', () => {
    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: mockResults,
        roundNumber: 1,
        distance: 1200,
      },
    })

    const podiumItems = wrapper.findAll('.podium-item')
    expect(podiumItems.length).toBe(3)

    // Check first place
    expect(podiumItems[0].text()).toContain('🥇')
    expect(podiumItems[0].text()).toContain('Thunder Bolt')
    expect(podiumItems[0].text()).toContain('10.50s')

    // Check second place
    expect(podiumItems[1].text()).toContain('🥈')
    expect(podiumItems[1].text()).toContain('Lightning Flash')
    expect(podiumItems[1].text()).toContain('11.20s')

    // Check third place
    expect(podiumItems[2].text()).toContain('🥉')
    expect(podiumItems[2].text()).toContain('Storm Rider')
    expect(podiumItems[2].text()).toContain('12.10s')
  })

  it('shows expandable details when more than 3 results', () => {
    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: mockResults,
        roundNumber: 1,
        distance: 1200,
      },
    })

    const details = wrapper.find('.all-results')
    expect(details.exists()).toBe(true)

    const summary = wrapper.find('.show-all')
    expect(summary.exists()).toBe(true)
    expect(summary.text()).toContain('Show all 4 horses')
  })

  it('does not show expandable details when 3 or fewer results', () => {
    const threeResults = mockResults.slice(0, 3)
    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: threeResults,
        roundNumber: 1,
        distance: 1200,
      },
    })

    expect(wrapper.find('.all-results').exists()).toBe(false)
    expect(wrapper.find('.show-all').exists()).toBe(false)
  })

  it('displays remaining results in expandable section', () => {
    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: mockResults,
        roundNumber: 1,
        distance: 1200,
      },
    })

    const remainingResults = wrapper.findAll('.result-row')
    expect(remainingResults.length).toBe(1) // Only 4th place horse

    expect(remainingResults[0].text()).toContain('4')
    expect(remainingResults[0].text()).toContain('Wind Walker')
    expect(remainingResults[0].text()).toContain('12.80s')
  })

  it('applies correct horse colors', () => {
    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: mockResults,
        roundNumber: 1,
        distance: 1200,
      },
    })

    const horseMinis = wrapper.findAll('.horse-mini')
    expect(horseMinis[0].attributes('style')).toContain('background-color: rgb(255, 0, 0)')
    expect(horseMinis[1].attributes('style')).toContain('background-color: rgb(0, 255, 0)')
    expect(horseMinis[2].attributes('style')).toContain('background-color: rgb(0, 0, 255)')
  })

  it('handles empty results array', () => {
    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: [],
        roundNumber: 1,
        distance: 1200,
      },
    })

    expect(wrapper.findAll('.podium-item').length).toBe(0)
    expect(wrapper.find('.all-results').exists()).toBe(false)
  })

  it('handles single result', () => {
    const singleResult = [mockResults[0]]
    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: singleResult,
        roundNumber: 1,
        distance: 1200,
      },
    })

    const podiumItems = wrapper.findAll('.podium-item')
    expect(podiumItems.length).toBe(1)
    expect(podiumItems[0].text()).toContain('🥇')
    expect(podiumItems[0].text()).toContain('Thunder Bolt')
    expect(wrapper.find('.all-results').exists()).toBe(false)
  })

  it('formats time correctly', () => {
    const resultWithDecimal: RaceResult[] = [
      {
        position: 1,
        horse: { id: 1, name: 'Test Horse', color: '#fff', condition: 50, position: 0, speed: 1 },
        time: 9.876,
      },
    ]

    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: resultWithDecimal,
        roundNumber: 1,
        distance: 1200,
      },
    })

    expect(wrapper.text()).toContain('9.88s') // Should round to 2 decimal places
  })

  it('displays correct medal emojis', () => {
    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: mockResults,
        roundNumber: 1,
        distance: 1200,
      },
    })

    const medals = wrapper.findAll('.position-medal')
    expect(medals[0].text()).toBe('🥇')
    expect(medals[1].text()).toBe('🥈')
    expect(medals[2].text()).toBe('🥉')
  })

  it('handles results beyond 3rd place without medals', () => {
    const manyResults = [
      ...mockResults,
      {
        position: 5,
        horse: {
          id: 5,
          name: 'Fifth Horse',
          color: '#purple',
          condition: 70,
          position: 1200,
          speed: 1,
        },
        time: 13.5,
      },
    ]

    const wrapper = shallowMount(RaceResultCard, {
      props: {
        results: manyResults,
        roundNumber: 1,
        distance: 1200,
      },
    })

    // Podium should still only show top 3
    const podiumItems = wrapper.findAll('.podium-item')
    expect(podiumItems.length).toBe(3)

    // Expandable section should show remaining 2 horses
    const remainingResults = wrapper.findAll('.result-row')
    expect(remainingResults.length).toBe(2)

    expect(wrapper.find('.show-all').text()).toContain('Show all 5 horses')
  })
})
