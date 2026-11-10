import PropTypes from 'prop-types'

import { Typography } from '@mui/material'

import { LANGUAGES } from '../constants/languages'

import { authorFonts } from '../utils/authorFonts'

const StackLayer = ({ language, text, segments, zIndex, dimmed = false, focused = false }) => {
  const { lang, dir, font, paletteKey } = LANGUAGES[language]

  let opacity = 0.85
  if (dimmed) opacity = 0.2
  if (focused) opacity = 1

  let layerZ = zIndex
  if (focused) layerZ = 1000

  return (
    <Typography
      component="p"
      variant="body1"
      dir={dir}
      lang={lang}
      sx={theme => {
        let color = theme.palette[paletteKey].main
        if (paletteKey === 'text') color = theme.palette.text.primary

        return {
          position: 'relative',
          zIndex: layerZ,
          gridArea: '1 / 1',
          m: 0,
          color,
          fontFamily: font,
          fontSize: theme.typography.h6.fontSize,
          lineHeight: 1.6,
          textAlign: 'start',
          opacity,
          mixBlendMode: 'multiply',
          transition: 'opacity 150ms'
        }
      }}
    >
      {
        !segments
          && text
      }
      {
        segments
          && segments.map(({ key, text: part, author }) => (
            <span
              key={key}
              style={{ fontFamily: authorFonts[author] }}
            >
              {part}
            </span>
          ))
      }
    </Typography>
  )
}

StackLayer.propTypes = {
  language: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  segments: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired
  })),
  zIndex: PropTypes.number.isRequired,
  dimmed: PropTypes.bool,
  focused: PropTypes.bool
}

export default StackLayer
