<template>
  <div class="w-75 m-auto">
    <el-row>
      <el-col :span="12">
        <el-card class="py-4 border-0 card-left">
          <el-row class="align-items-center pointer text-white" @click="goBack">
            <el-icon :size="24">
              <i-ep-arrow-left />
            </el-icon>
            <el-text class="text-white fw-bold mx-1">Back</el-text>
          </el-row>
          <el-row
            class="mt-3 align-items-center text-white bg-black"
            justify="space-between"
          >
            <el-col :span="3">
              <el-image class="rounded-1" fit="fill" :src="sourceUrl" />
            </el-col>
            <el-col :span="18">
              <el-text
                truncated
                class="text-white fw-semibold"
                style="font-size: 0.6rem"
              >
                {{ imageName }}
              </el-text>
            </el-col>
            <el-col :span="2" class="text-center"
              ><el-icon :size="20"><i-ep-picture-filled /></el-icon
            ></el-col>
          </el-row>
          <el-row>
            <el-image class="w-100" :src="sourceUrl" />
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="py-4 border-0 card-right">
          <el-row>
            <el-text class="fw-bold text-white" size="large">Add Info</el-text>
          </el-row>
          <el-row class="mt-4 align-items-center">
            <el-icon class="c-text-gray"><i-ep-lock /></el-icon>
            <el-text class="mx-1 c-text-gray" size="small">Visibility</el-text>
          </el-row>
          <el-row class="mt-3">
            <el-col :span="8">
              <btn-switch :on="visibility" @click="visibility = !visibility" />
            </el-col>
          </el-row>
          <el-row class="mt-4" :gutter="20">
            <el-col :span="1"
              ><el-icon class="c-text-gray"><i-ep-collection-tag /></el-icon
            ></el-col>
            <el-col :span="10">
              <el-text class="fw-bold c-text-gray">Add Tags</el-text>
            </el-col>
          </el-row>
          <el-row class="mt-3">
            <el-input v-model="tag" class="tags-box">
              <template #append>
                <el-button @click="addTag">
                  <el-icon color="white">
                    <i-ep-plus />
                  </el-icon>
                </el-button>
              </template>
            </el-input>
            <el-row>
              <el-tag
                v-for="tag in tags"
                :key="tag"
                class="my-3 tag-box px-3"
                closable
                @close="handleClose"
                size="large"
                round
              >
                {{ tag }}
              </el-tag>
            </el-row>
            <el-row>
              <el-text
                class="mt-2 w-75 c-text-gray"
                style="font-size: 0.8rem; word-break: keep-all"
              >
                Tags help find your content later. Separate with commas to add
                multiple tags.
              </el-text>
            </el-row>
          </el-row>
          <el-row class="mt-4" :gutter="20">
            <el-col :span="1">
              <el-icon class="c-text-gray">
                <i-ep-football />
              </el-icon>
            </el-col>
            <el-col :span="10">
              <el-text class="fw-bold c-text-gray">Source URL</el-text>
            </el-col>
          </el-row>
          <el-input v-model="imageName" class="mt-3" maxlength="30">
            <template #prefix>
              <el-icon>
                <i-ep-picture-filled />
              </el-icon>
            </template>
          </el-input>
          <el-row class="mt-5">
            <el-button
              class="w-100 text-white c-btn-bg-cold border-0 fw-bolder"
              @click="handleUpload"
            >
              Upload to memefun
            </el-button>
          </el-row>
          <el-row class="mt-1">
            <el-button
              class="w-100 text-white border-0 mt-2 fw-bold"
              style="background: rgba(33, 33, 33, 1)"
              >Download</el-button
            >
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import BtnSwitch from '@/components/btn-switch.vue'
import router from '@/router'
import { useUploadFileStore } from '@/stores'
import { uploadFile } from '@/api/file'
import { ElMessage } from 'element-plus'

const tag = ref<string>('')
const tags = ref<string[]>([])
const sourceUrl = ref()
const imageName = ref()
const visibility = ref(true)
const uploadFileStore = useUploadFileStore()

const goBack = () => {
  router.back()
}

const addTag = () => {
  if (tag.value !== '') {
    tag.value = tag.value.replace('#', '')
    if (tags.value.indexOf('#' + tag.value) == -1)
      tags.value?.push('#' + tag.value)
  }
  tag.value = ''
}

const handleClose = (tag: string) => {
  tags.value.splice(tags.value.indexOf(tag), 1)
}

const handleUpload = () => {
  const formData = new FormData()

  formData.append(
    'file',
    uploadFileStore.url ? uploadFileStore.file : uploadFileStore.file['raw']
  )
  formData.append('accessPermission', visibility ? 'public' : 'private')
  formData.append('tags', tags.value.join(''))

  uploadFile(formData)
    .then((res) => {
      ElMessage({
        message: res['message'],
        type: 'success',
        duration: 5 * 1000,
      })
      goBack()
    })
    .catch((e) => {
      console.log(e)
    })
}

onMounted(() => {
  imageName.value =
    uploadFileStore.url === '' ? uploadFileStore.file.name : uploadFileStore.url
  sourceUrl.value =
    uploadFileStore.url === '' ? uploadFileStore.localUrl : uploadFileStore.url
})
</script>

<style scoped lang="less">
@card-min-height: 800px;

.card-left {
  background: rgba(18, 18, 18, 1);
  min-height: @card-min-height;
}
.card-right {
  background: rgba(33, 33, 33, 1);
  min-height: @card-min-height;
}
.c-text-gray {
  color: rgba(166, 166, 166, 1);
}
.tags-box {
  :deep(.el-input-group__append) {
    height: 40px;
    cursor: pointer;
    border-radius: 0 5px 5px 0;
    background: linear-gradient(
      45deg,
      var(--c-gradient-btn-bg-warm-start),
      var(--c-gradient-btn-bg-warm-end)
    );
  }
}

.tag-box {
  color: white;
  margin-left: 2px;
  background: #0c0a0a;
  border: 0;
  :deep(.el-tag__close) {
    color: white;
  }
}
</style>
