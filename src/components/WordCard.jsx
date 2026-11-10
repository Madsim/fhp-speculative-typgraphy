import PropTypes from 'prop-types'

import {
  Box, Button, IconButton, Paper, Stack, Typography
} from '@mui/material'

import { Close as CloseIcon } from '@mui/icons-material'

import EvidenceChip from './EvidenceChip'
import FormText from './FormText'
import SourceChips from './SourceChips'

import { SCRIPT_NAMES } from '../constants/scripts'

const DATE_LABELS = {
  'earliest-evidence': 'Earliest known evidence',
  approximate: 'Approximate date',
  modern: 'Period'
}

// Compact explanation: recognition -> transformation -> explanation. Selecting the word
// (or "Explore") pins it and opens the detail view. The pointer can move into the card.
const WordCard = ({
  entry, sense, form, modern, layer, sources, position, cardRef, onExplore, onClose, onEnter, onLeave
}) => {
  const claim = entry.claims[0]
  const dateLabel = DATE_LABELS[form.dateKind] ?? 'Date'

  return (
    <Paper
      ref={cardRef}
      elevation={6}
      role="region"
      aria-label={`History of ${modern}`}
      sx={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 10,
        width: 340,
        maxWidth: 'calc(100vw - 32px)',
        p: 2
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <div>
          <Typography variant="subtitle1">
            {modern}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {`In this article: ${sense.gloss}`}
          </Typography>
        </div>
        <IconButton
          size="small"
          aria-label="Close explanation"
          onClick={onClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ my: 1.5 }}>
        <Typography
          component="p"
          sx={theme => ({ fontSize: theme.typography.h5.fontSize, lineHeight: 1.4 })}
        >
          <FormText form={form} />
        </Typography>
        {
          form.translit
            && (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {form.translit}
              </Typography>
            )
        }
        <Typography variant="body2">
          {`${form.language} · ${form.meaning}`}
        </Typography>
        {
          form.dateText
            && (
              <Typography
                variant="caption"
                color="text.secondary"
                component="p"
              >
                {`${dateLabel}: ${form.dateText}`}
              </Typography>
            )
        }
        {
          layer === 'writing'
            && (
              <Typography
                variant="caption"
                component="p"
              >
                {`Language: ${form.language} · Script: ${SCRIPT_NAMES[form.script]}. Shown in a modern typeface, which is not a historical hand.`}
              </Typography>
            )
        }
        <Box sx={{ mt: 1 }}>
          <EvidenceChip status={form.status} />
        </Box>
      </Box>

      <Typography variant="body2">
        {claim.text}
      </Typography>
      <SourceChips
        sources={sources}
        sourceIds={claim.sourceIds}
      />

      <Button
        size="small"
        variant="contained"
        sx={{ mt: 1.5 }}
        onClick={onExplore}
      >
        Explore history
      </Button>
    </Paper>
  )
}

WordCard.propTypes = {
  entry: PropTypes.object.isRequired,
  sense: PropTypes.shape({ gloss: PropTypes.string }).isRequired,
  form: PropTypes.object.isRequired,
  modern: PropTypes.string.isRequired,
  layer: PropTypes.string.isRequired,
  sources: PropTypes.objectOf(PropTypes.object).isRequired,
  position: PropTypes.shape({ top: PropTypes.number, left: PropTypes.number }).isRequired,
  cardRef: PropTypes.shape({ current: PropTypes.any }),
  onExplore: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
}

export default WordCard
