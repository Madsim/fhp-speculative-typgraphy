import PropTypes from 'prop-types'

import {
  Box, Chip, Divider, Stack, Typography
} from '@mui/material'

import {
  FormatQuote as OriginalIcon,
  Translate as TranslationIcon,
  Notes as SummaryIcon
} from '@mui/icons-material'

import EvidenceChip from './EvidenceChip'
import Section from './Section'
import SourceChips from './SourceChips'
import SourceList from './SourceList'

import { SCRIPT_FONTS } from '../constants/scripts'
import choose from '../utils/choose'

const KIND = {
  original: { label: 'Original quotation', icon: <OriginalIcon /> },
  translation: { label: 'Translation', icon: <TranslationIcon /> },
  summary: { label: 'Present-day summary', icon: <SummaryIcon /> }
}

const percent = (year, min, span) => `${((year - min) / span) * 100}%`

const formatYear = year => {
  if (year < 0) return `${-year} BCE`
  return `${year} CE`
}

// Deeper view of one passage. A passage can have several connections; none is forced into a
// single date or place. Original quotations, translations and summaries are labelled apart.
const ContextDetail = ({ context, passageText, sources }) => {
  const dated = context.connections.filter(item => item.startYear !== undefined)
  const min = Math.min(...dated.map(item => item.startYear))
  const max = Math.max(...dated.map(item => item.endYear ?? item.startYear))
  const span = Math.max(max - min, 1)
  const allSourceIds = [
    ...context.connections.flatMap(item => item.sourceIds),
    ...context.quotations.flatMap(item => item.sourceIds)
  ]

  return (
    <Stack gap={3}>
      <div>
        <Typography variant="h5">
          {context.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {context.summary}
        </Typography>
      </div>

      <Box
        sx={theme => ({ pl: 2, borderLeft: `3px solid ${theme.palette.warning.main}` })}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Passage in the modern article
        </Typography>
        <Typography variant="body2">
          {passageText}
        </Typography>
      </Box>

      <Section title="Connections">
        {
          dated.length > 1
            && (
              <Box
                aria-hidden="true"
                sx={theme => ({
                  position: 'relative', height: 8 * dated.length + 8, backgroundColor: theme.palette.action.hover, borderRadius: 1
                })}
              >
                {dated.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={theme => ({
                      position: 'absolute',
                      top: 4 + index * 8,
                      left: percent(item.startYear, min, span),
                      width: `max(${(((item.endYear ?? item.startYear) - item.startYear) / span) * 100}%, 6px)`,
                      height: 6,
                      backgroundColor: theme.palette.warning.main,
                      borderRadius: 1
                    })}
                  />
                ))}
              </Box>
            )
        }
        {
          dated.length > 1
            && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {`Approximate range shown: ${formatYear(min)} – ${formatYear(max)}. Bars are in the order listed below.`}
              </Typography>
            )
        }
        <Stack gap={2}>
          {context.connections.map(item => (
            <div key={item.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                gap={1}
              >
                <Typography variant="subtitle2">
                  {item.label}
                </Typography>
                <EvidenceChip status={item.status} />
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {`${item.place} · ${item.period}`}
              </Typography>
              <Typography variant="body2">
                {item.explanation}
              </Typography>
              <SourceChips
                sources={sources}
                sourceIds={item.sourceIds}
              />
            </div>
          ))}
        </Stack>
      </Section>

      <Divider />
      <Section title="Sources and quotations">
        <Stack gap={2}>
          {context.quotations.map(item => (
            <div key={item.label}>
              <Chip
                size="small"
                icon={KIND[item.kind].icon}
                label={choose(item.reference, `${KIND[item.kind].label} · ${item.reference}`, KIND[item.kind].label)}
              />
              <Typography
                component="p"
                lang={item.langTag}
                dir={item.dir}
                sx={theme => ({
                  my: 0.5,
                  fontFamily: SCRIPT_FONTS[item.script],
                  fontSize: theme.typography.h6.fontSize
                })}
              >
                {item.text}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                component="p"
              >
                {`${item.label} · ${item.language}`}
              </Typography>
              <SourceChips
                sources={sources}
                sourceIds={item.sourceIds}
              />
            </div>
          ))}
        </Stack>
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

ContextDetail.propTypes = {
  context: PropTypes.object.isRequired,
  passageText: PropTypes.string.isRequired,
  sources: PropTypes.objectOf(PropTypes.object).isRequired
}

export default ContextDetail
