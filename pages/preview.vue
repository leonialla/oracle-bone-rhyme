<script setup lang="ts">
definePageMeta({
  middleware: [
    (to) => {
      if (!to.query.name || !to.query.page || !to.query.total)
        return '/'
    },
  ],
})

const name = ref<string>()
const page = ref<number>()
const total = ref<number>()
const destination = ref<number>()

const route = useRoute()
const router = useRouter()

name.value = route.query.name as string
page.value = Number.parseInt(route.query.page as string)
total.value = Number.parseInt(route.query.total as string)

function turnToPage() {
  if (!destination.value || destination.value! < 1 || destination.value! > total.value!) {
    destination.value = undefined
    return
  }
  page.value = destination.value
  router.push({
    query: { ...route.query, page: String(page.value) },
  })
}

function prevPage() {
  page.value = page.value! > 1 ? page.value! - 1 : page.value
  router.push({
    query: { ...route.query, page: String(page.value) },
  })
}

function nextPage() {
  page.value = page.value! !== total.value ? page.value! + 1 : page.value
  router.push({
    query: { ...route.query, page: String(page.value) },
  })
}
</script>

<template>
  <header flex="~" justify="center" items="center" gap="5">
    <div flex="~" items="center" gap="2" text="md">
      <button border="~ lighter" rounded px="2" py="1" @click="prevPage">
        上一页
      </button>
      <button border="~ lighter" rounded px="2" py="1" @click="nextPage">
        下一页
      </button>
    </div>
    <div flex="~" justify="center" items="center" gap="2">
      <span>跳转至</span>
      <input
        v-model="destination"
        type="number" bg="transparent" border="b lighter" w="15" outline="none" p="1" text="center"
      >
      <span>页</span>
      <button border="~ lighter" rounded px="2" py="1" @click="turnToPage">
        跳转
      </button>
      <NuxtLink to="/" border="~ lighter" rounded px="2" py="1">
        返回首页
      </NuxtLink>
    </div>
  </header>
  <main pt="10" flex="~" justify="center">
    <img :src="`/literatures/${name}/${page}.png`" border="~ base">
  </main>
</template>
