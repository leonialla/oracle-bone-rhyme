<script setup lang="ts">
import '~/styles/main.css'
import '@unocss/reset/tailwind.css'
import 'floating-vue/dist/style.css'

useHead({
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0',
    },
  ],
  htmlAttrs: {
    lang: 'zh-Hans',
  },
  title: '甲骨气韵',
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
