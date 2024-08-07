<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="accountFormRef"
      label-width="auto"
    >
      <el-form-item prop="password">
        <template #label>
          <span class="text-white font-bold mr-12">New Password</span>
        </template>
        <el-input
          class="h-10"
          v-model="form.password"
          type="password"
          placeholder="Please input password"
          clearable
          show-password
        />
      </el-form-item>
      <el-form-item>
        <template #label>
          <span class="mr-12"></span>
        </template>
        <div
          class="w-full h-10 flex justify-center items-center rounded-3xl opacity-60 cursor-pointer font-bold change-btn"
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
  password: string
}

const accountFormRef = ref<FormInstance>()
const form = reactive<AccountForm>({
  password: '',
})

const rules = reactive<FormRules<AccountForm>>({
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
  ],
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
.change-btn {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
</style>
