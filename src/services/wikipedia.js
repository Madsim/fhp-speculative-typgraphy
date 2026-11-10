import extractBlocks from '../utils/extractBlocks'
import sanitizeHtml from '../utils/sanitize'

const API = 'https://en.wikipedia.org/w/api.php'
const URL_PATTERN = /^https:\/\/en\.wikipedia\.org\/wiki\/([^?#]+)(?:[?#].*)?$/
const TITLE_PATTERN = /^[^<>[\]{}|#\\]{1,255}$/

const cache = new Map()

// Only en.wikipedia.org titles and URLs are accepted. Nothing else is ever fetched.
export const parseArticleInput = input => {
  const value = input.trim()
  if (!value) return { error: 'Enter an article title or an en.wikipedia.org link.' }

  let title = value
  const match = value.match(URL_PATTERN)
  if (/^https?:\/\//i.test(value) && !match) {
    return { error: 'Only https://en.wikipedia.org/wiki/… links are supported in this prototype.' }
  }
  if (match) {
    try {
      title = decodeURIComponent(match[1])
    } catch (error) {
      return { error: 'That link could not be read.' }
    }
  }

  title = title.replace(/_/g, ' ').trim()
  if (!TITLE_PATTERN.test(title)) return { error: 'That does not look like an article title.' }
  return { title }
}

export const buildArticle = ({
  title, lang, revision, url, html, source, license, licenseUrl, historyUrl
}) => {
  const clean = sanitizeHtml(html, title)
  return {
    title,
    lang,
    revision,
    url,
    source,
    license,
    licenseUrl,
    historyUrl,
    blocks: extractBlocks(clean)
  }
}

export const fetchArticle = async title => {
  const key = title.toLowerCase()
  if (cache.has(key)) return cache.get(key)

  const params = new URLSearchParams({
    action: 'parse',
    page: title,
    prop: 'text|revid',
    redirects: '1',
    disableeditsection: '1',
    disablelimitreport: '1',
    format: 'json',
    formatversion: '2',
    origin: '*'
  })

  const response = await fetch(`${API}?${params}`)
  if (!response.ok) throw new Error(`Wikipedia answered with status ${response.status}.`)
  const data = await response.json()
  if (data.error) throw new Error(data.error.info ?? 'Wikipedia could not find that article.')

  const { title: resolved, revid, text } = data.parse
  const slug = encodeURIComponent(resolved.replace(/ /g, '_'))
  const article = buildArticle({
    title: resolved,
    lang: 'en',
    revision: revid,
    url: `https://en.wikipedia.org/wiki/${slug}`,
    html: text,
    source: 'wikipedia',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    historyUrl: `https://en.wikipedia.org/w/index.php?title=${slug}&action=history`
  })
  cache.set(key, article)
  return article
}
