import PropTypes from 'prop-types'

import { Stack, Typography } from '@mui/material'

const Section = ({ title, children }) => (
  <Stack gap={1}>
    <Typography variant="h6">
      {title}
    </Typography>
    {children}
  </Stack>
)

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Section
