<template>
  <ClientOnly>
    <Plum />
  </ClientOnly>
  <div v-if="!isMobileDevice" px="30" py="4">
    <TheNav />
    <div py="2" />
    <slot />
  </div>
  <div v-else h="screen" flex="~" justify="center" items="center">
    <div>
      此应用目前暂不支持移动端设备，请使用 PC 端访问。
    </div>
  </div>
</template>
