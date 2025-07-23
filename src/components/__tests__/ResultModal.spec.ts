import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ResultModal from '../ResultModal.vue'
import type { RaceResult } from '../../store/types'

// Mock RaceResultCard component
vi.mock('../RaceResultCard.vue', () => ({
  default: {
    name: 'RaceResultCard',
    template: '<div class="race-result-card-mock"></div>',
    props: ['results', 'distance', 'roundNumber'],
  },
}))

describe('ResultModal.vue', () => {
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
  ]

  it('renders modal when showResultModal is true', () => {
    const wrapper = shallowMount(ResultModal, {
      props: {
        showResultModal: true,
        results: mockResults,
        distance: 1200,
        roundNumber: 1,
      },
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.find('.modal-content').exists()).toBe(true)
  })

  it('does not render modal when showResultModal is false', () => {
    const wrapper = shallowMount(ResultModal, {
      props: {
        showResultModal: false,
        results: mockResults,
        distance: 1200,
        roundNumber: 1,
      },
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    expect(wrapper.find('.modal-content').exists()).toBe(false)
  })

  it('passes correct props to RaceResultCard', () => {
    const wrapper = shallowMount(ResultModal, {
      props: {
        showResultModal: true,
        results: mockResults,
        distance: 1400,
        roundNumber: 3,
      },
    })

    const raceResultCard = wrapper.findComponent({ name: 'RaceResultCard' })
    expect(raceResultCard.exists()).toBe(true)
    expect(raceResultCard.props()).toEqual({
      results: mockResults,
      distance: 1400,
      roundNumber: 3,
    })
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = shallowMount(ResultModal, {
      props: {
        showResultModal: true,
        results: mockResults,
        distance: 1200,
        roundNumber: 1,
      },
    })

    const closeButton = wrapper.find('button')
    expect(closeButton.exists()).toBe(true)
    expect(closeButton.text()).toBe('Close')

    await closeButton.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('handles empty results array', () => {
    const wrapper = shallowMount(ResultModal, {
      props: {
        showResultModal: true,
        results: [],
        distance: 1200,
        roundNumber: 1,
      },
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    const raceResultCard = wrapper.findComponent({ name: 'RaceResultCard' })
    expect(raceResultCard.props('results')).toEqual([])
  })

  it('updates when props change', async () => {
    const wrapper = shallowMount(ResultModal, {
      props: {
        showResultModal: false,
        results: [],
        distance: 1200,
        roundNumber: 1,
      },
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(false)

    await wrapper.setProps({
      showResultModal: true,
      results: mockResults,
      distance: 1600,
      roundNumber: 2,
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    const raceResultCard = wrapper.findComponent({ name: 'RaceResultCard' })
    expect(raceResultCard.props()).toEqual({
      results: mockResults,
      distance: 1600,
      roundNumber: 2,
    })
  })

  it('applies correct CSS classes', () => {
    const wrapper = shallowMount(ResultModal, {
      props: {
        showResultModal: true,
        results: mockResults,
        distance: 1200,
        roundNumber: 1,
      },
    })

    const overlay = wrapper.find('.modal-overlay')
    const content = wrapper.find('.modal-content')
    const button = wrapper.find('button')

    expect(overlay.classes()).toContain('modal-overlay')
    expect(content.classes()).toContain('modal-content')
    expect(button.exists()).toBe(true)
  })

  it('handles prop type validation', () => {
    const wrapper = shallowMount(ResultModal, {
      props: {
        showResultModal: true,
        results: mockResults,
        distance: 1200,
        roundNumber: 1,
      },
    })

    expect(wrapper.props('showResultModal')).toBe(true)
    expect(wrapper.props('results')).toEqual(mockResults)
    expect(wrapper.props('distance')).toBe(1200)
    expect(wrapper.props('roundNumber')).toBe(1)
  })
})
