export const audioFrequencyBands = [
  { key: 'subBass', label: 'Sub-bass', from: 20, to: 60 },
  { key: 'bass', label: 'Bass', from: 60, to: 250 },
  { key: 'lowerMids', label: 'Lower mids', from: 250, to: 1000 },
  { key: 'upperMids', label: 'Upper mids', from: 1000, to: 2500 },
  { key: 'presence', label: 'Presence', from: 2500, to: 5000 },
  { key: 'treble', label: 'Treble', from: 5000, to: 10000 },
] as const

export type AudioBandKey = (typeof audioFrequencyBands)[number]['key']

export interface AudioFrequencyResponse {
  sourceName: string
  sourceUrl: string
  contextName: string
  contextUrl: string
  points: readonly (readonly [number, number])[]
  impressions: Record<AudioBandKey, string>
}

export const frequencyX = (hz: number) => 48 + (Math.log10(hz / 20) / Math.log10(10000 / 20)) * 652
export const frequencyY = (db: number) => 20 + ((12 - db) / 26) * 166

export const frequencyPath = (points: AudioFrequencyResponse['points']) =>
  points
    .filter(([hz]) => hz >= 20 && hz <= 10000)
    .map(([hz, db], index) => `${index === 0 ? 'M' : 'L'}${frequencyX(hz).toFixed(1)} ${frequencyY(db).toFixed(1)}`)
    .join(' ')
