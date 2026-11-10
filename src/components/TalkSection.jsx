import PropTypes from 'prop-types'

import { Box, Typography } from '@mui/material'

import TalkComment from './TalkComment'

const TalkSection = ({ title, comments }) => (
  <Box sx={{ mb: 5 }}>
    <Typography
      variant="h6"
      sx={{ mb: 2 }}
    >
      {title}
    </Typography>
    {comments.map(({ author, timestamp, text }) => (
      <TalkComment
        key={`${author}-${timestamp}`}
        author={author}
        timestamp={timestamp}
        text={text}
      />
    ))}
  </Box>
)

TalkSection.propTypes = {
  title: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({
    author: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired
}

export default TalkSection
