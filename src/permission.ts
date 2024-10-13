import router from './router'
import progress from '@bassist/progress'
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

const whiteList = ['/', '/login', '/register', '/upload/creation', 'creation'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  progress.start()

  // set page title
  document.title = getPageTitle(to.meta.title as string)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login' || to.path === '/register') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      progress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      next()
    }
  } else {
    /* has no token*/

    if (
      whiteList.indexOf(to.name as string) !== -1 ||
      whiteList.indexOf(to.path) !== -1
    ) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      progress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  progress.done()
})
