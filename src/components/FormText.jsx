import PropTypes from 'prop-types'

import { Box } from '@mui/material'

import { SCRIPT_FONTS } from '../constants/scripts'

// Renders one historical form with its own language, direction (isolated from the surrounding
// sentence) and typeface. Transliteration-only forms use the reading typeface.
const FormText = ({ form, fontSize = 'inherit', italic = false }) => {
  let fontFamily = SCRIPT_FONTS[form.script]
  if (form.script === 'Xsux' || form.script === 'Egyp') fontFamily = SCRIPT_FONTS.Latn

  return (
    <Box
      component="bdi"
      lang={form.langTag}
      dir={form.dir}
      sx={{
        fontFamily,
        fontSize,
        fontStyle: italic ? 'italic' : 'normal'
      }}
    >
      {form.written}
    </Box>
  )
}

FormText.propTypes = {
  form: PropTypes.shape({
    written: PropTypes.string.isRequired,
    script: PropTypes.string.isRequired,
    dir: PropTypes.string.isRequired,
    langTag: PropTypes.string
  }).isRequired,
  fontSize: PropTypes.string,
  italic: PropTypes.bool
}

export default FormText
