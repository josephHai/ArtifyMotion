import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import App from '@/App.vue'
import router from '@/router'
import './permission'

// 全局样式
import '@/styles/mixin.less'
import 'element-plus/dist/index.css'
import '@/styles/style.css'
import '@/styles/var.less'
import '@/styles/global.less'

// 国际化
import i18n from '@/plugins/i18n'

import { ObserveVisibility } from 'vue-observe-visibility'

const pinia = createPinia()
// 启用pinia持久化插件
pinia.use(piniaPersistedstate)

createApp(App)
  .use(pinia) // 启用 Pinia
  .use(router)
  .use(i18n)
  .directive('observe-visibility', {
    beforeMount: (el, binding, vnode) => {
      ;(vnode as any).context = binding.instance
      ObserveVisibility.bind(el, binding, vnode)
    },
    updated: ObserveVisibility.update,
    unmounted: ObserveVisibility.unbind,
  })
  .mount('#app')
