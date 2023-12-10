<script setup lang="ts">
const colorMode = useColorMode()

const { x, y } = useMouse()
</script>

<template>
  <div text="red">
    Hi, there! ({{ x }}, {{ y }})
  </div>

  <button @click="colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'">
    {{ colorMode.value }}
  </button>
</template>
