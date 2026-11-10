import PropTypes from 'prop-types'

import {
  IconButton, Paper, Stack, Typography
} from '@mui/material'

import { Close as CloseIcon } from '@mui/icons-material'

// Shown when a reader selects a word that has no verified annotation. The text stays unchanged.
const NoAnnotationCard = ({ word, position, onClose }) => (
  <Paper
    elevation={4}
    role="status"
    sx={{
      position: 'absolute',
      top: position.top,
      left: position.left,
      zIndex: 10,
      width: 300,
      maxWidth: 'calc(100vw - 32px)',
      p: 1.5
    }}
  >
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Typography variant="subtitle2">
        {word}
      </Typography>
      <IconButton
        size="small"
        aria-label="Close"
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Stack>
    <Typography variant="body2">
      No verified historical annotation is available for this word yet.
    </Typography>
    <Typography
      variant="caption"
      color="text.secondary"
    >
      That means it has not been researched here, which is different from an origin known to be unknown.
    </Typography>
  </Paper>
)

NoAnnotationCard.propTypes = {
  word: PropTypes.string.isRequired,
  position: PropTypes.shape({ top: PropTypes.number, left: PropTypes.number }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default NoAnnotationCard
