import * as Tone from 'tone'

const synths = [
  new Tone.MembraneSynth(),
  new Tone.MetalSynth(),
  new Tone.Synth({ oscillator: { type: 'triangle' } }),
  new Tone.Synth({ oscillator: { type: 'square' } }),
  new Tone.Synth({ oscillator: { type: 'sawtooth' } }),
  new Tone.Synth({ oscillator: { type: 'triangle' } }),
  new Tone.MembraneSynth(),
  new Tone.MetalSynth(),
  new Tone.Synth()
].map(s => s.toDestination())

const subdivisions = ['1m','2n','4n','8n','16n','32n']
const loops = Array(9).fill(null)

export function play(index) {
  synths[index]?.triggerAttackRelease('C4', '8n')
}

export async function toggleTransport() {
  if (Tone.context.state !== 'running') await Tone.start()
  if (Tone.Transport.state === 'started') {
    Tone.Transport.stop()
    return false
  } else {
    Tone.Transport.start()
    return true
  }
}

export function setBpm(bpm) {
  Tone.Transport.bpm.value = bpm
}

export function toggleLoop(index) {
  const current = loops[index]
  if (current) {
    current.loop.dispose()
    loops[index] = null
    return false
  }
  const taken = loops.filter(l => l).map(l => l.sub)
  const free = subdivisions.find(s => !taken.includes(s))
  if (!free) return false
  const loop = new Tone.Loop(time => {
    play(index)
  }, free).start(0)
  loops[index] = { loop, sub: free }
  return true
}
