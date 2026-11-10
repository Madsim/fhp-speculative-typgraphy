import PropTypes from 'prop-types'

import {
  Button, Chip, Paper, Stack, Typography
} from '@mui/material'

// Short contextual explanation, shown on hover or focus of a passage's margin marker.
const ContextCard = ({
  context, onOpen, onEnter, onLeave
}) => (
  <Paper
    elevation={6}
    role="region"
    aria-label={`Historical context: ${context.title}`}
    sx={{
      position: 'absolute',
      top: 36,
      left: 0,
      zIndex: 10,
      width: 340,
      maxWidth: 'calc(100vw - 32px)',
      p: 2
    }}
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
  >
    <Typography variant="subtitle1">
      {context.title}
    </Typography>
    <Typography
      variant="body2"
      sx={{ my: 1 }}
    >
      {context.summary}
    </Typography>
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={0.5}
    >
      {context.connections.map(connection => (
        <Chip
          key={connection.id}
          size="small"
          variant="outlined"
          label={`${connection.place} · ${connection.period}`}
        />
      ))}
    </Stack>
    <Button
      size="small"
      variant="contained"
      sx={{ mt: 1.5 }}
      onClick={onOpen}
    >
      Open context
    </Button>
  </Paper>
)

ContextCard.propTypes = {
  context: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
}

export default ContextCard
