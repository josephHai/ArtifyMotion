<template>
  <div class="c-modal" v-if="props.modelValue">
    <div
      class="c-modal-body c-bg-secondary pt-4 rounded-3 shadow px-3"
      :style="{ width: props.width }"
      v-click-outside="onClickOutside"
    >
      <slot name="title"></slot>
      <slot name="body"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClickOutside as vClickOutside } from 'element-plus'

defineComponent({
  name: 'CModal',
})

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  lock: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '50%',
  },
})

const emits = defineEmits(['update:modelValue'])

const onClickOutside = () => {
  if (props.modelValue && !props.lock) {
    emits('update:modelValue', false)
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === true) {
      document.body.classList.add('c-modal-open')
    } else {
      document.body.classList.remove('c-modal-open')
    }
  }
)
</script>

<style scoped lang="less">
.c-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
}
.c-modal-body {
  position: relative;
  margin: 40vh auto;
  min-height: 150px;
}
</style>
<style lang="less">
.c-modal-open {
  overflow: hidden;
}
</style>
