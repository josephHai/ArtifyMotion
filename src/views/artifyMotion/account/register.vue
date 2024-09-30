<template>
  <div id="register-form" class="w-full h-screen flex items-center">
    <div class="w-2/3">
      <div class="w-full flex flex-col items-center">
        <div class="cursor-pointer" @click="router.push('/')">
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
            <el-form-item prop="confirmPassword">
              <el-input
                class="h-12"
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirm Password"
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
            <el-form-item prop="emailCode">
              <el-input
                class="h-12"
                v-model="form.emailCode"
                placeholder="EmailCode"
              >
                <template #suffix>
                  <div
                    class="rounded-3xl flex justify-center items-center w-36 h-10 text-black font-bold cursor-pointer auth-btn"
                    :class="{ 'opacity-60': isCount }"
                    @click="onSendEmailCode"
                  >
                    <span v-if="!isCount">Get Auth Code</span>
                    <span v-else>Resend in {{ countTime }}s</span>
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div
                class="w-full h-12 flex justify-center items-center rounded-3xl opacity-60 font-bold sign-in-btn"
                :class="
                  registerLoading ? 'cursor-not-allowed' : 'cursor-pointer'
                "
                @click="!registerLoading && onSubmit(accountFormRef)"
              >
                <span v-show="!registerLoading">Sign up</span>
                <div
                  v-show="registerLoading"
                  class="flex justify-center items-center"
                >
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing up...
                </div>
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { navigateTo } from '@/utils/common'
import { IconLogo } from '@/assets/icon'
import rightArea from './right-area.vue'
import { register, sendEmailCode } from '@/api/mgr/user'
import router from '@/router'

interface AccountForm {
  username: string
  password: string
  confirmPassword: string
  email: string
  emailCode: string
}

const accountFormRef = ref<FormInstance>()
const form = reactive<AccountForm>({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  emailCode: '',
})
const registerLoading = ref<boolean>(false)

// 获取验证码计时
const isCount = ref<boolean>(false)
let countTime = ref<number>(0)

const acquire = () => {
  isCount.value = true
  countTime.value = 60
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
  confirmPassword: [
    {
      required: true,
      message: 'Please confirm password',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback('Passwords do not match')
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: 'Please input Email', trigger: 'blur' },
    {
      type: 'email',
      message: 'Please input a valid email address',
      trigger: ['blur', 'change'],
    },
  ],
  emailCode: [
    { required: true, message: 'Please input auth code', trigger: 'blur' },
  ],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      registerLoading.value = true
      try {
        await register(form)
        ElMessage.success('Register success, please sign in')
        navigateTo('login')
      } catch (e) {
        console.log(e)
      } finally {
        registerLoading.value = false
      }
    } else {
      console.log('error submit', fields)
    }
  })
}

const onSendEmailCode = async () => {
  try {
    await sendEmailCode(form.email)
    ElMessage.success('Email code sent, please check your email')
    acquire()
  } catch (e) {
    console.log(e)
  }
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
