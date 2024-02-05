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
    </div>
  </header>
  <main pt="10" flex="~" justify="center">
    <img src="/foo.png" border="~ base">
  </main>
</template>
