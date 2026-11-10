import PropTypes from 'prop-types'

import { Link, Typography } from '@mui/material'

// Compact inline source list for a single claim.
const SourceChips = ({ sources, sourceIds }) => (
  <Typography
    component="p"
    variant="caption"
    color="text.secondary"
  >
    {'Sources: '}
    {sourceIds.map((id, index) => (
      <span key={id}>
        {index > 0 && '; '}
        {
          sources[id].url
            && (
              <Link
                href={sources[id].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {sources[id].title}
              </Link>
            )
        }
        {
          !sources[id].url
            && sources[id].title
        }
      </span>
    ))}
  </Typography>
)

SourceChips.propTypes = {
  sources: PropTypes.objectOf(PropTypes.object).isRequired,
  sourceIds: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default SourceChips
