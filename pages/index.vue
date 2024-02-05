<script setup lang="ts">
import Fuse from 'fuse.js'

interface AssociatedLiterature {
  literature: Literature
  page: number
}

const inputImage = ref<File | null>()
const recognition = ref<RecognitionResult>()
const searchKeyword = ref<string>()
const associatedLiteratures = ref<AssociatedLiterature[]>([])
const fetchedLiteratures = ref<AssociatedLiterature[]>([])
const loading = ref<boolean>(false)

const searchOptions = ref([
  { name: 'title', label: '文献名称' },
  { name: 'author', label: '作者' },
  { name: 'organization', label: '所属组织' },
  { name: 'publishingHouse', label: '出版社' },
])

const selectedOption = ref(searchOptions.value[0])

async function fetchAssociatedLiteratures() {
  if (!recognition.value?.classId)
    return

  const associations = await $fetch('/api/literatures', { query: { classId: recognition.value.classId } })

  associatedLiteratures.value = associations.flatMap(
    association => association.pages.map(page => ({ literature: association.literature, page })),
  )

  fetchedLiteratures.value = associatedLiteratures.value
}

async function onSubmitImage(file: File) {
  recognition.value = undefined
  associatedLiteratures.value = []

  const formData = new FormData()
  formData.append('image', file)

  loading.value = true
  recognition.value = await $fetch('/api/recognition', { method: 'POST', body: formData })
  loading.value = false

  await fetchAssociatedLiteratures()
}

async function search() {
  const { name } = selectedOption.value
  const keyword = searchKeyword.value

  if (!keyword) {
    associatedLiteratures.value = fetchedLiteratures.value
  }
  else {
    associatedLiteratures.value = new Fuse(fetchedLiteratures.value, { keys: [`literature.${name}`] })
      .search(keyword)
      .map(({ item }) => item)
  }
}

function reset() {
  associatedLiteratures.value = fetchedLiteratures.value
  searchKeyword.value = ''
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
            类别编码：{{ recognition.classId }}，置信概率：{{ recognition.confidence ? (recognition.confidence! * 100).toFixed(2) : '' }}，《新编甲骨文字形总表》编码：{{ recognition.code }}
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
          点击 "上传图像" 区域以开始进行识别。
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
          <DropdownMenu v-model="selectedOption" :options="searchOptions" />
          <input
            v-model="searchKeyword" type="text"
            placeholder="在此处键入关键词以进行检索"
            text="placeholder:sm" border="~ base focus:lighter" p="2" outline="none"
            rounded
            bg="transparent"
          >
          <div flex="~" justify="start" items="center" gap="2" text="3xl">
            <button border="~ base" bg="base hover:active" p="1" rounded text="active:green-5" @click="search">
              <div i-carbon-search />
            </button>
            <button border="~ base" bg="base hover:active" p="1" rounded text="active:red-5" @click="reset">
              <div i-carbon-reset />
            </button>
          </div>
        </div>
      </div>
      <div>
        <ul flex="~ col" gap="2">
          <li
            v-for="{ literature, page } in associatedLiteratures" :key="literature.title"
            border="~ base" p="2" rounded bg="hover:active"
            text="sm"
            op="75 hover:100"
            transition
          >
            <NuxtLink :to="`/preview?name=${literature.title}&page=${page - 1}&total=${literature.totalPages}`" flex="~" justify="start" gap="4">
              <div flex="~" gap="2">
                {{ literature.title }}
                <div v-if="literature.isbn">
                  (ISBN：{{ literature.isbn }})
                </div>
              </div>
              <div v-if="literature.author">
                作者：{{ literature.author }}
              </div>
              <div v-if="literature.publishingHouse">
                出版社：{{ literature.publishingHouse }}
              </div>
              <div>
                第 {{ page }} 页
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
