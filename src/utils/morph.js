// Pure geometry for the curated glyph morph. Intermediate shapes are animation only,
// not historically attested characters.

const SAMPLES = 96
const CURVE_STEPS = 14

const flatten = commands => {
  const contours = []
  let current = []
  let last = { x: 0, y: 0 }

  const close = () => {
    if (current.length > 2) contours.push(current)
    current = []
  }

  commands.forEach(command => {
    if (command.type === 'M') {
      close()
      current = [{ x: command.x, y: command.y }]
      last = { x: command.x, y: command.y }
    }
    if (command.type === 'L') {
      current.push({ x: command.x, y: command.y })
      last = { x: command.x, y: command.y }
    }
    if (command.type === 'Q') {
      for (let step = 1; step <= CURVE_STEPS; step += 1) {
        const t = step / CURVE_STEPS
        const u = 1 - t
        current.push({
          x: u * u * last.x + 2 * u * t * command.x1 + t * t * command.x,
          y: u * u * last.y + 2 * u * t * command.y1 + t * t * command.y
        })
      }
      last = { x: command.x, y: command.y }
    }
    if (command.type === 'C') {
      for (let step = 1; step <= CURVE_STEPS; step += 1) {
        const t = step / CURVE_STEPS
        const u = 1 - t
        current.push({
          x: u * u * u * last.x + 3 * u * u * t * command.x1 + 3 * u * t * t * command.x2 + t * t * t * command.x,
          y: u * u * u * last.y + 3 * u * u * t * command.y1 + 3 * u * t * t * command.y2 + t * t * t * command.y
        })
      }
      last = { x: command.x, y: command.y }
    }
    if (command.type === 'Z') close()
  })
  close()
  return contours
}

export const signedArea = points => points.reduce((sum, point, index) => {
  const next = points[(index + 1) % points.length]
  return sum + (point.x * next.y - next.x * point.y)
}, 0) / 2

// Resample a closed polyline to a fixed number of evenly spaced points.
const resample = points => {
  const closed = [...points, points[0]]
  const lengths = [0]
  for (let i = 1; i < closed.length; i += 1) {
    lengths.push(lengths[i - 1] + Math.hypot(closed[i].x - closed[i - 1].x, closed[i].y - closed[i - 1].y))
  }
  const total = lengths[lengths.length - 1]
  const result = []
  let segment = 1
  for (let i = 0; i < SAMPLES; i += 1) {
    const target = (i / SAMPLES) * total
    while (segment < lengths.length - 1 && lengths[segment] < target) segment += 1
    const span = lengths[segment] - lengths[segment - 1] || 1
    const t = (target - lengths[segment - 1]) / span
    result.push({
      x: closed[segment - 1].x + (closed[segment].x - closed[segment - 1].x) * t,
      y: closed[segment - 1].y + (closed[segment].y - closed[segment - 1].y) * t
    })
  }
  return result
}

// Fit all contours of one glyph into a size x size box. Outlines from opentype.js are already in screen coordinates.
export const normalizeGlyph = (commands, size = 100) => {
  const raw = flatten(commands)
  if (raw.length === 0) return []
  const all = raw.flat()
  const minX = Math.min(...all.map(p => p.x))
  const maxX = Math.max(...all.map(p => p.x))
  const minY = Math.min(...all.map(p => p.y))
  const maxY = Math.max(...all.map(p => p.y))
  const scale = size / Math.max(maxX - minX, maxY - minY, 1)
  const offsetX = (size - (maxX - minX) * scale) / 2
  const offsetY = (size - (maxY - minY) * scale) / 2

  return raw
    .map(contour => contour.map(p => ({
      x: (p.x - minX) * scale + offsetX,
      y: (p.y - minY) * scale + offsetY
    })))
    .map(contour => {
      const sampled = resample(contour)
      if (signedArea(sampled) < 0) sampled.reverse()
      return sampled
    })
    .sort((a, b) => Math.abs(signedArea(b)) - Math.abs(signedArea(a)))
}

// Rotate the start index of `to` so the matched points travel the least distance.
const align = (from, to) => {
  let best = 0
  let bestCost = Infinity
  for (let shift = 0; shift < to.length; shift += 1) {
    let cost = 0
    for (let i = 0; i < from.length; i += 1) {
      const target = to[(i + shift) % to.length]
      cost += (from[i].x - target.x) ** 2 + (from[i].y - target.y) ** 2
    }
    if (cost < bestCost) {
      bestCost = cost
      best = shift
    }
  }
  return to.map((_, i) => to[(i + best) % to.length])
}

const toPath = points => `M${points.map(p => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join('L')}Z`

// Returns [{ d, opacity }] for a morph position u in [0, 1] between two normalised glyphs.
export const morphShapes = (from, to, u) => {
  const count = Math.max(from.length, to.length)
  const shapes = []
  for (let i = 0; i < count; i += 1) {
    const a = from[i]
    const b = to[i]
    if (a && b) {
      const target = align(a, b)
      const points = a.map((p, index) => ({
        x: p.x + (target[index].x - p.x) * u,
        y: p.y + (target[index].y - p.y) * u
      }))
      shapes.push({ d: toPath(points), opacity: 1 })
    }
    if (a && !b) shapes.push({ d: toPath(a), opacity: 1 - u })
    if (!a && b) shapes.push({ d: toPath(b), opacity: u })
  }
  return shapes
}
