import PropTypes from 'prop-types'

import { Stack, Typography } from '@mui/material'

import EvidenceChip from './EvidenceChip'
import FormText from './FormText'
import SourceChips from './SourceChips'

import { RELATION_TYPES } from '../constants/relationTypes'
import { getForm } from '../utils/historyHelpers'

// Compare meanings: every pair is named as ancestor, borrowing, translation, cognate, related,
// false friend or unrelated, so similar-looking forms are never mistaken for ancestors.
const CompareView = ({ entry, sources }) => (
  <Stack gap={2}>
    {entry.relations.map(relation => {
      const from = getForm(entry, relation.from)
      const to = getForm(entry, relation.to)
      const type = RELATION_TYPES[relation.type]

      return (
        <div key={`${relation.from}-${relation.to}`}>
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="baseline"
            gap={1}
          >
            <Typography component="span">
              <FormText form={from} />
            </Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {`→ ${type.label.toLowerCase()} →`}
            </Typography>
            <Typography component="span">
              <FormText form={to} />
            </Typography>
            <EvidenceChip status={relation.status} />
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {`${from.language}: “${from.meaning}” · ${to.language}: “${to.meaning}”`}
          </Typography>
          <Typography variant="body2">
            {type.description}
          </Typography>
          {
            relation.note
              && (
                <Typography variant="body2">
                  {relation.note}
                </Typography>
              )
          }
          <SourceChips
            sources={sources}
            sourceIds={relation.sourceIds}
          />
        </div>
      )
    })}
  </Stack>
)

CompareView.propTypes = {
  entry: PropTypes.object.isRequired,
  sources: PropTypes.objectOf(PropTypes.object).isRequired
}

export default CompareView
