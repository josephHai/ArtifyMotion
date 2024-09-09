<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="accountFormRef"
      label-width="auto"
    >
      <el-form-item prop="emailCode">
        <template #label>
          <span class="text-white font-bold mr-12">Email Code</span>
        </template>
        <el-input
          class="h-12"
          v-model="form.emailCode"
          placeholder="Please input auth code"
        >
          <template #prefix>
            <div
              class="rounded-3xl flex justify-center items-center w-56 font-bold"
              style="color: #e6ff21"
            >
              Email: {{ userStore.info.email }} |
            </div>
          </template>
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { sendEmailCode, changePassword } from '@/api/mgr/user'
import { useUserStore } from '@/stores'

interface AccountForm {
  emailCode: string
  password: string
}

const accountFormRef = ref<FormInstance>()
const form = reactive<AccountForm>({
  emailCode: '',
  password: '',
})

const userStore = useUserStore()

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
  emailCode: [
    { required: true, message: 'Please input auth code', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
  ],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await changePassword(form)
      ElMessage.success('Password changed successfully! Please login again.')
      userStore.logout()
    } else {
      console.log('error submit', fields)
    }
  })
}

const onSendEmailCode = async () => {
  try {
    await sendEmailCode(userStore.info.email)
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
  outline: none;
  :deep(input) {
    outline: none !important;
  }
}
.change-btn {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
.auth-btn {
  background: linear-gradient(90deg, #faffab 0%, #e7ff24 100%);
}
</style>
