import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSounds } from '../useSounds'

// Mock Audio constructor
const mockAudio = {
  play: vi.fn().mockResolvedValue(undefined),
}

global.Audio = vi.fn(() => mockAudio) as any

describe('useSounds', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns sound functions', () => {
    const { playCountdownBeep, playStartSound, playFinishSound } = useSounds()

    expect(typeof playCountdownBeep).toBe('function')
    expect(typeof playStartSound).toBe('function')
    expect(typeof playFinishSound).toBe('function')
  })

  it('playCountdownBeep creates and plays audio', () => {
    const { playCountdownBeep } = useSounds()

    playCountdownBeep()

    expect(global.Audio).toHaveBeenCalledWith('/beep.mp3')
    expect(mockAudio.play).toHaveBeenCalled()
  })

  it('playStartSound creates and plays audio', () => {
    const { playStartSound } = useSounds()

    playStartSound()

    expect(global.Audio).toHaveBeenCalledWith('/start.mp3')
    expect(mockAudio.play).toHaveBeenCalled()
  })

  it('playFinishSound creates and plays audio', () => {
    const { playFinishSound } = useSounds()

    playFinishSound()

    expect(global.Audio).toHaveBeenCalledWith('/end.mp3')
    expect(mockAudio.play).toHaveBeenCalled()
  })

  it('handles audio play errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockAudio.play.mockRejectedValue(new Error('Audio play failed'))

    const { playCountdownBeep } = useSounds()

    await playCountdownBeep()

    expect(consoleSpy).toHaveBeenCalledWith('Failed to play countdown sound:', expect.any(Error))
    consoleSpy.mockRestore()
  })
})
