<template>
  <div>
    <div class="rounded-1">
      <el-scrollbar height="360px" class="c-bg-block">
        <el-row :gutter="20" class="px-3">
          <el-col
            :span="6"
            v-for="sticker in stickers"
            :key="sticker.fid"
            class="mt-3"
          >
            <el-row>
              <el-image
                fit="contain"
                style="width: 100px; height: 100px"
                class="pointer"
                :src="sticker.media.src.url"
                @click="handleStickerSelect"
              />
            </el-row>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
defineComponent({
  name: 'StickersList',
})

defineProps({
  stickers: {
    type: Array<Object>,
    default: [],
  },
})

const emit = defineEmits(['select'])

const handleStickerSelect = (event) => {
  emit('select', event)
}

onMounted(() => {})
</script>

<style scoped lang="less"></style>
