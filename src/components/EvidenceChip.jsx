import PropTypes from 'prop-types'

import { Chip, Tooltip } from '@mui/material'

import {
  CheckCircle as DocumentedIcon,
  Construction as ReconstructedIcon,
  HelpOutline as ProposedIcon,
  CompareArrows as DisputedIcon
} from '@mui/icons-material'

import { EVIDENCE_STATUS } from '../constants/relationTypes'

const ICONS = {
  documented: <DocumentedIcon />,
  reconstructed: <ReconstructedIcon />,
  proposed: <ProposedIcon />,
  disputed: <DisputedIcon />
}

// The status is always spelled out in words and given a distinct icon shape, never colour alone.
const EvidenceChip = ({ status }) => (
  <Tooltip title={EVIDENCE_STATUS[status].description}>
    <Chip
      size="small"
      variant="outlined"
      icon={ICONS[status]}
      label={EVIDENCE_STATUS[status].label}
    />
  </Tooltip>
)

EvidenceChip.propTypes = {
  status: PropTypes.string.isRequired
}

export default EvidenceChip
