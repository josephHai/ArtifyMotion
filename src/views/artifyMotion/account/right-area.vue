<template>
  <div class="w-full h-full container">
    <div class="relative w-6 h-6 rounded-full top-1/4 -left-3 circle-tl" />
    <div class="relative left-1/4 top-12 w-24 h-24 bg-transparent ring-tm">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 inner-ring"
      />
    </div>
    <div
      class="absolute -right-10 bottom-1/4 w-56 h-56 rounded-full circle-br"
    />
    <div
      class="absolute right-1/4 bottom-24 w-52 h-52 rounded-full circle-bm"
    />
    <div
      class="absolute right-1/4 bottom-24 w-3 h-3 rounded-full circle-bm-sm"
    />
  </div>
</template>
<script lang="ts" setup>
defineComponent({
  name: 'RightArea',
})
</script>
<style lang="less">
.container {
  background: linear-gradient(
    135deg,
    rgba(68, 76, 0, 0.38) 0%,
    rgba(18, 18, 18, 0.56) 100%
  );
  backdrop-filter: blur(22px);

  .circle-tl {
    background: linear-gradient(196deg, #ecff57 0%, #b5ff21 100%);
  }

  .ring-tm {
    background: linear-gradient(
      231deg,
      rgba(227, 255, 91, 0),
      rgba(194, 255, 46, 1)
    );
    border-radius: 50%;
    opacity: 0.73;
    border-image: linear-gradient(
        231deg,
        rgba(227, 255, 91, 0),
        rgba(194, 255, 46, 1)
      )
      20 20;

    .inner-ring {
      background: rgba(39, 42, 14, 1);
      border-radius: 50%;
    }
  }

  .circle-br {
    background: linear-gradient(
      135deg,
      rgba(18, 18, 18, 0.56) 0%,
      rgba(135, 145, 42, 0.8) 100%
    );
    backdrop-filter: blur(22px);
  }

  .circle-bm {
    background: #548f35;
    opacity: 0.8;
    filter: blur(100px);
  }

  .circle-bm-sm {
    background: linear-gradient(
      196deg,
      rgba(236, 255, 87, 0.19) 0%,
      #b5ff21 100%
    );
    opacity: 0.64;
  }
}
</style>
