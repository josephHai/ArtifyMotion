<template>
  <div id="register-form" class="w-full h-screen flex items-center">
    <div class="w-2/3">
      <div class="w-full flex flex-col items-center">
        <div>
          <icon-logo :width="300" />
        </div>
        <div class="w-1/3 mt-10">
          <el-form
            :model="form"
            :rules="rules"
            ref="accountFormRef"
            label-width="auto"
            label-position="top"
          >
            <el-form-item prop="username">
              <el-input
                class="h-12"
                v-model="form.username"
                placeholder="Username"
                clearable
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                class="h-12"
                v-model="form.password"
                type="password"
                placeholder="Password"
                clearable
              />
            </el-form-item>
            <el-form-item prop="email">
              <el-input
                class="h-12"
                v-model="form.email"
                placeholder="Email"
                clearable
              />
            </el-form-item>
            <el-form-item prop="address">
              <el-input
                class="h-12"
                v-model="form.address"
                placeholder="Address"
              />
            </el-form-item>
            <el-form-item prop="emailCode">
              <el-input
                class="h-12"
                v-model="form.emailCode"
                placeholder="EmailCode"
              >
                <template #suffix>
                  <div
                    v-show="!isCount"
                    class="rounded-3xl flex justify-center items-center w-16 h-10 text-black font-bold auth-btn"
                    @click="acquire"
                  >
                    Auth
                  </div>
                  <div v-show="isCount">{{ countTime }}</div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div
                class="w-full h-12 flex justify-center items-center rounded-3xl opacity-60 cursor-pointer font-bold sign-in-btn"
                @click="onSubmit(accountFormRef)"
              >
                Sign up
              </div>
            </el-form-item>
          </el-form>
          <div class="text-center text-xs" style="color: #e6ff21">
            Already have an account?&nbsp;&nbsp;
            <span
              class="underline font-bold cursor-pointer"
              @click="navigateTo('login')"
              >Sign in</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/3 h-screen overflow-x-hidden pl-3">
      <right-area />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { navigateTo } from '@/utils/common'
import { IconLogo } from '@/assets/icon'
import rightArea from './right-area.vue'

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
  profile: {},
  email: '',
  address: '',
  emailCode: '',
})

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

<style scoped lang="less">
:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border-radius: 36px;
  color: white;
  outline: none;
  :deep(input) {
    outline: none !important;
  }
}
.sign-in-btn {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
.auth-btn {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
</style>
