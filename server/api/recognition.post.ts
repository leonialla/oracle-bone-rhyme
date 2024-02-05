// @ts-expect-error esm export
import { InferenceSession, Tensor } from 'onnxruntime-node'
import sharp from 'sharp'
import { normalize, softmax } from '../utils'
import classnames from './assets/literature-classnames.json'
import glyphs from './assets/glyphs.json'

const session = await InferenceSession.create('public/models/recognition-literature.onnx')

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (formData) {
    const pixels = await sharp(formData[0].data)
      .removeAlpha()
      .resize({ width: 224, height: 224, fit: 'fill' })
      .raw()
      .toBuffer()

    const red = []
    const green = []
    const blue = []

    const mean = [0.485, 0.456, 0.406]
    const std = [0.229, 0.224, 0.225]

    for (let i = 0; i < pixels.length; i += 3) {
      red.push(normalize(pixels[i] / 255, mean[0], std[0]))
      green.push(normalize(pixels[i + 1] / 255, mean[1], std[1]))
      blue.push(normalize(pixels[i + 2] / 255, mean[2], std[2]))
    }

    const input = new Tensor('float32', [...red, ...green, ...blue], [1, 3, 224, 224])
    const output = Array.from((await session.run({ input })).output.data) as number[]
    const probabilities = softmax(output)

    const confidence = Math.max(...probabilities)
    const classId = classnames[probabilities.indexOf(confidence)]

    const glyph = glyphs.find(it => it.classId === classId)

    return {
      classId,
      confidence,
      code: glyph?.code,
      simplified: glyph?.simplified,
    } as RecognitionResult
  }
})
