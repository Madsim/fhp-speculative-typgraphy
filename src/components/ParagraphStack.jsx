import { useState } from 'react'
import PropTypes from 'prop-types'

import { Box, Chip, Stack } from '@mui/material'

import StackLayer from './StackLayer'

import { LANGUAGES } from '../constants/languages'

const ParagraphStack = ({ layers }) => {
  const [hidden, setHidden] = useState([])
  const [focusedId, setFocusedId] = useState('')

  const visibleLayers = layers.filter(({ id }) => !hidden.includes(id))

  const getVariant = id => {
    if (hidden.includes(id)) return 'outlined'
    return 'filled'
  }

  const handleToggle = id => {
    if (hidden.includes(id)) {
      setHidden(hidden.filter(hiddenId => hiddenId !== id))
      return
    }
    setHidden([...hidden, id])
  }

  return (
    <Box
      sx={{
        mb: 4
      }}
    >
      <Box
        sx={{
          display: 'grid'
        }}
      >
        {visibleLayers.map(({ id, language, text, segments }, index) => (
          <StackLayer
            key={id}
            language={language}
            text={text}
            segments={segments}
            zIndex={visibleLayers.length - index}
            dimmed={focusedId !== '' && focusedId !== id}
            focused={focusedId === id}
          />
        ))}
      </Box>
      {
        layers.length > 1
          && (
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ mt: 1 }}
            >
              {layers.map(({ id, language }) => (
                <Chip
                  key={id}
                  size="small"
                  label={LANGUAGES[language].label}
                  variant={getVariant(id)}
                  onClick={() => handleToggle(id)}
                  onMouseEnter={() => setFocusedId(id)}
                  onMouseLeave={() => setFocusedId('')}
                />
              ))}
            </Stack>
          )
      }
    </Box>
  )
}

ParagraphStack.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    segments: PropTypes.arrayOf(PropTypes.object)
  })).isRequired
}

export default ParagraphStack
