<script setup lang="ts">
export type ImageType = 'literature' | 'rubbing'

const imageInput = ref<File | null>()
const imageType = ref<ImageType>()
const resultSrc = ref<string>()
const loading = ref<boolean>(false)

function initCanvas(canvas: HTMLCanvasElement, width = 400, height = 400, _dpi?: number) {
  const ctx = canvas.getContext('2d')!

  const dpr = window.devicePixelRatio || 1
  // @ts-expect-error vendor
  const bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1

  const dpi = _dpi || dpr / bsr

  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.width = dpi * width
  canvas.height = dpi * height
  ctx.scale(dpi, dpi)

  return { ctx, dpi }
}

async function pickImage(file: File) {
  loading.value = true
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    const image = new Image()
    image.src = reader.result as string
    image.addEventListener('load', async () => {
      const canvas = document.createElement('canvas')
      const { ctx } = initCanvas(canvas, image.width, image.height)
      ctx.drawImage(image, 0, 0, image.width, image.height)

      const formData = new FormData()
      formData.append('image', file)

      const detections = await $fetch('/api/detection', {
        method: 'POST',
        body: formData,
      })

      ctx.strokeStyle = 'green'
      ctx.lineWidth = 3

      for (const { bbox } of detections) {
        const [x1, y1, x2, y2] = bbox
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
      }

      loading.value = false
      resultSrc.value = canvas.toDataURL()
    })
  })
  reader.readAsDataURL(file)
}
</script>

<template>
  <div>
    <section>
      <div flex="~" justify="start" items="center">
        <div flex="~" justify="center" items="center" gap="4" px="2" py="1" border="~ base" rounded>
          <div i-carbon-image-search text="3xl" />
          <div>
            整页/拓片检测
          </div>
        </div>
      </div>
    </section>

    <br>

    <section flex="~ col" gap="4" border="~ base" rounded p="4">
      <div flex="~" justify="center" items="center" gap="4">
        <div>
          <ImageUploader v-model="imageInput" w="100" h="100" @pick="pickImage" />
        </div>
        <div
          border="~ lighter" rounded
          flex="~" justify="center" items="center"
          w="100" h="100" overflow="hidden"
        >
          <div v-if="loading" flex="~ col" items="center" gap="2">
            <div i="svg-spinners-180-ring" text="2xl" />
            <div>检测中</div>
          </div>
          <div v-else>
            <div v-if="resultSrc">
              <img :src="resultSrc" w="full">
            </div>
            <div v-else flex="~ col" items="center" gap="2">
              <div i="carbon-image-search-alt" text="2xl" />
              <div>结果预览</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div flex="~" justify="start" items="center" gap="2" border="~ base" rounded py="2" text="sm">
    <h1 op="45">
      请选择图像类型：
    </h1>
    <div flex="~" justify="center" items="center" gap="4">
      <button
        px="4" py="1"
        border="~ base" rounded bg="hover:active"
        :class="{ 'bg-base': imageType === 'literature' }"
        @click="imageType = 'literature'"
      >
        文献
      </button>
      <button
        px="4" py="1"
        border="~ base" rounded
        :class="{ 'bg-base': imageType === 'rubbing' }"
        @click="imageType = 'rubbing'"
      >
        拓片
      </button>
    </div>
  </div>

  <div
    border="~ base"
    p="2" rounded
    flex="~" justify="start" items="center" gap="2"
  >
    <div i-carbon-idea text="2xl orange-4" />
    <div text="sm" op="45 hover:75 transition">
      在上方选择图像类型后，点击 "上传图像" 或将图像拖动至该区域后开始检测。
    </div>
  </div>
  <div
    border="~ base"
    p="2" rounded
    flex="~" justify="start" items="center" gap="2"
  >
    <div i-carbon-idea text="2xl green-5" />
    <div text="sm" op="45 hover:75 transition">
      点击检测结果预览图像可全屏查看。
    </div>
  </div>
</template>
