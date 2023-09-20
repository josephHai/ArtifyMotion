// import i18n
import { createI18n } from 'vue-i18n'
import en from '@/assets/languages/en.json'
import zh from '@/assets/languages/zh.json'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en,
    zh,
  },
})

export default i18n
