import defaultSettinsg from '@/settings'

const title = defaultSettinsg.title || 'Memefun'

export default function getPageTitle(pageTitle: string) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
