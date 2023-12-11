<template>
  <nav py="2" flex="~" justify="between" items="center" border="b base">
    <div flex="~" justify="center" items="center" gap="4">
      <NuxtLink to="/">
        <div i="carbon-translate" text="3xl" />
      </NuxtLink>
      <div text="2xl dark:gray-200" tracking="wider">
        探索三千年的甲骨气韵
      </div>
    </div>
    <div flex="~" justify="center" items="center">
      <div flex="~" justify="center" items="center" gap="4" mr="8">
        <button border="~ base" bg="hover:active" rounded text="sm" px="2" py="1">
          <NuxtLink to="/" flex="~" items="center" gap="2">
            <div i="carbon-text-font" text="2xl" />
            <div>
              单字识别
            </div>
          </NuxtLink>
        </button>
        <button border="~ base" bg="hover:active" rounded text="sm" px="2" py="1">
          <NuxtLink to="/detection" flex="~" items="center" gap="2">
            <div i="carbon-document" text="2xl" />
            <div>
              整页/拓片检测
            </div>
          </NuxtLink>
        </button>
      </div>
      <ColorModeToggle />
    </div>
  </nav>
</template>
