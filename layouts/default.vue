<script setup lang="ts">
const atHomePage = ref<boolean>(true)
</script>

<template>
  <div v-if="atHomePage" w="screen" h="screen" @click="atHomePage = false">
    <img src="/welcome.png">
  </div>
  <div v-else>
    <ClientOnly>
      <Plum />
    </ClientOnly>
    <div v-if="!isMobileDevice" h="screen" flex="~ col">
      <div px="30" py="4">
        <TheNav />
        <div py="2" flex="auto">
          <NuxtPage :keepalive="true" />
        </div>
      </div>
    </div>
    <div v-else h="screen" flex="~" justify="center" items="center">
      <div>
        此应用目前暂不支持移动端设备，请使用 PC 端访问。
      </div>
    </div>
  </div>
</template>
