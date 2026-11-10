import { useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  Box, Drawer, IconButton, Paper, Stack, Typography, useMediaQuery
} from '@mui/material'

import { Close as CloseIcon } from '@mui/icons-material'

// Deeper exploration lives beside the text on wide screens and in a bottom sheet on small ones.
// Escape closes it, and focus returns to the reader's place in the article.
const DetailPanel = ({
  title, layerLabel, children, onClose
}) => {
  const compact = useMediaQuery(theme => theme.breakpoints.down('md'))

  useEffect(() => {
    const onKey = event => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const header = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <Typography
        variant="overline"
        component="h2"
      >
        {`${layerLabel} · ${title}`}
      </Typography>
      <IconButton
        aria-label="Close details"
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </Stack>
  )

  if (compact) {
    return (
      <Drawer
        anchor="bottom"
        open
        onClose={onClose}
        PaperProps={{
          sx: {
            maxHeight: '75vh', p: 2, borderTopLeftRadius: 16, borderTopRightRadius: 16
          }
        }}
      >
        {header}
        <Box sx={{ overflowY: 'auto' }}>
          {children}
        </Box>
      </Drawer>
    )
  }

  return (
    <Paper
      component="aside"
      variant="outlined"
      aria-label="Details"
      sx={{
        position: 'sticky',
        top: 16,
        flexShrink: 0,
        width: 420,
        maxHeight: 'calc(100vh - 32px)',
        m: 2,
        p: 2,
        overflowY: 'auto'
      }}
    >
      {header}
      {children}
    </Paper>
  )
}

DetailPanel.propTypes = {
  title: PropTypes.string.isRequired,
  layerLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired
}

export default DetailPanel
