<template>
  <div class="w-75 mt-3 m-auto">
    <div style="display: flex" class="align-items-center">
      <el-avatar
        :size="48"
        src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
      />
      <span class="mx-3"><b>ct Hai</b> / <b>Edit Profile</b></span>
    </div>
    <el-row class="mt-5">
      <el-col :span="6">
        <el-tabs tab-position="left" style="height: 200px" v-model="tabName">
          <el-tab-pane label="General"></el-tab-pane>
          <el-tab-pane label="Edit Profile"></el-tab-pane>
          <el-tab-pane label="Password"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="18">
        <General v-if="tabName === '0'" />
        <EditProfile v-if="tabName === '1'" />
        <Password v-if="tabName === '2'" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import General from '@/views/artifyMotion/account/general.vue'
import EditProfile from '@/views/artifyMotion/account/edit-profile.vue'
import Password from '@/views/artifyMotion/account/password.vue'

const tabName = ref<string>('0')
</script>

<style scoped lang="less"></style>
