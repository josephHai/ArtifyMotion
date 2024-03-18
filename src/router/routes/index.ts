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
  /**
   * 用户中心
   */
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/artifyMotion/index.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/artifyMotion/account/login.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/artifyMotion/account/register.vue'),
      },
      {
        path: 'home',
        name: 'userHome',
        component: () => import('@/views/artifyMotion/account/home.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/artifyMotion/account/profile.vue'),
      },
    ],
  },
  {
    path: '/',
    name: '',
    component: () => import('@/views/artifyMotion/index.vue'),
    children: [
      {
        path: '',
        name: 'list',
        component: () => import('@/views/artifyMotion/gallery.vue'),
      },
      {
        path: 'upload/:behavior?',
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
        path: 'creation/:id?',
        name: 'creation',
        component: () => import('@/views/artifyMotion/creation/index.vue'),
      },
    ],
  },
]

export default routes
