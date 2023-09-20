<template>
  <div>
    <div
      class="btn-switch-box row justify-content-center text-center rounded-5 mx-0"
    >
      <div
        :class="[
          { 'on-box c-btn-bg-warm': props.on },
          { 'off-box c-btn-bg-cold': !props.on },
        ]"
      ></div>
      <div
        class="col-6 rounded-5 py-2 font-style"
        :class="{ 'text-black': props.on }"
      >
        Public
      </div>
      <div
        class="col-6 rounded-5 py-2 font-style"
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
  border-radius: inherit;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0s;
  width: 50%;
}
.off-box {
  border-radius: inherit;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0s;
  width: 50%;
  transform: translate3d(100%, 0, 0);
}
.font-style {
  font-size: 0.6rem;
  font-weight: bold;
  pointer-events: none;
  position: relative;
  text-align: center;
  text-shadow: rgba(0, 0, 0, 0.25) 0 2px 5px;
  transition: color 0.3s ease-out 0s;
}
.tips {
  font-size: 0.6rem;
  color: rgba(166, 166, 166, 1);
  width: 200px;
}
</style>
