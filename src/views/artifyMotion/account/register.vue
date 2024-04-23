<template>
  <div class="pt-5">
    <el-card style="width: 480px" class="m-auto mt-5">
      <div class="h4 fw-bolder mt-3 mb-5">Sign up to memefun</div>
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
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Please input password"
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
        <el-form-item label="Address" prop="address">
          <el-input v-model="form.address" placeholder="Please input address" />
        </el-form-item>
        <el-form-item label="EmailCode" prop="emailCode">
          <el-input
            v-model="form.emailCode"
            placeholder="Please input emailCode"
            style="width: 320px"
          ></el-input>
          <el-button v-show="!isCount" @click="acquire" style="width: 100px"
            >auth</el-button
          >
          <el-button v-show="isCount" style="width: 100px" disabled
            >{{ countTime }}s</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            class="m-auto"
            style="width: 480px"
            @click="onSubmit(accountFormRef)"
            round
            >Sign up</el-button
          >
        </el-form-item>
        <el-form-item>
          <div class="text-secondary">
            Already have an account?
            <span
              class="text-decoration-underline fw-bolder pointer"
              @click="navigateTo('login', '')"
              >Sign in</span
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
  username: string
  password: string
  profile: object
  email: string
  address: string
  emailCode: string
}

const accountFormRef = ref<FormInstance>()
const form = reactive<AccountForm>({
  username: '',
  password: '',
  profile: undefined,
  email: '',
  address: '',
  emailCode: '',
} as AccountForm)

// 获取验证码计时
const isCount = ref<boolean>(false)
let countTime = ref<number>(0)

const acquire = () => {
  isCount.value = true
  countTime.value = 5
  const countInterval = setInterval(() => {
    countTime.value--
    if (countTime.value <= 0) {
      clearInterval(countInterval)
      isCount.value = false
    }
  }, 1000)
}

const rules = reactive<FormRules<AccountForm>>({
  username: [
    { required: true, message: 'Please input Username', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
  ],
  email: [{ required: true, message: 'Please input Email', trigger: 'blur' }],
  emailCode: [
    { required: true, message: 'Please input auth code', trigger: 'blur' },
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
