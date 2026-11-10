export const RELATION_TYPES = {
  ancestor: {
    label: 'Descends from',
    description: 'The later form is the continuation of the earlier one within one language line.'
  },
  borrowing: {
    label: 'Borrowed from',
    description: 'One language took the word from another; the meaning may have shifted.'
  },
  translation: {
    label: 'Translation of',
    description: 'Chosen to carry the meaning across languages. The forms are not related by descent.'
  },
  cognate: {
    label: 'Cognate with',
    description: 'Both descend from a shared ancestor; neither comes from the other.'
  },
  related: {
    label: 'Related to',
    description: 'Linked by derivation or a shared root, not by borrowing between these two forms.'
  },
  falseFriend: {
    label: 'False friend',
    description: 'Looks or sounds similar, but the meanings or origins differ.'
  },
  unrelated: {
    label: 'Unrelated',
    description: 'Names the same thing or looks alike, but the forms have separate origins.'
  }
}

export const EVIDENCE_STATUS = {
  documented: {
    label: 'Documented',
    description: 'A written form attested in a surviving source.'
  },
  reconstructed: {
    label: 'Reconstructed',
    description: 'A scholarly reconstruction. It is not attested in writing.'
  },
  proposed: {
    label: 'Proposed',
    description: 'A suggested connection that has not been established.'
  },
  disputed: {
    label: 'Disputed',
    description: 'Scholars disagree about this connection.'
  }
}
