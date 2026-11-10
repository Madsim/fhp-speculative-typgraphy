import PropTypes from 'prop-types'

import { Stack, Typography } from '@mui/material'

import FormText from './FormText'
import GlyphMorph from './GlyphMorph'
import SourceChips from './SourceChips'

import { SCRIPT_NAMES } from '../constants/scripts'
import { SCRIPT_FACTS, consonantsOf } from '../data/scriptHistory'

// Keeps language, script and typeface apart: each form lists all three separately.
const WritingDetail = ({ entry, sources, reducedMotion }) => {
  const scripts = [...new Set(entry.forms.map(item => item.script))]
  const hebrew = entry.forms.find(item => item.script === 'Hebr' && consonantsOf(item.written).length > 0)

  return (
    <Stack gap={2}>
      <Stack gap={1}>
        {entry.forms.map(item => (
          <Typography
            key={item.id}
            variant="body2"
          >
            <FormText form={item} />
            {` — language: ${item.language}; script: ${SCRIPT_NAMES[item.script]}; typeface: a modern display face, not a historical hand`}
          </Typography>
        ))}
      </Stack>

      {scripts.filter(script => SCRIPT_FACTS[script]).map(script => (
        <div key={script}>
          <Typography variant="subtitle2">
            {SCRIPT_NAMES[script]}
          </Typography>
          <Typography variant="body2">
            {SCRIPT_FACTS[script].note}
          </Typography>
          <SourceChips
            sources={sources}
            sourceIds={SCRIPT_FACTS[script].sourceIds}
          />
        </div>
      ))}

      {
        hebrew
          && (
            <div>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1 }}
              >
                Letter lineage
              </Typography>
              <GlyphMorph
                key={hebrew.written}
                written={hebrew.written}
                reducedMotion={reducedMotion}
              />
            </div>
          )
      }
    </Stack>
  )
}

WritingDetail.propTypes = {
  entry: PropTypes.object.isRequired,
  sources: PropTypes.objectOf(PropTypes.object).isRequired,
  reducedMotion: PropTypes.bool
}

export default WritingDetail
