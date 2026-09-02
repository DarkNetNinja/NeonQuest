'use client'

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function blip(freq: number, start: number, duration: number, type: OscillatorType, gain = 0.06) {
  const audio = getCtx()
  if (!audio) return
  const t = audio.currentTime + start
  const osc = audio.createOscillator()
  const g = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(g)
  g.connect(audio.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

/** Short satisfying "task complete" chirp. */
export function playComplete() {
  blip(660, 0, 0.12, 'square')
  blip(990, 0.08, 0.14, 'square')
}

/** Rising arpeggio fanfare for level up. */
export function playLevelUp() {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((f, i) => blip(f, i * 0.1, 0.2, 'sawtooth', 0.05))
  blip(1318.5, 0.42, 0.35, 'square', 0.05)
}
