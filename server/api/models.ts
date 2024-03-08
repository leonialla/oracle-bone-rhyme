// @ts-expect-error esm export
import { InferenceSession } from 'onnxruntime-node'

export const literatureDetector = await InferenceSession.create('public/models/detection-literature.onnx')
export const literatureClassifier = await InferenceSession.create('public/models/recognition-literature.onnx')
export const rubbingDetector = await InferenceSession.create('public/models/detection-rubbing.onnx')
export const rubbingClassifier = await InferenceSession.create('public/models/recognition-rubbing.onnx')
