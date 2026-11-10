import { useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'

import { alpha } from '@mui/material/styles'

import FormText from './FormText'

// The historical form appears directly over the modern word, aligned to it, while the modern word
// stays underneath at reduced opacity. If the form is wider than the word, nothing is overlaid
// (neighbouring words are never covered); the card shows it in an expanded view instead.
// Decorative only: screen readers get the same forms through the card.
const FormOverlay = ({
  rect, form, paletteKey, reducedMotion, onFit
}) => {
  const ref = useRef()
  const [fits, setFits] = useState(false)
  const [shown, setShown] = useState(false)

  useLayoutEffect(() => {
    const nowFits = ref.current.scrollWidth <= rect.width + 2
    setFits(nowFits)
    if (onFit) onFit(nowFits)
    setShown(false)
    const frame = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(frame)
  }, [form.id, rect.width, rect.uid, onFit])

  let opacity = 0
  if (fits && shown) opacity = 1

  let transition = 'opacity 220ms ease, transform 220ms ease'
  if (reducedMotion) transition = 'none'

  let transform = 'translateY(2px)'
  if (shown) transform = 'translateY(0)'
  if (reducedMotion) transform = 'none'

  return (
    <Box
      ref={ref}
      aria-hidden="true"
      sx={theme => ({
        position: 'absolute',
        top: rect.top,
        left: rect.left,
        zIndex: 2,
        width: rect.width,
        height: rect.height,
        overflow: 'hidden',
        color: theme.palette[paletteKey].dark,
        fontSize: rect.fontSize,
        lineHeight: `${rect.height}px`,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        borderRadius: 0.5,
        opacity,
        pointerEvents: 'none',
        transform,
        transition
      })}
    >
      <FormText form={form} />
    </Box>
  )
}

FormOverlay.propTypes = {
  rect: PropTypes.shape({
    uid: PropTypes.string,
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    fontSize: PropTypes.string
  }).isRequired,
  form: PropTypes.object.isRequired,
  paletteKey: PropTypes.string.isRequired,
  reducedMotion: PropTypes.bool,
  onFit: PropTypes.func
}

export default FormOverlay
