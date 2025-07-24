export function useSounds() {
  function playCountdownBeep() {
    const audio = new Audio('/beep.mp3')
    audio.play().catch((error) => {
      console.warn('Failed to play countdown sound:', error)
    })
  }

  function playStartSound() {
    const audio = new Audio('/start.mp3')
    audio.play().catch((error) => {
      console.warn('Failed to play start sound:', error)
    })
  }

  function playFinishSound() {
    const audio = new Audio('/end.mp3')
    audio.play().catch((error) => {
      console.warn('Failed to play finish sound:', error)
    })
  }

  return {
    playCountdownBeep,
    playStartSound,
    playFinishSound,
  }
}
