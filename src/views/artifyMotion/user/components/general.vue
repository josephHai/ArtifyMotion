<template>
  <div class="mt-10">
    <el-form
      :model="form"
      :rules="rules"
      ref="accountFormRef"
      label-width="auto"
    >
      <el-form-item prop="username">
        <template #label>
          <span class="text-white font-bold mr-12">Username</span>
        </template>
        <el-input
          class="h-10"
          v-model="form.username"
          placeholder="Please input username"
          clearable
        />
      </el-form-item>
      <el-form-item prop="email">
        <template #label>
          <span class="text-white font-bold mr-12">Email</span>
        </template>
        <el-input
          class="h-10"
          v-model="form.email"
          placeholder="Please input email"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <template #label>
          <span class="mr-12"></span>
        </template>
        <div
          class="w-full h-10 flex justify-center items-center rounded-3xl opacity-60 cursor-pointer font-bold sign-in-btn"
          @click="onSubmit(accountFormRef)"
        >
          Change
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

interface AccountForm {
  username: string
  email: string
}

const accountFormRef = ref<FormInstance>()
const form = reactive<AccountForm>({
  username: '',
  email: '',
})

const rules = reactive<FormRules<AccountForm>>({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
  ],
  email: [{ required: true, message: 'Please input Email', trigger: 'blur' }],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit', fields)
    }
  })
}
</script>

<style scoped lang="less">
:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border-radius: 36px;
  background: white;
  outline: none;
  :deep(input) {
    outline: none !important;
  }
}
.sign-in-btn {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
</style>
