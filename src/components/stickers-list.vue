<template>
  <div>
    <div class="rounded-1">
      <el-scrollbar height="330px" class="c-bg-block">
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
              >
                <template #placeholder>
                  <local-loading class="animate-spin" width="18" />
                </template>
                <template #error>
                  <div class="flex justify-center items-center">
                    <el-icon size="24" color="gray">
                      <i-ep-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </el-row>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocalLoading } from '@/assets/icon'

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
