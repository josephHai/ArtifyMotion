<template>
  <div class="c-modal" v-if="modalShow">
    <div class="c-modal-body c-bg-secondary pt-4 rounded-3 shadow">
      <slot name="title"></slot>
      <slot name="body"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineComponent({
  name: 'CModal',
})

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const modalShow = ref(false)

watch(
  () => props.show,
  (newValue) => {
    if (newValue === true) {
      document.body.classList.add('c-modal-open')
    } else {
      document.body.classList.remove('c-modal-open')
    }
    modalShow.value = newValue
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
  max-width: 400px;
  margin: 40vh auto;
  min-height: 150px;
}
</style>
<style lang="less">
.c-modal-open {
  overflow: hidden;
}
</style>
