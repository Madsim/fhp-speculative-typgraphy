import PropTypes from 'prop-types'

import {
  Box, ButtonBase, Stack, Typography
} from '@mui/material'

import EvidenceChip from './EvidenceChip'
import FormText from './FormText'
import SourceChips from './SourceChips'

import { RELATION_TYPES } from '../constants/relationTypes'
import choose from '../utils/choose'
import { relationBetween, stageForms } from '../utils/historyHelpers'

// Documented path from the earliest form to the modern word. Selecting a stage makes the word in
// the article transform to that stage. Competing explanations are shown as branches, not merged.
const Timeline = ({
  entry, sources, selectedId, onSelect
}) => {
  const stages = stageForms(entry)

  return (
    <Stack gap={1}>
      {stages.map((stage, index) => {
        const previous = stages[index - 1]
        const relation = previous && relationBetween(entry, previous.id, stage.id)
        const selected = stage.id === selectedId
        const borderWidth = choose(selected, 2, 1)
        const note = relation && relation.note
        let arrow = ''
        if (relation) arrow = `↓ ${RELATION_TYPES[relation.type].label.toLowerCase()}`
        if (note) arrow += ` — ${note}`

        return (
          <div key={stage.id}>
            {
              relation
                && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', ml: 2, mb: 0.5 }}
                  >
                    {arrow}
                  </Typography>
                )
            }
            <ButtonBase
              aria-current={selected}
              sx={theme => ({
                display: 'block',
                width: '100%',
                p: 1.5,
                textAlign: 'start',
                border: `${borderWidth}px solid ${choose(selected, theme.palette.primary.main, theme.palette.divider)}`,
                borderRadius: 1
              })}
              onClick={() => onSelect(stage.id)}
            >
              <Stack
                direction="row"
                alignItems="baseline"
                justifyContent="space-between"
                gap={1}
              >
                <Typography
                  component="span"
                  sx={theme => ({ fontSize: theme.typography.h6.fontSize })}
                >
                  <FormText form={stage} />
                </Typography>
                <EvidenceChip status={stage.status} />
              </Stack>
              {
                stage.translit
                  && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {stage.translit}
                    </Typography>
                  )
              }
              <Typography variant="body2">
                {`${stage.language} · ${stage.meaning}`}
              </Typography>
              {
                stage.dateText
                  && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {stage.dateText}
                    </Typography>
                  )
              }
            </ButtonBase>
            {
              stage.note
                && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    {stage.note}
                  </Typography>
                )
            }
          </div>
        )
      })}

      {
        entry.branches
          && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1 }}
              >
                Competing explanations
              </Typography>
              <Stack gap={1.5}>
                {entry.branches.map(branch => (
                  <Box
                    key={branch.id}
                    sx={theme => ({ p: 1.5, border: `1px dashed ${theme.palette.divider}`, borderRadius: 1 })}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      gap={1}
                    >
                      <Typography variant="body2">
                        {branch.label}
                      </Typography>
                      <EvidenceChip status={branch.status} />
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {branch.summary}
                    </Typography>
                    <SourceChips
                      sources={sources}
                      sourceIds={branch.sourceIds}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          )
      }
    </Stack>
  )
}

Timeline.propTypes = {
  entry: PropTypes.object.isRequired,
  sources: PropTypes.objectOf(PropTypes.object).isRequired,
  selectedId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default Timeline
