import PropTypes from 'prop-types'

import { Alert, Typography } from '@mui/material'

// Article availability and historical-annotation coverage are different things.
const CoverageNotice = ({ article, annotations, revealed }) => {
  const words = annotations.anchors.length
  const passages = annotations.contexts.length
  const hasCoverage = words > 0 || passages > 0

  return (
    <Alert
      severity="info"
      variant="outlined"
      sx={{ mb: 3 }}
    >
      <Typography variant="body2">
        {`Article text: loaded (revision ${article.revision}).`}
      </Typography>
      {
        hasCoverage
          && (
            <Typography variant="body2">
              {`Historical annotations: ${words} word anchors and ${passages} passages. Words without a mark have no verified annotation yet.`}
            </Typography>
          )
      }
      {
        !hasCoverage && !annotations.stale
          && (
            <Typography variant="body2">
              Historical annotations: none for this article yet. It reads as an ordinary article.
            </Typography>
          )
      }
      {
        annotations.stale
          && (
            <Typography variant="body2">
              {`Historical annotations were written for revision ${annotations.annotatedRevision}; this revision differs, so none are applied.`}
            </Typography>
          )
      }
      {
        revealed && hasCoverage
          && (
            <Typography variant="body2">
              Origins view: forms from different periods appear for single words and passages.
              It is not a translation of the article into any one era.
            </Typography>
          )
      }
    </Alert>
  )
}

CoverageNotice.propTypes = {
  article: PropTypes.shape({ revision: PropTypes.number }).isRequired,
  annotations: PropTypes.shape({
    anchors: PropTypes.array,
    contexts: PropTypes.array,
    stale: PropTypes.bool,
    annotatedRevision: PropTypes.number
  }).isRequired,
  revealed: PropTypes.bool.isRequired
}

export default CoverageNotice
