<script setup lang="ts">
definePageMeta({
  middleware: [
    (to) => {
      if (!to.query.name || !to.query.page)
        return '/'
    },
  ],
})

const name = ref<string>()
const page = ref<number>()

const route = useRoute()

name.value = route.query.name as string
page.value = Number.parseInt(route.query.page as string)
</script>

<template>
  <header flex="~" justify="center" items="center" gap="5">
    <div flex="~" items="center" gap="2" text="md">
      <button border="~ lighter" rounded px="2" py="1">
        上一页
      </button>
      <button border="~ lighter" rounded px="2" py="1">
        下一页
      </button>
    </div>
    <div flex="~" justify="center" items="center" gap="2">
      <span>跳转到</span>
      <input type="text" bg="transparent" border="b lighter" w="20" outline="none" p="1" text="center">
      <span>页</span>
      <button border="~ lighter" rounded px="2" py="1">
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
