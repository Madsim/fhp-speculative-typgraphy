import PropTypes from 'prop-types'

import { Divider, Stack, Typography } from '@mui/material'

import CompareView from './CompareView'
import SourceChips from './SourceChips'
import Section from './Section'
import SourceList from './SourceList'
import Timeline from './Timeline'
import WritingDetail from './WritingDetail'

import { modernForm } from '../utils/historyHelpers'

// Deeper view of one word. The selected layer decides which section leads.
const WordDetail = ({
  entry, sense, layer, sources, stageId, reducedMotion, onStage
}) => {
  const allSourceIds = [
    ...entry.claims.flatMap(claim => claim.sourceIds),
    ...entry.forms.flatMap(item => item.sourceIds),
    ...(entry.branches ?? []).flatMap(branch => branch.sourceIds)
  ]

  const writing = (
    <Section title="Writing">
      <WritingDetail
        entry={entry}
        sources={sources}
        reducedMotion={reducedMotion}
      />
    </Section>
  )

  const words = (
    <>
      <Section title="Timeline">
        <Timeline
          entry={entry}
          sources={sources}
          selectedId={stageId}
          onSelect={onStage}
        />
      </Section>
      <Divider />
      <Section title="Compare meanings">
        <CompareView
          entry={entry}
          sources={sources}
        />
      </Section>
    </>
  )

  return (
    <Stack gap={3}>
      <div>
        <Typography variant="h5">
          {modernForm(entry).written}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {`In this article: ${sense.gloss}`}
        </Typography>
      </div>

      <Stack gap={1}>
        {entry.originNote
          && (
            <Typography variant="body2">
              {entry.originNote}
            </Typography>
          )}
        {entry.claims.map(claim => (
          <div key={claim.text}>
            <Typography variant="body1">
              {claim.text}
            </Typography>
            <SourceChips
              sources={sources}
              sourceIds={claim.sourceIds}
            />
          </div>
        ))}
      </Stack>

      <Divider />
      {layer === 'writing' && writing}
      {layer === 'writing' && <Divider />}
      {words}
      {layer !== 'writing' && <Divider />}
      {layer !== 'writing' && writing}
      <Divider />

      <Section title="Sources and licences">
        <SourceList
          sources={sources}
          sourceIds={allSourceIds}
        />
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Prototype status: sourced from the references above and not yet reviewed by a specialist.
        </Typography>
      </Section>
    </Stack>
  )
}

WordDetail.propTypes = {
  entry: PropTypes.object.isRequired,
  sense: PropTypes.shape({ gloss: PropTypes.string }).isRequired,
  layer: PropTypes.string.isRequired,
  sources: PropTypes.objectOf(PropTypes.object).isRequired,
  stageId: PropTypes.string.isRequired,
  reducedMotion: PropTypes.bool,
  onStage: PropTypes.func.isRequired
}

export default WordDetail
