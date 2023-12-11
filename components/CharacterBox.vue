<script setup lang="ts">
defineProps<{
  character: string
}>()
</script>

<template>
  <div
    relative
    text="9xl" border="~ #8884" rounded="md"
    flex="~" justify="center" items="center"
  >
    <div w="1/2" h="full" absolute left="0" border="r-2 lighter dashed" />
    <div w="full" h="1/2" absolute top="0" border="b-2 lighter dashed" />
    <div
      w="1/2" h="full" absolute left="0" border="r lighter dashed"
      rotate="45" origin="right" scale="140"
    />
    <div
      w="full" h="1/2" absolute top="0" border="b lighter dashed"
      rotate="45" origin="bottom" scale="140"
    />
    <div absolute z="1">
      {{ character }}
    </div>
  </div>
</template>
