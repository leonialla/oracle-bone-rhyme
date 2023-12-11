<script lang="ts" setup>
import { fileOpen } from 'browser-fs-access'
import type { FileWithHandle } from 'browser-fs-access'

const props = withDefaults(defineProps<{
  /** The image src before change */
  original?: string
  /** Allowed file types */
  allowedFileTypes?: string[]
  /** Allowed file size */
  allowedFileSize?: number
  imgClass?: string
}>(), {
  allowedFileTypes: () => ['image/jpeg', 'image/png'],
  allowedFileSize: 1024 * 1024 * 5, // 5 MB
})

const emit = defineEmits<{
  (event: 'pick', value: FileWithHandle): void
  (event: 'error', code: number, message: string): void
}>()

const file = defineModel<FileWithHandle | null>()

const defaultImage = computed(() => props.original || '')
/** Preview of selected images */
const previewImage = ref('')
/** The current images on display */
const imageSrc = computed<string>(() => previewImage.value || defaultImage.value)

async function pickImage() {
  const image = await fileOpen({
    description: 'Image',
    mimeTypes: props.allowedFileTypes,
  })

  if (!image)
    return

  if (!props.allowedFileTypes.includes(image.type)) {
    emit('error', 1, '不支持的文件格式')
    return
  }
  else if (image.size > props.allowedFileSize) {
    emit('error', 2, `图像大小上限为 ${props.allowedFileSize} Bytes`)
    return
  }

  file.value = image
  emit('pick', file.value)
}

watch(file, (image, _, onCleanup) => {
  let expired = false
  onCleanup(() => expired = true)

  if (!image) {
    previewImage.value = ''
    return
  }

  const reader = new FileReader()
  reader.readAsDataURL(image)
  reader.onload = (evt) => {
    if (expired)
      return
    previewImage.value = evt.target?.result as string
  }
})
</script>

<template>
  <label
    class="focus-within:(outline)"
    relative flex cursor-pointer items-center justify-center of-hidden
    duration="300"
    bg="hover:active"
    border="~ lighter" rounded
    @click="pickImage"
  >
    <img
      v-if="imageSrc"
      :src="imageSrc"
      :class="imgClass || ''"
      h-full w-full object-cover
    >
    <span
      v-if="!imageSrc"
      absolute flex="~ col" items-center justify-center gap-2 rounded-full
    >
      <span i-carbon:cloud-upload block text="2xl" />
      <span>上传图像</span>
    </span>
  </label>
</template>
