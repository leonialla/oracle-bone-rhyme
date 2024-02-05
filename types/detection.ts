export type BoundingBox = [number, number, number, number]

export interface DetectionResult {
  bbox: BoundingBox
  classId: string
}
