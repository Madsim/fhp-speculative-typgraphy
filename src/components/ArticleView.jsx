import {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState
} from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'

import { alpha } from '@mui/material/styles'

import ArticleBlock from './ArticleBlock'
import FormOverlay from './FormOverlay'
import NoAnnotationCard from './NoAnnotationCard'
import WordCard from './WordCard'

import choose from '../utils/choose'
import { getForm } from '../utils/historyHelpers'

const CLOSE_DELAY = 500
const CARD_WIDTH = 350

const findOccurrence = element => {
  if (!element.closest) return undefined
  return element.closest('[data-occ]') ?? element.querySelector('[data-occ]') ?? undefined
}

const measure = (element, container) => {
  const box = element.getBoundingClientRect()
  const base = container.getBoundingClientRect()
  return {
    uid: element.dataset.uid,
    anchorId: element.dataset.occ,
    top: box.top - base.top,
    left: box.left - base.left,
    width: box.width,
    height: box.height,
    fontSize: getComputedStyle(element).fontSize
  }
}

const PALETTE_KEYS = { words: 'primary', writing: 'secondary' }

// The reading column. Hover or focus on an annotated word shows the transformation in place and a
// compact card; selecting pins it. Everything is delegated so the sanitised Wikipedia HTML keeps
// its own links and citations untouched.
const ArticleView = ({
  blocks, anchors, contexts, entries, sources, revealed, layer, pinned, pinnedContextId,
  reducedMotion, onPinWord, onOpenContext
}) => {
  const containerRef = useRef()
  const cardRef = useRef()
  const timer = useRef()
  const [hover, setHover] = useState()
  const [pinnedRect, setPinnedRect] = useState()
  const [fits, setFits] = useState(false)
  const [selection, setSelection] = useState()

  const interactive = revealed && layer !== 'context'
  const anchorsById = useMemo(() => Object.fromEntries(anchors.map(anchor => [anchor.id, anchor])), [anchors])
  const contextByBlock = useMemo(
    () => Object.fromEntries(contexts.map(context => [context.blockId, context])),
    [contexts]
  )

  const cancelClose = useCallback(() => clearTimeout(timer.current), [])
  const scheduleClose = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setHover(undefined), CLOSE_DELAY)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (!interactive) setHover(undefined)
    setSelection(undefined)
  }, [interactive, blocks])

  // Keep the pinned word's position current.
  useLayoutEffect(() => {
    const update = () => {
      if (!pinned || !containerRef.current) {
        setPinnedRect(undefined)
        return
      }
      const element = containerRef.current.querySelector(`[data-uid="${pinned.uid}"]`)
      if (element) setPinnedRect(measure(element, containerRef.current))
      if (!element) setPinnedRect(undefined)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [pinned, layer, revealed, blocks])

  useEffect(() => {
    const onKey = event => {
      if (event.key === 'Escape') {
        setHover(undefined)
        setSelection(undefined)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Return focus to the word when the detail view closes.
  const previousPinned = useRef()
  useEffect(() => {
    const last = previousPinned.current
    previousPinned.current = pinned
    if (pinned || !last || !containerRef.current) return
    containerRef.current.querySelector(`[data-uid="${last.uid}"][tabindex]`)?.focus()
  }, [pinned])

  const overlayRect = hover ?? pinnedRect
  const overlayAnchor = overlayRect && anchorsById[overlayRect.anchorId]
  const overlayEntry = overlayAnchor && entries[overlayAnchor.entryId]

  let overlayStage = overlayEntry && overlayEntry.headline
  if (overlayEntry && pinned && overlayRect.uid === pinned.uid) overlayStage = pinned.stageId
  const overlayForm = overlayEntry && getForm(overlayEntry, overlayStage)
  const showOverlay = Boolean(overlayForm) && overlayStage !== overlayEntry.stages[overlayEntry.stages.length - 1]

  // The modern word stays in place, dimmed while its historical form is shown over it.
  useEffect(() => {
    if (!showOverlay || !fits || !containerRef.current) return undefined
    const element = containerRef.current.querySelector(`[data-uid="${overlayRect.uid}"]`)
    if (!element) return undefined
    element.classList.add('pal-dim')
    return () => element.classList.remove('pal-dim')
  }, [showOverlay, fits, overlayRect?.uid])

  const open = element => {
    cancelClose()
    setSelection(undefined)
    setHover(measure(element, containerRef.current))
  }

  const handleOver = event => {
    if (!interactive) return
    const element = findOccurrence(event.target)
    if (element) open(element)
  }

  const handleOut = event => {
    if (!interactive) return
    if (event.relatedTarget && cardRef.current?.contains(event.relatedTarget)) return
    scheduleClose()
  }

  const handleClick = event => {
    if (!interactive) return
    const element = event.target.closest?.('[data-occ]')
    if (!element) return
    // A word inside a link keeps the link's navigation; only the pin button opens details.
    if (element.dataset.inLink === 'true') return
    if (window.matchMedia('(hover: none)').matches && element.dataset.pin === undefined) {
      open(element)
      return
    }
    onPinWord(element.dataset.occ, element.dataset.uid)
    setHover(undefined)
  }

  const handleKeyDown = event => {
    if (!interactive) return
    const element = event.target.closest?.('[data-occ][role="button"]')
    if (!element || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    onPinWord(element.dataset.occ, element.dataset.uid)
    setHover(undefined)
  }

  // Selecting a word that has no annotation explains why the text stays unchanged.
  const handleSelect = () => {
    if (!interactive) return
    const selected = window.getSelection()
    const text = selected.toString().trim()
    const inAnnotation = selected.anchorNode?.parentElement?.closest('[data-occ]')
    if (!text || text.length > 40 || !/^[\p{L}'’-]+$/u.test(text) || inAnnotation || selected.rangeCount === 0) {
      setSelection(undefined)
      return
    }
    const box = selected.getRangeAt(0).getBoundingClientRect()
    const base = containerRef.current.getBoundingClientRect()
    setSelection({ word: text, top: box.bottom - base.top + 8, left: Math.max(box.left - base.left, 0) })
  }

  const cardPosition = rect => {
    const width = containerRef.current?.clientWidth ?? CARD_WIDTH
    return {
      top: rect.top + rect.height + 8,
      left: Math.min(Math.max(rect.left - 20, 0), Math.max(width - CARD_WIDTH, 0))
    }
  }

  const hoverAnchor = hover && anchorsById[hover.anchorId]
  const hoverEntry = hoverAnchor && entries[hoverAnchor.entryId]

  return (
    <Box
      ref={containerRef}
      data-layer={layer}
      sx={theme => ({
        position: 'relative',
        fontFamily: 'var(--font-serif)',
        fontSize: '1.125rem',
        lineHeight: 1.8,
        '& .pal-paragraph a': { color: theme.palette.text.primary },
        '& .pal-paragraph sup a': { textDecoration: 'none' },
        '& .pal-word': {
          cursor: 'pointer',
          borderRadius: 0.5,
          transition: choose(reducedMotion, 'none', 'opacity 200ms')
        },
        '&[data-layer="words"] .pal-word': {
          borderBottom: `2px dotted ${theme.palette.primary.main}`
        },
        '&[data-layer="writing"] .pal-word': {
          borderBottom: `2px dashed ${theme.palette.secondary.main}`
        },
        '& .pal-word:focus-visible, & .pal-pin:focus-visible': {
          outline: `3px solid ${theme.palette.primary.main}`,
          outlineOffset: 2
        },
        '& .pal-word:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
        '& .pal-dim': { opacity: 0.3 },
        '& .pal-pin': {
          marginLeft: '2px',
          padding: '0 2px',
          border: 0,
          color: theme.palette.primary.main,
          fontSize: '0.7em',
          verticalAlign: 'super',
          background: 'transparent',
          cursor: 'pointer'
        }
      })}
      onMouseOver={handleOver}
      onMouseOut={handleOut}
      onFocus={handleOver}
      onBlur={handleOut}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseUp={handleSelect}
      onKeyUp={handleSelect}
    >
      {blocks.map(block => (
        <ArticleBlock
          key={block.id}
          block={block}
          anchors={anchors}
          context={contextByBlock[block.id]}
          revealed={revealed}
          layer={layer}
          pinned={pinnedContextId === (contextByBlock[block.id] && contextByBlock[block.id].id)}
          onOpenContext={onOpenContext}
        />
      ))}

      {
        interactive && showOverlay
          && (
            <FormOverlay
              rect={overlayRect}
              form={overlayForm}
              paletteKey={PALETTE_KEYS[layer]}
              reducedMotion={reducedMotion}
              onFit={setFits}
            />
          )
      }

      {
        interactive && hover && hoverEntry
          && (
            <WordCard
              entry={hoverEntry}
              sense={hoverEntry.senses.find(item => item.id === hoverAnchor.senseId)}
              form={getForm(hoverEntry, hoverEntry.headline)}
              modern={hoverAnchor.exact}
              layer={layer}
              sources={sources}
              position={cardPosition(hover)}
              cardRef={cardRef}
              onExplore={() => {
                onPinWord(hover.anchorId, hover.uid)
                setHover(undefined)
              }}
              onClose={() => setHover(undefined)}
              onEnter={cancelClose}
              onLeave={scheduleClose}
            />
          )
      }

      {
        interactive && selection
          && (
            <NoAnnotationCard
              word={selection.word}
              position={selection}
              onClose={() => setSelection(undefined)}
            />
          )
      }
    </Box>
  )
}

ArticleView.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object).isRequired,
  anchors: PropTypes.arrayOf(PropTypes.object).isRequired,
  contexts: PropTypes.arrayOf(PropTypes.object).isRequired,
  entries: PropTypes.objectOf(PropTypes.object).isRequired,
  sources: PropTypes.objectOf(PropTypes.object).isRequired,
  revealed: PropTypes.bool.isRequired,
  layer: PropTypes.string.isRequired,
  pinned: PropTypes.shape({ uid: PropTypes.string, anchorId: PropTypes.string, stageId: PropTypes.string }),
  pinnedContextId: PropTypes.string,
  reducedMotion: PropTypes.bool,
  onPinWord: PropTypes.func.isRequired,
  onOpenContext: PropTypes.func.isRequired
}

export default ArticleView
