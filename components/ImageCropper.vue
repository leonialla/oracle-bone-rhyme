<script lang="ts" setup>
import type { Boundaries } from 'vue-advanced-cropper'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export interface Props {
  // Crop frame aspect ratio (width/height), default 1/1.
  stencilAspectRatio?: number
  // The ratio of the longest edge of the cut box to the length of the cut screen, default 0.9, not more than 1.
  stencilSizePercentage?: number
}

const props = withDefaults(defineProps<Props>(), {
  stencilAspectRatio: 1 / 1,
  stencilSizePercentage: 0.9,
})

const emit = defineEmits<{
  (event: 'submit', file: File): void
}>()

const file = defineModel<File | null>()
const cropperDialog = ref(false)
const cropper = ref<InstanceType<typeof Cropper>>()
const cropperFlag = ref(false)
const cropperImage = reactive({
  src: '',
  type: 'image/jpg',
})

watch(file, (file, _, onCleanup) => {
  let expired = false
  onCleanup(() => expired = true)

  if (file && !cropperFlag.value) {
    cropperDialog.value = true
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      if (expired)
        return
      cropperImage.src = e.target?.result as string
      cropperImage.type = file.type
    }
  }
  cropperFlag.value = false
})

function stencilSize({ boundaries }: { boundaries: Boundaries }) {
  return {
    width: boundaries.width * props.stencilSizePercentage,
    height: boundaries.height * props.stencilSizePercentage,
  }
}

function cropImage() {
  if (cropper.value && file.value) {
    cropperFlag.value = true
    cropperDialog.value = false
    const { canvas } = cropper.value.getResult()
    canvas?.toBlob((blob) => {
      file.value = new File([blob as any], `cropped${file.value?.name}` as string, { type: blob?.type })
      emit('submit', file.value)
    }, cropperImage.type)
  }
}

function submitOriginal() {
  if (cropper.value && file.value) {
    cropperDialog.value = false
    emit('submit', file.value)
  }
}
</script>

<template>
  <ModalDialog v-model="cropperDialog" :use-v-if="false" max-w-400px flex>
    <div w-0 flex-1>
      <div my2 px3 py-2 text-center>
        选择上传区域
      </div>
      <div aspect-ratio-1>
        <Cropper
          ref="cropper"
          class="h-full w-full overflow-hidden"
          :src="cropperImage.src"
          :resize-image="{
            adjustStencil: false,
          }"
          :stencil-size="stencilSize"
          :stencil-props="{
            aspectRatio: props.stencilAspectRatio,
            movable: false,
            resizable: false,
            handlers: {},
          }"
          image-restriction="stencil"
        />
      </div>
      <div m-4>
        <button
          w-full cursor-pointer rounded px-4 py-2
          text-sm disabled:pointer-events-none
          bg="hover:active"
          border="~ lighter" outline="focus-visible:none"
          duration="300"
          @click="cropImage()"
        >
          确认上传
        </button>
      </div>
      <div m-4>
        <button
          w-full cursor-pointer rounded px-4 py-2
          text-sm disabled:pointer-events-none
          bg="hover:active"
          border="~ lighter" outline="focus-visible:none"
          duration="300"
          @click="submitOriginal"
        >
          上传原图
        </button>
      </div>
    </div>
  </ModalDialog>
</template>
