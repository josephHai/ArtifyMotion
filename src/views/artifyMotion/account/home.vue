<template>
  <div>
    <el-row justify="center">
      <el-col :span="4">
        <el-avatar
          :size="150"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        />
      </el-col>
      <el-col :span="6">
        <el-row class="mb-4">
          <span class="h2 fw-bold">ct Hai</span>
        </el-row>
        <el-row>
          <el-button @click="navigateTo('profile', '')">Edit Profile</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="mt-5">
      <el-tabs v-model="activeName" class="w-100">
        <el-tab-pane label="Work" name="work">
          <work />
        </el-tab-pane>
        <el-tab-pane label="Liked" name="liked">
          <Liked />
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row style="min-height: 300px">
      <router-view :key="key" />
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Work from '@/views/artifyMotion/account/work.vue'
import Liked from '@/views/artifyMotion/account/liked.vue'
import { navigateTo } from '@/utils/common'

const route = useRoute()
const key = computed(() => `${String(route.name || route.path)}-${new Date()}`)

const activeName = ref('work')
</script>

<style scoped lang="less"></style>
