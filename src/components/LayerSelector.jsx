import PropTypes from 'prop-types'

import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

import {
  Translate as WordsIcon,
  Draw as WritingIcon,
  Diamond as ContextIcon
} from '@mui/icons-material'

import { LAYERS } from '../constants/layers'

const ICONS = {
  words: <WordsIcon fontSize="small" />,
  writing: <WritingIcon fontSize="small" />,
  context: <ContextIcon fontSize="small" />
}

const LayerSelector = ({ value, disabled = false, onChange }) => {
  const handleChange = (event, next) => {
    if (next) onChange(next)
  }

  return (
    <div>
      <ToggleButtonGroup
        exclusive
        size="small"
        disabled={disabled}
        aria-label="History layer"
        value={value}
        onChange={handleChange}
      >
        {LAYERS.map(layer => (
          <ToggleButton
            key={layer.id}
            value={layer.id}
            sx={{ gap: 1, px: 2 }}
          >
            {ICONS[layer.id]}
            {layer.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        sx={{ mt: 0.5 }}
      >
        {LAYERS.find(layer => layer.id === value).description}
      </Typography>
    </div>
  )
}

LayerSelector.propTypes = {
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

export default LayerSelector
