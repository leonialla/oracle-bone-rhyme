<script setup lang="ts">
const inputImage = ref<File | null>()
const recognition = ref<RecognitionResult>()
const loading = ref<boolean>(false)

const searchOptions = ref<DropdownMenuOption[]>([
  {
    name: 'literatureName',
    label: '文献名称',
  },
  {
    name: 'author',
    label: '作者',
  },
  {
    name: 'organization',
    label: '所属组织',
  },
  {
    name: 'publishingHouse',
    label: '出版社',
  },
])

async function onSubmitImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)

  loading.value = true
  recognition.value = await $fetch('/api/recognition', {
    method: 'POST',
    body: formData,
  })
  loading.value = false
}
</script>

<template>
  <div>
    <section>
      <div flex="~" justify="start" items="center">
        <div flex="~" justify="center" items="center" gap="4" px="2" py="1" border="~ base" rounded>
          <div i-carbon-image-search text="3xl" />
          单字识别
        </div>
      </div>
    </section>

    <br>

    <section flex="~ col" gap="4" border="~ base" rounded p="4">
      <div flex="~" justify="center" items="center" gap="6">
        <ImageUploader v-model="inputImage" w="50" h="50" />
        <ImageCropper v-model="inputImage" @submit="onSubmitImage" />
        <CharacterBox
          :character="recognition?.classId && recognition.confidence! > 0.4 ? recognition!.simplified : ''"
          w="50" h="50"
        />
      </div>

      <div
        v-if="loading"
        bg="green-5/10" border="~ green-5" text="green-5"
        p="2" rounded
        flex="~" justify="start" items="center" gap="2"
      >
        <div i-svg-spinners-180-ring text="2xl" />
        <div text="sm">
          识别中...
        </div>
      </div>
      <div
        v-if="recognition?.classId"
      >
        <div
          v-if="recognition.confidence! > 0.4"
          bg="green-5/10" border="~ green-5" text="green-5"
          p="2" rounded
          flex="~" justify="start" items="center" gap="2"
        >
          <div i-carbon-checkmark-outline text="2xl" />
          <div text="sm">
            类别：{{ recognition.classId }}，置信概率：{{ recognition.confidence ? (recognition.confidence! * 100).toFixed(2) : '' }}，《新编甲骨文字形总表》编码：{{ recognition.code }}
          </div>
        </div>
        <div
          v-else
          bg="red-5/10" border="~ red-5" text="red-5"
          p="2" rounded
          flex="~" justify="start" items="center" gap="2"
        >
          <div i-carbon-ai-status-failed text="2xl" />
          <div text="sm">
            识别失败
          </div>
        </div>
      </div>
      <div
        border="~ base"
        p="2" rounded
        flex="~" justify="start" items="center" gap="2"
      >
        <div i-carbon-idea text="2xl orange-4" />
        <div text="sm" op="45 hover:75 transition">
          点击 "上传图像" 以开始进行识别。
        </div>
      </div>
    </section>

    <br>

    <section>
      <div flex="~" justify="start" items="center">
        <div flex="~" justify="center" items="center" gap="4" px="2" py="1" border="~ base" rounded>
          <div i-carbon-notebook-reference text="3xl" />
          相关文献
        </div>
      </div>
    </section>

    <br>

    <section border="~ base" rounded p="4" flex="~ col" gap="5">
      <div>
        <div grid="~ cols-[1fr_14fr_1fr]" gap="2">
          <DropdownMenu :options="searchOptions" />
          <input
            type="text" placeholder="在此处键入关键词以进行检索"
            text="placeholder:sm"
            border="~ base focus:lighter" p="2" outline="none" rounded
            bg="transparent"
          >
          <div flex="~" justify="start" items="center" gap="2" text="3xl">
            <button border="~ base" bg="base hover:active" p="1" rounded text="active:green-5">
              <div i-carbon-search />
            </button>
            <button border="~ base" bg="base hover:active" p="1" rounded text="active:red-5">
              <div i-carbon-reset />
            </button>
          </div>
        </div>
      </div>
      <!-- <div>
        <ul flex="~ col" gap="2">
          <li
            v-for="i in 10" :key="i"
            border="~ base" p="2" rounded bg="hover:active"
            text="sm"
            op="75 hover:100"
            transition
          >
            <NuxtLink to="/" flex="~" justify="start" gap="4">
              <div flex="~" gap="2">
                新编甲骨文字形总表 <div>[专著]</div> <div>(ISBN：9789629960476)</div>
              </div>
              <div>
                作者：沈建华，曹锦炎
              </div>
              <div>
                出版社：香港中文大学出版社
              </div>
              <div>
                第 88 页
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div> -->
    </section>
  </div>
</template>
