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
      <el-form-item label="New Password" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="Please input password"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="m-auto"
          style="width: 480px"
          @click="onSubmit(accountFormRef)"
          round
          >Change</el-button
        >
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

<style scoped lang="less"></style>
