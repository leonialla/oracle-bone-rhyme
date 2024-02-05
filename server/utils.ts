export function normalize(input: number, mean: number, std: number) {
  return (input - mean) / std
}

export function softmax(input: number[]) {
  const max = Math.max(...input)
  const exps = input.map(value => Math.exp(value - max))
  const expSum = exps.reduce((accumulate, current) => accumulate + current, 0)

  return exps.map(exp => exp / expSum)
}

export function calculateIoU(bbox1: BoundingBox, bbox2: BoundingBox) {
  const x1 = Math.max(bbox1[0], bbox2[0])
  const y1 = Math.max(bbox1[1], bbox2[1])
  const x2 = Math.min(bbox1[2], bbox2[2])
  const y2 = Math.min(bbox1[3], bbox2[3])

  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1)

  const area1 = (bbox1[2] - bbox1[0]) * (bbox1[3] - bbox1[1])
  const area2 = (bbox2[2] - bbox2[0]) * (bbox2[3] - bbox2[1])
  const union = area1 + area2 - intersection

  return union > 0 ? intersection / union : 0
}

export const EPSILON = 1e-5

export function nonMaximumSuppression(
  boxes: BoundingBox[],
  scores: number[],
  threshold: number = 0.5,
) {
  if (!boxes.length || !scores.length)
    return []

  if (boxes.length !== scores.length)
    throw new Error('Boxes and scores must have the same length.')

  const indices = scores.map((_, index) => index).sort((a, b) => scores[b] - scores[a])
  const kept: number[] = []

  for (const i of indices) {
    let shouldKeep = true
    for (const j of kept) {
      if (calculateIoU(boxes[i], boxes[j]) + EPSILON > threshold) {
        shouldKeep = false
        break
      }
    }
    if (shouldKeep)
      kept.push(i)
  }

  return kept.map(i => boxes[i])
}
