<script setup lang="ts">
export type ImageType = 'literature' | 'rubbing'

const imageInput = ref<File | null>()
const imageType = ref<ImageType>()
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
          <ImageUploader v-model="imageInput" w="100" h="100" />
          <ImageCropper v-model="imageInput" :stencil-aspect-ratio="9 / 16" />
        </div>
        <div
          border="~ lighter" rounded
          flex="~ col" justify="center" items="center" gap="2"
          w="100" h="100"
        >
          <div i="svg-spinners-180-ring" text="2xl" />
          <div>检测中</div>
        </div>
        <!-- <div border="~ lighter" rounded w="100" h="100" overflow="hidden" flex="~" justify="center">
          <img src="/30.png" alt="Failed to load image." object="contain" h="full">
        </div> -->
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
    </section>
  </div>
</template>
