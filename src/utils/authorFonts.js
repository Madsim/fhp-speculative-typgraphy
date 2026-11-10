import handwritingFonts from '../constants/handwritingFonts'

import articleAuthors from '../../data/genesis.authors.json'
import talk from '../../data/genesis.talk.json'

const names = [
  ...talk.sections.flatMap(({ comments }) => comments.map(({ author }) => author)),
  ...Object.values(articleAuthors).flatMap(segments => segments.map(({ author }) => author))
]

// Sorted so the assignment is stable; each author gets a unique font, none are shared.
const sorted = [...new Set(names.filter(Boolean))].sort((a, b) => a.localeCompare(b))

export const authorFonts = Object.fromEntries(
  sorted.slice(0, handwritingFonts.length).map((author, index) => [author, handwritingFonts[index].family])
)

export const unassignedAuthors = sorted.slice(handwritingFonts.length)
