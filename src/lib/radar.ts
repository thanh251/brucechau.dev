const CENTER_X = 160
const CENTER_Y = 126
const RADIUS = 74

export const radarPoints = (values: readonly number[]) => values.map((value, index) => {
  const angle = -Math.PI / 2 + index * (2 * Math.PI / 5)
  const distance = RADIUS * Math.max(0, Math.min(5, value)) / 5
  const x = CENTER_X + Math.cos(angle) * distance
  const y = CENTER_Y + Math.sin(angle) * distance
  return `${x.toFixed(2)},${y.toFixed(2)}`
}).join(' ')

export const radarSpokeEnds = [0, 1, 2, 3, 4].map((index) => {
  const angle = -Math.PI / 2 + index * (2 * Math.PI / 5)
  return {
    x: CENTER_X + Math.cos(angle) * RADIUS,
    y: CENTER_Y + Math.sin(angle) * RADIUS,
  }
})
