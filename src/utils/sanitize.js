import DOMPurify from 'dompurify'

const WIKI = 'https://en.wikipedia.org'

const config = {
  ALLOWED_TAGS: ['div', 'p', 'h2', 'h3', 'a', 'i', 'b', 'em', 'strong', 'sup', 'sub', 'span', 'bdi', 'abbr', 'small', 'cite', 'ul', 'ol', 'li', 'br'],
  ALLOWED_ATTR: ['href', 'lang', 'dir', 'title', 'id'],
  ALLOW_DATA_ATTR: false,
  KEEP_CONTENT: false
}

let hooked = false

const installHooks = pageTitle => {
  if (hooked) return
  hooked = true
  DOMPurify.addHook('afterSanitizeAttributes', node => {
    if (node.tagName !== 'A' || !node.hasAttribute('href')) return
    const href = node.getAttribute('href')
    let absolute = href
    if (href.startsWith('/wiki/')) absolute = `${WIKI}${href}`
    if (href.startsWith('#')) absolute = `${WIKI}/wiki/${encodeURIComponent(DOMPurify.pageTitle ?? pageTitle)}${href}`
    if (!absolute.startsWith('https://')) {
      node.removeAttribute('href')
      return
    }
    node.setAttribute('href', absolute)
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  })
}

// Wikipedia HTML is sanitised here, then split into blocks. Links and citations are kept,
// rewritten to point at the original article.
const sanitizeHtml = (html, pageTitle) => {
  installHooks(pageTitle)
  DOMPurify.pageTitle = pageTitle.replace(/ /g, '_')
  return DOMPurify.sanitize(html, config)
}

export default sanitizeHtml
