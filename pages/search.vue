<script setup lang="ts">
const classIds = ref<string[]>([])
const searchKeyword = ref<string>()
const isKeywordValid = computed(
  () => !searchKeyword.value || (searchKeyword.value.length === 1 && /^[\u4E00-\u9FA5]$/.test(searchKeyword.value)),
)

async function search() {
  if (!searchKeyword.value || !isKeywordValid.value)
    return

  classIds.value = await $fetch('/api/search', {
    query: {
      keyword: searchKeyword.value,
    },
  })
}

function reset() {
  searchKeyword.value = ''
  classIds.value = []
}
</script>

<template>
  <div>
    <section>
      <div flex="~" justify="start" items="center">
        <div flex="~" justify="center" items="center" gap="4" px="2" py="1" border="~ base" rounded>
          <div i-carbon-search-advanced text="3xl" />
          字形检索
        </div>
      </div>
    </section>

    <br>

    <section border="~ base" rounded p="4" flex="~ col" gap="5">
      <div grid="~ cols-[15fr_1fr]" gap="2">
        <input
          v-model="searchKeyword" type="text"
          placeholder="在此处键入简/繁体汉字进行搜索"
          text="placeholder:sm" border="~ base focus:lighter" p="2" outline="none"
          rounded
          bg="transparent"
        >
        <div flex="~" justify="start" items="center" gap="2" text="3xl">
          <button border="~ base" bg="base hover:active" p="1" rounded text="active:green-5" @click="search">
            <div i-carbon-search />
          </button>
          <button border="~ base" bg="base hover:active" p="1" rounded text="active:red-5" @click="reset">
            <div i-carbon-reset />
          </button>
        </div>
      </div>

      <div
        v-if="!isKeywordValid"
        bg="red-5/10" border="~ red-5" text="red-5"
        p="2" rounded
        flex="~" justify="start" items="center" gap="2"
      >
        <div i-carbon-ai-status-failed text="2xl" />
        <div text="sm">
          系统仅支持检索单个简体/繁体汉字，请检查您的输入后再试。
        </div>
      </div>

      <div v-if="classIds.length" border="~ base" rounded p="4" flex="~ wrap" gap="5">
        <div v-for="(classId, idx) in classIds" :key="idx" flex="~ col" items="center" gap="1" border="~ base" rounded overflow="hidden">
          <img :src="`/HWOBC/${classId}.png`" w="20" h="20">
          <span text="base sm">{{ classId }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
