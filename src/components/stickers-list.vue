<template>
  <div>
    <div
      class="rounded-1"
      v-loading="stickerDeleteLoading"
      element-loading-background="rgba(36, 36, 36, 0.8)"
      element-loading-spinner="el-icon-loading"
      element-loading-custom-class="c-fs-loading"
    >
      <el-scrollbar height="330px" class="c-bg-block">
        <el-row :gutter="20" class="px-3">
          <el-col
            :span="6"
            v-for="sticker in stickers"
            :key="sticker.fid"
            class="relative group inline-block mt-3"
          >
            <div>
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
            </div>
            <el-popconfirm
              title="Are you sure to delete this?"
              effect="dark"
              @confirm="handleStickerDelete(sticker.fid)"
            >
              <template #reference>
                <div
                  v-if="userStore.uid === sticker.uploadUserId"
                  class="absolute top-0 right-0 hidden group-hover:flex text-white p-2 rounded-full cursor-pointer hover:text-gray-200"
                  style="pointer-events: auto"
                >
                  <icon-trash class="h-5 w-5" />
                </div>
              </template>
            </el-popconfirm>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocalLoading, IconTrash } from '@/assets/icon'
import { deleteFiles } from '@/api/file'
import { useUserStore } from '@/stores'

defineComponent({
  name: 'StickersList',
})

defineProps({
  stickers: {
    type: Array<Object>,
    default: [],
  },
})

const emit = defineEmits(['select', 'delete'])
const userStore = useUserStore()
const stickerDeleteLoading = ref(false)

const handleStickerSelect = (event) => {
  emit('select', event)
}

const handleStickerDelete = async (fid: number) => {
  stickerDeleteLoading.value = true
  const data = new FormData()
  data.append('fid', String(fid))
  await deleteFiles(data)
  emit('delete', fid)
  stickerDeleteLoading.value = false
}

onMounted(() => {})
</script>

<style scoped lang="less"></style>
