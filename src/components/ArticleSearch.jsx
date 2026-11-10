import { useState } from 'react'
import PropTypes from 'prop-types'

import { Button, Stack, TextField } from '@mui/material'

import { Search as SearchIcon } from '@mui/icons-material'

const ArticleSearch = ({ loading, error, onSubmit }) => {
  const [value, setValue] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    onSubmit(value)
  }

  return (
    <Stack
      component="form"
      direction="row"
      gap={1}
      onSubmit={handleSubmit}
    >
      <TextField
        size="small"
        fullWidth
        label="Article title or en.wikipedia.org link"
        value={value}
        error={Boolean(error)}
        helperText={error}
        onChange={event => setValue(event.target.value)}
      />
      <Button
        type="submit"
        variant="outlined"
        startIcon={<SearchIcon />}
        disabled={loading}
        sx={{ flexShrink: 0, alignSelf: 'flex-start', height: 40 }}
      >
        Open
      </Button>
    </Stack>
  )
}

ArticleSearch.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired
}

export default ArticleSearch
