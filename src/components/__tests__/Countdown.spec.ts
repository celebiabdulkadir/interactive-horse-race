import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Countdown from '../Countdown.vue'

describe('Countdown.vue', () => {
  it('renders countdown when countdownActive is true', () => {
    const wrapper = shallowMount(Countdown, {
      props: {
        countdown: 3,
        countdownActive: true,
      },
    })

    expect(wrapper.find('.countdown-overlay').exists()).toBe(true)
    expect(wrapper.find('.countdown-number').exists()).toBe(true)
    expect(wrapper.text()).toContain('3')
  })

  it('does not render countdown when countdownActive is false', () => {
    const wrapper = shallowMount(Countdown, {
      props: {
        countdown: 3,
        countdownActive: false,
      },
    })

    expect(wrapper.find('.countdown-overlay').exists()).toBe(false)
    expect(wrapper.find('.countdown-number').exists()).toBe(false)
  })

  it('displays the correct countdown number', () => {
    const wrapper = shallowMount(Countdown, {
      props: {
        countdown: 2,
        countdownActive: true,
      },
    })

    expect(wrapper.text()).toContain('2')
    expect(wrapper.find('.countdown-number').text()).toBe('2')
  })

  it('updates countdown number when prop changes', async () => {
    const wrapper = shallowMount(Countdown, {
      props: {
        countdown: 3,
        countdownActive: true,
      },
    })

    expect(wrapper.text()).toContain('3')

    await wrapper.setProps({ countdown: 1 })
    expect(wrapper.text()).toContain('1')
    expect(wrapper.find('.countdown-number').text()).toBe('1')
  })

  it('shows and hides overlay when countdownActive changes', async () => {
    const wrapper = shallowMount(Countdown, {
      props: {
        countdown: 3,
        countdownActive: false,
      },
    })

    expect(wrapper.find('.countdown-overlay').exists()).toBe(false)

    await wrapper.setProps({ countdownActive: true })
    expect(wrapper.find('.countdown-overlay').exists()).toBe(true)

    await wrapper.setProps({ countdownActive: false })
    expect(wrapper.find('.countdown-overlay').exists()).toBe(false)
  })

  it('handles countdown value of 0', () => {
    const wrapper = shallowMount(Countdown, {
      props: {
        countdown: 0,
        countdownActive: true,
      },
    })

    expect(wrapper.find('.countdown-overlay').exists()).toBe(true)
    expect(wrapper.find('.countdown-number').text()).toBe('0')
  })

  it('applies correct CSS classes', () => {
    const wrapper = shallowMount(Countdown, {
      props: {
        countdown: 3,
        countdownActive: true,
      },
    })

    const overlay = wrapper.find('.countdown-overlay')
    const number = wrapper.find('.countdown-number')

    expect(overlay.exists()).toBe(true)
    expect(number.exists()).toBe(true)
    expect(overlay.classes()).toContain('countdown-overlay')
    expect(number.classes()).toContain('countdown-number')
  })
})
