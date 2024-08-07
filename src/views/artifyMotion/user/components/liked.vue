<template>
  <div>
    <el-row justify="between" :gutter="8">
      <el-col class="cursor-pointer" v-for="i in 8" :key="i" :span="6">
        <el-image
          :key="i"
          class="absolute w-full rounded-xl"
          src="https://media.tenor.com/kH2Q1iCaWVoAAAAM/burger-king-tiny-hands.gif"
        >
          <template #placeholder>
            <div class="w-full h-full image-loading-bg"></div>
          </template>
          <template #error>
            <div class="w-full h-full image-loading-bg"></div>
          </template>
        </el-image>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less"></style>
