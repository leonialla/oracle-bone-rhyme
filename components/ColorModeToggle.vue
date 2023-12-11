<template>
  <button
    op="hover:85"
    rounded p-2
    text="dark:gray-200"
    @click="toggleColorMode($event)"
  >
    <div i="carbon-sun dark:carbon-moon" text="2xl" />
  </button>
</template>
