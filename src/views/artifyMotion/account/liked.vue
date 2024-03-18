<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-row>
          <el-image
            class="w-100"
            fit="cover"
            src="https://media.tenor.com/jZAP6rQEzGYAAAAM/shakespeare.gif"
            alt="Error"
          />
        </el-row>
        <el-row class="mt-2">
          <el-col :span="12">
            <div class="align-items-center" style="display: flex">
              <el-avatar
                :size="24"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              />
              <span class="mx-1 fw-bolder">ct Hai</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div
              class="align-items-center justify-content-end"
              style="display: flex"
            >
              <el-icon size="14"><Coin /></el-icon
              ><span class="mx-1" style="font-size: 14px">20</span>
              <el-icon size="14"><View /></el-icon
              ><span style="font-size: 14px">12.1k</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Coin, View } from '@element-plus/icons-vue'
</script>

<style scoped lang="less"></style>
