import { useMemo, useState } from 'react'

import {
  Box, Button, Container, Link, Stack, Typography, useMediaQuery
} from '@mui/material'

import { AutoStories as RevealIcon } from '@mui/icons-material'

import ArticleSearch from './ArticleSearch'
import ArticleView from './ArticleView'
import ContextDetail from './ContextDetail'
import CoverageNotice from './CoverageNotice'
import DetailPanel from './DetailPanel'
import LayerSelector from './LayerSelector'
import WordDetail from './WordDetail'

import { DEFAULT_LAYER, LAYERS } from '../constants/layers'
import curatedProvider from '../services/curatedProvider'
import { buildArticle, fetchArticle, parseArticleInput } from '../services/wikipedia'

import bundled from '../data/articles/bookOfGenesis.json'

const bundledArticle = buildArticle({ ...bundled, source: 'bundled' })

const App = () => {
  const [article, setArticle] = useState(bundledArticle)
  const [revealed, setRevealed] = useState(false)
  const [layer, setLayer] = useState(DEFAULT_LAYER)
  const [pinned, setPinned] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const annotations = useMemo(() => curatedProvider.getAnnotations(article), [article])
  const layerLabel = LAYERS.find(item => item.id === layer).label

  const handleLoad = async input => {
    const parsed = parseArticleInput(input)
    if (parsed.error) {
      setError(parsed.error)
      return
    }
    setLoading(true)
    setError('')
    try {
      setArticle(await fetchArticle(parsed.title))
      setPinned()
    } catch (loadError) {
      setError(`${loadError.message} The bundled article is still available.`)
    }
    setLoading(false)
  }

  const handleBundled = () => {
    setArticle(bundledArticle)
    setPinned()
    setError('')
  }

  const handleLayer = next => {
    setLayer(next)
    setPinned()
  }

  const handlePinWord = (anchorId, uid) => {
    const anchor = annotations.anchors.find(item => item.id === anchorId)
    setPinned({
      kind: 'word', anchorId, uid, stageId: annotations.entries[anchor.entryId].headline
    })
  }

  const handleOpenContext = context => setPinned({ kind: 'context', contextId: context.id })

  let detail
  let detailTitle = ''
  if (pinned && pinned.kind === 'word') {
    const anchor = annotations.anchors.find(item => item.id === pinned.anchorId)
    const entry = annotations.entries[anchor.entryId]
    detailTitle = anchor.exact
    detail = (
      <WordDetail
        entry={entry}
        sense={entry.senses.find(item => item.id === anchor.senseId)}
        layer={layer}
        sources={annotations.sources}
        stageId={pinned.stageId}
        reducedMotion={reducedMotion}
        onStage={stageId => setPinned({ ...pinned, stageId })}
      />
    )
  }
  if (pinned && pinned.kind === 'context') {
    const context = annotations.contexts.find(item => item.id === pinned.contextId)
    detailTitle = context.title
    detail = (
      <ContextDetail
        context={context}
        passageText={article.blocks.find(block => block.id === context.blockId).text}
        sources={annotations.sources}
      />
    )
  }

  let revealLabel = 'Reveal history'
  if (revealed) revealLabel = 'Hide history'

  let wordPin
  let contextPin
  if (pinned && pinned.kind === 'word') wordPin = pinned
  if (pinned && pinned.kind === 'context') contextPin = pinned.contextId

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <Box
        component="main"
        sx={{ flex: 1, minWidth: 0 }}
      >
        <Container
          maxWidth={false}
          sx={{ maxWidth: 760, py: 4 }}
        >
          <Stack gap={2}>
            <ArticleSearch
              loading={loading}
              error={error}
              onSubmit={handleLoad}
            />
            {
              article.source !== 'bundled'
                && (
                  <Button
                    size="small"
                    sx={{ alignSelf: 'flex-start' }}
                    onClick={handleBundled}
                  >
                    Back to the bundled demonstration article
                  </Button>
                )
            }
          </Stack>

          <Box sx={{ mt: 4, mb: 3 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontFamily: 'var(--font-serif)' }}
            >
              {article.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Original article on Wikipedia
              </Link>
              {` · revision ${article.revision} · text `}
              <Link
                href={article.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {article.license}
              </Link>
              {' · '}
              <Link
                href={article.historyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                authors
              </Link>
              {article.source === 'bundled' && ` · bundled copy, retrieved ${bundled.retrieved}`}
            </Typography>
          </Box>

          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="flex-start"
            gap={3}
            sx={{ mb: 3 }}
          >
            <Button
              size="large"
              variant="contained"
              startIcon={<RevealIcon />}
              aria-pressed={revealed}
              onClick={() => setRevealed(!revealed)}
            >
              {revealLabel}
            </Button>
            <LayerSelector
              value={layer}
              disabled={!revealed}
              onChange={handleLayer}
            />
          </Stack>

          <CoverageNotice
            article={article}
            annotations={annotations}
            revealed={revealed}
          />

          <ArticleView
            blocks={article.blocks}
            anchors={annotations.anchors}
            contexts={annotations.contexts}
            entries={annotations.entries}
            sources={annotations.sources}
            revealed={revealed}
            layer={layer}
            pinned={wordPin}
            pinnedContextId={contextPin}
            reducedMotion={reducedMotion}
            onPinWord={handlePinWord}
            onOpenContext={handleOpenContext}
          />
        </Container>
      </Box>

      {
        detail
          && (
            <DetailPanel
              title={detailTitle}
              layerLabel={layerLabel}
              onClose={() => setPinned()}
            >
              {detail}
            </DetailPanel>
          )
      }
    </Box>
  )
}

export default App
