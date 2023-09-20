import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由配置
 * @description 所有路由都在这里集中管理
 */
const routes: RouteRecordRaw[] = [
  /**
   * 首页
   */
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home.vue'),
    meta: {
      title: 'Home',
    },
  },
  {
    path: '/',
    name: 'ArtifyMotion',
    component: () => import('@/views/artifyMotion/index.vue'),
    children: [
      {
        path: '',
        name: 'list',
        component: () => import('@/views/artifyMotion/list.vue'),
      },
      {
        path: 'upload',
        component: () => import('@/views/artifyMotion/upload/index.vue'),
        children: [
          {
            path: '',
            name: 'upload',
            component: () => import('@/views/artifyMotion/upload/upload.vue'),
          },
          {
            path: 'finalize',
            name: 'finalize',
            component: () => import('@/views/artifyMotion/upload/finalize.vue'),
          },
        ],
      },
      {
        path: 'create/replace/:id',
        name: 'replace',
        component: () => import('@/views/artifyMotion/creation.vue'),
      },
      {
        path: 'create/edit/:id',
        name: 'edit',
        component: () => import('@/views/artifyMotion/edit.vue'),
      },
    ],
  },
]

export default routes
