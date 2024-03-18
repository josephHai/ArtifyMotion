<template>
  <div class="pt-5">
    <el-card style="width: 480px" class="m-auto mt-5">
      <el-form
        :model="form"
        :rules="rules"
        ref="accountFormRef"
        label-width="auto"
        style="max-width: 600px"
        label-position="top"
      >
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="form.email"
            placeholder="Please input email"
            clearable
          />
        </el-form-item>
        <el-form-item label="Password" prop="password">
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
            >Sign in</el-button
          >
        </el-form-item>
        <el-form-item>
          <div class="text-secondary">
            Don't have an account?
            <span
              class="text-decoration-underline fw-bolder pointer"
              @click="navigateTo('register', '')"
              >Sign up</span
            >
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { navigateTo } from '@/utils/common'

interface AccountForm {
  email: string
  password: string
}

const accountFormRef = ref<FormInstance>()
const form = reactive<AccountForm>({
  email: '',
  password: '',
})

const rules = reactive<FormRules<AccountForm>>({
  email: [{ required: true, message: 'Please input Email', trigger: 'blur' }],
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
