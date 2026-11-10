import { BASE_LANGUAGE } from '../constants/languages'

// Top of the stack first: original source, then subject languages, modern commentary last.
const buildLayers = (paragraph, translations = [], segments) => [
  ...translations.map(({ language, text }) => ({ id: language, language, text })),
  {
    id: BASE_LANGUAGE,
    language: BASE_LANGUAGE,
    text: paragraph.text,
    segments: segments?.map((segment, index) => ({ ...segment, key: `${segment.author}-${index}` }))
  }
]

export default buildLayers
