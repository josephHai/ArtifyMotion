<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="accountFormRef"
      label-width="auto"
      style="max-width: 600px"
      label-position="top"
    >
      <el-form-item label="Username" prop="username">
        <el-input
          v-model="form.username"
          placeholder="Please input username"
          clearable
        />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input
          v-model="form.email"
          placeholder="Please input email"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="m-auto"
          style="width: 480px"
          @click="onSubmit(accountFormRef)"
          round
          >Save Change</el-button
        >
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

<style scoped lang="less"></style>
