<template>
  <div>
    <div
      class="flex overflow-hidden text-white bg-black text-center rounded-3xl mx-0 relative cursor-pointer"
    >
      <div
        :class="[{ 'on-box': props.on }, { 'off-box': !props.on }]"
        class="h-full w-1/2 left-0 top-0 rounded-3xl absolute"
      ></div>
      <div
        class="basis-1/2 py-2 text-sm font-bold relative text-center font-style"
        :class="{ 'text-black': props.on }"
      >
        Public
      </div>
      <div
        class="basis-1/2 py-2 text-sm font-bold relative text-center font-style"
        :class="{ 'text-black': !props.on }"
      >
        Private
      </div>
    </div>
    <div class="tips mt-2">
      <span v-if="props.on">Anyone can see this.</span>
      <span v-else>Only you can see this.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  on: Boolean,
})
</script>

<style scoped lang="less">
.btn-switch-box {
  background-color: black;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  color: white;
}
.on-box {
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0s;
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
.off-box {
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0s;
  transform: translate3d(100%, 0, 0);
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
.font-style {
  pointer-events: none;
  text-shadow: rgba(0, 0, 0, 0.25) 0 2px 5px;
  transition: color 0.3s ease-out 0s;
}
.tips {
  font-size: 0.6rem;
  color: rgba(166, 166, 166, 1);
  width: 200px;
}
</style>
