<template>
  <div class="relative" :style="{ width: width + 'px', height: height + 'px' }">
    <div class="absolute blur-bg top-10"></div>
    <div class="absolute top-3">
      <svg
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- 凹曲线 -->
        <path
          :d="mainCurvePath"
          stroke="#E7FF25"
          stroke-width="2"
          fill="none"
        />

        <!-- 左侧小曲线 -->
        <path
          :d="leftCurvePath"
          stroke="#E7FF25"
          stroke-width="2"
          fill="none"
        />

        <!-- 右侧小曲线 -->
        <path
          :d="rightCurvePath"
          stroke="#E7FF25"
          stroke-width="2"
          fill="none"
        />
      </svg>
    </div>
    <div
      class="absolute w-full text-white text-3xl font-bold text-center"
      :style="customStyle"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  width: {
    type: Number,
    default: 320,
  },
  text: {
    type: String,
    default: '',
  },
  customStyle: {
    type: String,
    default: '',
  },
})

const height = computed(() => props.width / 8)

const mainCurvePath = computed(() => {
  const { width: w } = props
  const h = height.value
  return `M5, ${h / 5} Q${w / 2}, ${h} ${w - 5}, ${h / 5}`
})

const leftCurvePath = computed(() => {
  const h = height.value
  return `M10, 0 Q0, ${h / 5} 5, ${(2 * h) / 5}`
})

const rightCurvePath = computed(() => {
  const { width: w } = props
  const h = height.value
  return `M${w - 10}, 0 Q${w}, ${h / 5} ${w - 5}, ${(2 * h) / 5}`
})
</script>

<style scoped lang="less">
.blur-bg {
  background: #e6ff21;
  opacity: 0.8;
  filter: blur(50px);
  width: 80%;
  height: 50%;
  left: 10%;
}
.text-center {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
