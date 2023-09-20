<template>
  <loading
    class="rotate-icon"
    :style="{ width: props.width + 'px', height: props.width + 'px' }"
  />
</template>

<script setup lang="ts">
import { loading } from '@/assets/icon'

defineComponent({
  name: 'IconLoading',
})

const props = defineProps({
  width: {
    type: String,
    default: '30',
  },
})
</script>

<style scoped lang="less">
.rotate-icon {
  position: relative;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  /* 定义旋转动画序列 */
  0% {
    transform: rotate(0deg); /* 初始角度为0度 */
  }
  100% {
    transform: rotate(360deg); /* 最终角度为360度，一圈 */
  }
}
</style>
