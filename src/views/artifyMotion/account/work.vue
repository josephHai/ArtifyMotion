<template>
  <div>
    <el-row :gutter="10">
      <el-col v-for="i in 4" :key="i" :span="8" class="image-container pointer">
        <el-image
          class="w-100"
          fit="fill"
          src="https://media.tenor.com/kH2Q1iCaWVoAAAAM/burger-king-tiny-hands.gif"
          alt="Error"
        />
        <div class="overlay text-center">
          <el-row :gutter="40" style="z-index: 100">
            <el-col :span="6">
              <el-tooltip
                effect="dark"
                content="Delete"
                placement="top"
                :show-arrow="false"
                :offset="2"
              >
                <el-icon size="large" color="white" class="pointer">
                  <i-ep-delete />
                </el-icon>
              </el-tooltip>
            </el-col>
            <el-col :span="6">
              <el-tooltip
                effect="dark"
                content="Download"
                placement="top"
                :show-arrow="false"
                :offset="2"
              >
                <el-icon size="large" color="white" class="pointer">
                  <i-ep-download />
                </el-icon>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.image-container {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container:hover .overlay {
  opacity: 1;
}
</style>
