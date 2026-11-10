import { ANNOTATED_ARTICLE, wordAnchors } from '../data/anchors'
import contexts from '../data/contexts'
import sources from '../data/sources'
import wordHistories from '../data/wordHistories'
import validateData from '../utils/validateData'

validateData({
  sources, wordHistories, contexts, wordAnchors
})

const normalize = text => text.replace(/\s+/g, ' ')

// Provider interface: any provider returns { anchors, contexts, entries, sources } for an article.
// Annotations apply only to the revision they were written against, so a changed article never
// receives old annotations silently.
const curatedProvider = {
  name: 'Curated prototype dataset',
  getAnnotations: article => {
    const matches = article.title === ANNOTATED_ARTICLE.title && article.revision === ANNOTATED_ARTICLE.revision
    const stale = article.title === ANNOTATED_ARTICLE.title && !matches

    if (!matches) {
      return {
        anchors: [], contexts: [], entries: wordHistories, sources, stale, annotatedRevision: ANNOTATED_ARTICLE.revision
      }
    }

    const found = contexts
      .map(context => ({ ...context, blockId: article.blocks.find(block => block.tag === 'p' && normalize(block.text).includes(context.blockIncludes))?.id }))
      .filter(context => context.blockId)

    return {
      anchors: wordAnchors,
      contexts: found,
      entries: wordHistories,
      sources,
      stale: false,
      annotatedRevision: ANNOTATED_ARTICLE.revision
    }
  }
}

export default curatedProvider
