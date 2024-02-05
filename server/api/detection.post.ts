// @ts-expect-error esm export
import { InferenceSession, Tensor } from 'onnxruntime-node'
import sharp from 'sharp'
import { nonMaximumSuppression, normalize, softmax } from '../utils'

import literatureClassnames from './literature-classnames.json'
import rubbingClassnames from './rubbing-classnames.json'

const literatureDetector = await InferenceSession.create('public/models/detection-literature.onnx')
const literatureClassifier = await InferenceSession.create('public/models/recognition-literature.onnx')
const rubbingDetector = await InferenceSession.create('public/models/detection-rubbing.onnx')
const rubbingClassifier = await InferenceSession.create('public/models/recognition-rubbing.onnx')

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData)
    return

  const type = String(formData[0].data)

  const detector = type === 'literature' ? literatureDetector : rubbingDetector
  const classifier = type === 'literature' ? literatureClassifier : rubbingClassifier
  const classnames = type === 'literature' ? literatureClassnames : rubbingClassnames

  const detections: DetectionResult[] = []

  const image = sharp(formData[1].data).removeAlpha()
  const imageOriginal = sharp(await image.toBuffer())

  const { width, height } = await image.metadata()

  const scaleX = (Math.floor(width! / 32) * 32) / width!
  const scaleY = (Math.floor(height! / 32) * 32) / height!

  const pixels = await image
    .resize({ width: width! * scaleX, height: height! * scaleY })
    .raw()
    .toBuffer()

  const red = []
  const green = []
  const blue = []

  for (let i = 0; i < pixels.length; i += 3) {
    red.push(pixels[i] / 255)
    green.push(pixels[i + 1] / 255)
    blue.push(pixels[i + 2] / 255)
  }

  const input = new Tensor(
    'float32',
    [...red, ...green, ...blue],
    [1, 3, height! * scaleY, width! * scaleX],
  )

  const detection = (await detector.run({ images: input })).output0
  const { data, dims } = detection

  const boxes: BoundingBox[] = []
  const scores = []

  for (let i = 0; i < dims[2]; ++i) {
    const score = data[4 * dims[2] + i]
    if (score >= 0.25) {
      const x = data[i]
      const y = data[dims[2] + i]
      const w = data[2 * dims[2] + i]
      const h = data[3 * dims[2] + i]

      const x1 = Math.floor((x - w / 2) / scaleX)
      const y1 = Math.floor((y - h / 2) / scaleY)
      const x2 = Math.floor((x + w / 2) / scaleX)
      const y2 = Math.floor((y + h / 2) / scaleY)

      boxes.push([x1, y1, x2, y2])
      scores.push(score)
    }
  }

  const mean = [0.485, 0.456, 0.406]
  const std = [0.229, 0.224, 0.225]

  for (const bbox of nonMaximumSuppression(boxes, scores, 0.1)) {
    const [x1, y1, x2, y2] = bbox

    const crop = await sharp(await imageOriginal.toBuffer())
      .extract({ top: y1, left: x1, width: (x2 - x1), height: (y2 - y1) })
      .resize({ width: 224, height: 224 })
      .raw()
      .toBuffer()

    const red = []
    const green = []
    const blue = []

    for (let i = 0; i < crop.length; i += 3) {
      red.push(normalize(crop[i] / 255, mean[0], std[0]))
      green.push(normalize(crop[i + 1] / 255, mean[1], std[1]))
      blue.push(normalize(crop[i + 2] / 255, mean[2], std[2]))
    }

    const input = new Tensor('float32', [...red, ...green, ...blue], [1, 3, 224, 224])
    const output = Array.from((await classifier.run({ input })).output.data) as number[]
    const probabilities = softmax(output)

    const confidence = Math.max(...probabilities)
    const classId = classnames[probabilities.indexOf(confidence)]

    detections.push({
      bbox: [x1, y1, x2, y2],
      classId,
    })
  }

  return detections
})
