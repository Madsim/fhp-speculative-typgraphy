import PropTypes from 'prop-types'

import { Link, Stack, Typography } from '@mui/material'

import { sourcesFor } from '../utils/historyHelpers'

// Full attribution and licence list for everything a detail view relies on.
const SourceList = ({ sources, sourceIds }) => (
  <Stack
    component="ul"
    gap={1}
    sx={{ m: 0, pl: 2 }}
  >
    {sourcesFor(sources, [...new Set(sourceIds)]).map(source => (
      <li key={source.id}>
        <Typography variant="body2">
          {
            source.url
              && (
                <Link
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source.title}
                </Link>
              )
          }
          {
            !source.url
              && source.title
          }
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {`Licence: ${source.license}`}
        </Typography>
      </li>
    ))}
  </Stack>
)

SourceList.propTypes = {
  sources: PropTypes.objectOf(PropTypes.object).isRequired,
  sourceIds: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default SourceList
