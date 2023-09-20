<template>
  <div>
    <router-view :key="key" />
    <el-divider />
    <div class="footer">©2023 memefun.xyz</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { isMobile, watchResize } from '@bassist/utils'

const route = useRoute()
const key = computed(() => `${String(route.name || route.path)}-${new Date()}`)

watchResize(() => {
  document.body.className = `platform-${isMobile() ? 'mobile' : 'desktop'}`
})
</script>

<style scoped>
.footer {
  text-align: center;
  height: 30px;
  line-height: 10px;
  color: var(--c-text);
  font-size: 14px;
}
</style>
