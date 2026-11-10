import {
  useEffect, useMemo, useRef, useState
} from 'react'
import PropTypes from 'prop-types'

import opentype from 'opentype.js'

import {
  Box, Button, Slider, Stack, ToggleButton, ToggleButtonGroup, Typography
} from '@mui/material'

import { Pause as PauseIcon, PlayArrow as PlayIcon } from '@mui/icons-material'

import armiFont from '@fontsource/noto-sans-imperial-aramaic/files/noto-sans-imperial-aramaic-imperial-aramaic-400-normal.woff'
import hebrFont from '@fontsource/david-libre/files/david-libre-hebrew-400-normal.woff'
import phnxFont from '@fontsource/noto-sans-phoenician/files/noto-sans-phoenician-phoenician-400-normal.woff'
import { SCRIPT_FONTS } from '../constants/scripts'
import { LETTER_STAGES, consonantsOf, lettersForConsonant } from '../data/scriptHistory'
import choose from '../utils/choose'
import { morphShapes, normalizeGlyph } from '../utils/morph'

const FONT_URLS = { phnx: phnxFont, armi: armiFont, hebr: hebrFont }

const fontCache = new Map()
const fetchFont = async url => opentype.parse(await (await fetch(url)).arrayBuffer())
const loadFont = url => {
  if (!fontCache.has(url)) fontCache.set(url, fetchFont(url))
  return fontCache.get(url)
}

const ease = u => u * u * (3 - 2 * u)

// Curated glyph morph: the outlines come from real fonts for three script stages of one letter.
// Intermediate shapes are animation only; they are not attested characters. Reduced motion
// removes autoplay and leaves a manual slider plus the static side-by-side comparison.
const GlyphMorph = ({ written, reducedMotion }) => {
  const consonants = useMemo(() => consonantsOf(written), [written])
  const [letter, setLetter] = useState(consonants[0])
  const [glyphs, setGlyphs] = useState()
  const [error, setError] = useState('')
  const [position, setPosition] = useState(0)
  const [playing, setPlaying] = useState(false)
  const frame = useRef()

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const chars = lettersForConsonant(letter)
        const entries = await Promise.all(LETTER_STAGES.map(async stage => {
          const font = await loadFont(FONT_URLS[stage.fontKey])
          return [stage.id, normalizeGlyph(font.getPath(chars[stage.id], 0, 0, 100).commands)]
        }))
        if (!cancelled) setGlyphs(Object.fromEntries(entries))
      } catch (loadError) {
        if (!cancelled) setError('The letter outlines could not be loaded.')
      }
    }
    load()
    return () => { cancelled = true }
  }, [letter])

  useEffect(() => {
    if (!playing) return undefined
    const start = performance.now()
    const tick = now => {
      const next = Math.min(((now - start) / 4000) * 2, 2)
      setPosition(next)
      if (next < 2) frame.current = requestAnimationFrame(tick)
      if (next >= 2) setPlaying(false)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [playing])

  const shapes = useMemo(() => {
    if (!glyphs) return []
    const index = Math.min(Math.floor(position), 1)
    const from = LETTER_STAGES[index].id
    const to = LETTER_STAGES[index + 1].id
    return morphShapes(glyphs[from], glyphs[to], ease(position - index))
  }, [glyphs, position])

  const current = LETTER_STAGES[Math.round(position)]
  const chars = lettersForConsonant(letter)

  const handlePlay = () => {
    setPosition(0)
    setPlaying(true)
  }

  return (
    <Stack gap={1.5}>
      <ToggleButtonGroup
        exclusive
        size="small"
        aria-label="Letter to compare"
        value={letter}
        onChange={(event, next) => { if (next) setLetter(next) }}
      >
        {[...new Set(consonants)].map(consonant => (
          <ToggleButton
            key={consonant}
            value={consonant}
            lang="hbo"
          >
            {consonant}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box
        aria-hidden="true"
        sx={theme => ({
          alignSelf: 'center',
          width: 160,
          height: 160,
          color: theme.palette.secondary.dark
        })}
      >
        <svg
          viewBox="-10 -10 120 120"
          width="160"
          height="160"
        >
          {shapes.map(shape => (
            <path
              key={shape.d.slice(0, 40)}
              d={shape.d}
              opacity={shape.opacity}
              fill="currentColor"
              fillRule="evenodd"
            />
          ))}
        </svg>
      </Box>
      {
        error
          && (
            <Typography
              variant="caption"
              color="error"
            >
              {error}
            </Typography>
          )
      }

      <Typography
        variant="body2"
        aria-live="polite"
      >
        {`${current.label} · ${current.period}`}
      </Typography>
      <Slider
        min={0}
        max={2}
        step={0.01}
        value={position}
        aria-label="Transition between letter forms"
        onChange={(event, value) => { setPlaying(false); setPosition(value) }}
      />
      {
        !reducedMotion
          && (
            <Button
              size="small"
              variant="outlined"
              startIcon={choose(playing, <PauseIcon />, <PlayIcon />)}
              sx={{ alignSelf: 'flex-start' }}
              onClick={handlePlay}
            >
              Play
            </Button>
          )
      }

      <Stack
        direction="row"
        justifyContent="space-around"
      >
        {LETTER_STAGES.map(stage => (
          <Box
            key={stage.id}
            sx={{ textAlign: 'center' }}
          >
            <Typography
              component="p"
              sx={{ fontFamily: SCRIPT_FONTS[stage.script], fontSize: 40, lineHeight: 1.3 }}
            >
              <bdi dir="rtl">{chars[stage.id]}</bdi>
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              {stage.label}
            </Typography>
          </Box>
        ))}
      </Stack>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        These are the letter shapes of three scripts, not an attested spelling of this word.
        Shapes between the stages are animation, not historical characters, and each stage is scaled to fit.
      </Typography>
    </Stack>
  )
}

GlyphMorph.propTypes = {
  written: PropTypes.string.isRequired,
  reducedMotion: PropTypes.bool
}

export default GlyphMorph
