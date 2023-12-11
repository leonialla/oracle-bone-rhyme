<script setup lang="ts">
import { Menu } from 'floating-vue'
import type { DropdownMenuOption } from '~/types/dropdown'

const { options } = defineProps<{
  options: DropdownMenuOption[]
}>()

const selectedOption = ref(options[0])
</script>

<template>
  <Menu
    :distance="8"
    bg="hover:active"
    border="~ base" rounded
    flex="~" justify="center"
    text="sm"
  >
    <button flex="~" justify="center" items="center" w="20" px="2">
      <slot name="default" :selected-option="selectedOption">
        <span>{{ selectedOption.label }}</span>
      </slot>
    </button>
    <template #popper>
      <ul text="sm">
        <li
          v-for="(option, index) in options"
          :key="index"
          bg="hover:gray-2/75"
          duration="300"
          text="center"
        >
          <button px="6" py="2" @click="selectedOption = option">
            {{ option.label }}
          </button>
        </li>
      </ul>
    </template>
  </Menu>
</template>
