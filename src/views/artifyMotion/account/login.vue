<template>
  <div id="login-form" class="w-full h-screen flex items-center">
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
            <el-form-item prop="email">
              <el-input
                class="h-12"
                v-model="form.email"
                placeholder="Email Address"
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
                show-password
              />
            </el-form-item>
            <el-form-item>
              <div
                class="w-full h-12 flex justify-center items-center rounded-3xl opacity-60 cursor-pointer font-bold sign-in-btn"
                @click="onSubmit(accountFormRef)"
              >
                Sign in
              </div>
            </el-form-item>
          </el-form>
          <div class="text-center text-xs" style="color: #e6ff21">
            Don't have an account?&nbsp;&nbsp;
            <span
              class="underline font-bold cursor-pointer"
              @click="navigateTo('register')"
              >Sign up</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/3 h-screen overflow-x-hidden pl-3">
      <right-area />
    </div>
  </div>
  <div
    id="code-verify"
    v-if="false"
    class="w-full h-screen flex items-center justify-center"
  >
    <div class="w-1/4 text-center">
      <div class="text-white text-3xl font-bold">Check your Email!</div>
      <div class="text-white mt-5">
        We have sent an email to
        <span class="text-sm" style="color: #e6ff21">123321123@163.com</span
        >.<br />
        Please click the link in the email to verify your account or enter the
        email activation code below.
      </div>
      <input
        v-for="(code, index) in codes"
        ref="codeInput"
        :key="index"
        type="text"
        maxlength="1"
        class="w-10 h-12 text-2xl text-center m-1 border-none rounded-lg outline-none"
        v-model="codes[index]"
        @input="moveToNext(index)"
        @keydown.self="moveToPrevious($event, index)"
      />
      <div class="mt-3 text-gray-500 text-sm">
        Didn't reveive an email? Check your spam folder!<br />
        Email may take a couple minutes to arrive.
      </div>
      <div class="mt-3 text-white text-sm">
        Already validated your account?!
      </div>
      <div class="mt-5 font-bold text-sm cursor-pointer" style="color: #e6ff21">
        Go to Log In
      </div>
      <div
        class="w-full h-12 mt-3 flex justify-center items-center opacity-60 rounded-3xl font-bold cursor-pointer submit-btn"
      >
        Submit
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { navigateTo } from '@/utils/common'
import { IconLogo } from '@/assets/icon'
import RightArea from './right-area.vue'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

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
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const userStore = useUserStore()
      try {
        await userStore.login(form.email, form.password)
        ElMessage({
          message: 'Login successful!',
          type: 'success',
        })
        const redirect = (route.query.redirect as string) || '/'
        router.push(redirect)
      } catch (error) {
        return
      }
    } else {
      console.log('error submit', fields)
    }
  })
}

// 验证码
const codes = ref(['', '', '', ''])
const codeInput = ref()

const moveToNext = (index: number) => {
  if (index < codes.value.length - 1) {
    codeInput.value[index + 1]?.focus()
  }
}

const moveToPrevious = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && codes.value[index] === '' && index > 0) {
    codeInput.value[index - 1].focus()
    setTimeout(() => {
      codeInput.value[index - 1].focus()
    }, 0)
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
.submit-btn {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
</style>
