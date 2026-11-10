import {
  useEffect, useMemo, useRef, useState
} from 'react'
import PropTypes from 'prop-types'

import { Box, IconButton, Typography } from '@mui/material'

import { alpha } from '@mui/material/styles'

import { Diamond as ContextMarkerIcon } from '@mui/icons-material'

import ContextCard from './ContextCard'

import annotateBlock from '../utils/annotateBlock'
import choose from '../utils/choose'

const HEADING_VARIANTS = { h2: 'h4', h3: 'h5' }
const CARD_DELAY = 500

// One heading or paragraph. Words are annotated only while history is revealed; with it off the
// paragraph is the ordinary sanitised Wikipedia HTML. A paragraph with a context annotation gets a
// restrained margin marker.
const ArticleBlock = ({
  block, anchors, context, revealed, layer, pinned, onOpenContext
}) => {
  const [open, setOpen] = useState(false)
  const timer = useRef()

  const html = useMemo(() => {
    if (block.tag !== 'p' || !revealed || layer === 'context' || anchors.length === 0) return block.html
    return annotateBlock(block.html, anchors, block.id)
  }, [block, anchors, revealed, layer])

  const cancel = () => clearTimeout(timer.current)
  const schedule = () => {
    cancel()
    timer.current = setTimeout(() => setOpen(false), CARD_DELAY)
  }

  useEffect(() => cancel, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = event => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (block.tag !== 'p') {
    return (
      <Typography
        component={block.tag}
        variant={HEADING_VARIANTS[block.tag]}
        sx={{ mt: 5, mb: 2 }}
      >
        {block.text}
      </Typography>
    )
  }

  const showMarker = revealed && Boolean(context)
  const highlighted = showMarker && (open || pinned)

  const handleMarker = () => {
    cancel()
    // Touch devices open the short card first; the card then leads to the detail view.
    if (window.matchMedia('(hover: none)').matches) {
      setOpen(true)
      return
    }
    onOpenContext(context)
  }

  return (
    <Box
      sx={theme => ({
        position: 'relative',
        mb: 2.5,
        pl: { xs: 4, md: 0 },
        borderRadius: 1,
        backgroundColor: choose(highlighted, alpha(theme.palette.warning.main, 0.12), 'transparent'),
        transition: 'background-color 150ms'
      })}
    >
      {
        showMarker
          && (
            <IconButton
              size="small"
              aria-label={`Historical context: ${context.title}`}
              aria-expanded={open}
              sx={theme => ({
                position: 'absolute',
                top: 0,
                left: { xs: 0, md: -44 },
                color: theme.palette.warning.dark,
                opacity: choose(layer === 'context', 1, 0.55)
              })}
              onMouseEnter={() => { cancel(); setOpen(true) }}
              onMouseLeave={schedule}
              onFocus={() => { cancel(); setOpen(true) }}
              onBlur={schedule}
              onClick={handleMarker}
            >
              <ContextMarkerIcon fontSize="small" />
            </IconButton>
          )
      }
      <Box
        className="pal-paragraph"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {
        showMarker && open
          && (
            <ContextCard
              context={context}
              onOpen={() => { setOpen(false); onOpenContext(context) }}
              onEnter={cancel}
              onLeave={schedule}
            />
          )
      }
    </Box>
  )
}

ArticleBlock.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    html: PropTypes.string,
    text: PropTypes.string
  }).isRequired,
  anchors: PropTypes.arrayOf(PropTypes.object).isRequired,
  context: PropTypes.object,
  revealed: PropTypes.bool.isRequired,
  layer: PropTypes.string.isRequired,
  pinned: PropTypes.bool,
  onOpenContext: PropTypes.func.isRequired
}

export default ArticleBlock
