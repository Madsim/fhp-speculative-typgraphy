import PropTypes from 'prop-types'

import { Box, Typography } from '@mui/material'

import { authorFonts } from '../utils/authorFonts'

const TalkComment = ({ author, timestamp, text }) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      component="p"
      variant="caption"
      color="text.secondary"
    >
      {`${author} · ${timestamp}`}
    </Typography>
    <Typography
      component="p"
      variant="body1"
      sx={theme => ({
        fontFamily: authorFonts[author],
        fontSize: theme.typography.h5.fontSize,
        lineHeight: 1.5
      })}
    >
      {text}
    </Typography>
  </Box>
)

TalkComment.propTypes = {
  author: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export default TalkComment
