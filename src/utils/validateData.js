import { RELATION_TYPES, EVIDENCE_STATUS } from '../constants/relationTypes'

// Fails loudly when a claim has no resolvable source, so unsourced history cannot ship by accident.
const validateData = ({
  sources, wordHistories, contexts, wordAnchors
}) => {
  const problems = []
  const checkSources = (where, sourceIds) => {
    if (!sourceIds || sourceIds.length === 0) problems.push(`${where}: no sources`);
    (sourceIds ?? []).forEach(id => {
      if (!sources[id]) problems.push(`${where}: unknown source "${id}"`)
    })
  }

  Object.values(wordHistories).forEach(entry => {
    const formIds = entry.forms.map(({ id }) => id)
    entry.forms.forEach(item => {
      checkSources(`${entry.id}/form ${item.id}`, item.sourceIds)
      if (!EVIDENCE_STATUS[item.status]) problems.push(`${entry.id}/form ${item.id}: bad status`)
    })
    entry.relations.forEach(item => {
      checkSources(`${entry.id}/relation ${item.from}-${item.to}`, item.sourceIds)
      if (!RELATION_TYPES[item.type]) problems.push(`${entry.id}: bad relation type ${item.type}`)
      if (!formIds.includes(item.from) || !formIds.includes(item.to)) problems.push(`${entry.id}: relation ${item.from}-${item.to} uses an unknown form`)
    })
    entry.claims.forEach((claim, index) => checkSources(`${entry.id}/claim ${index}`, claim.sourceIds));
    (entry.branches ?? []).forEach(branch => checkSources(`${entry.id}/branch ${branch.id}`, branch.sourceIds))
    entry.stages.forEach(id => {
      if (!formIds.includes(id)) problems.push(`${entry.id}: stage ${id} is not a form`)
    })
    if (!formIds.includes(entry.headline)) problems.push(`${entry.id}: headline ${entry.headline} is not a form`)
  })

  contexts.forEach(context => {
    context.connections.forEach(item => checkSources(`${context.id}/connection ${item.id}`, item.sourceIds))
    context.quotations.forEach((item, index) => checkSources(`${context.id}/quotation ${index}`, item.sourceIds))
  })

  wordAnchors.forEach(anchor => {
    const entry = wordHistories[anchor.entryId]
    if (!entry) problems.push(`${anchor.id}: unknown entry`)
    if (entry && !entry.senses.some(({ id }) => id === anchor.senseId)) problems.push(`${anchor.id}: unknown sense`)
  })

  if (problems.length > 0) throw new Error(`Invalid historical data:\n${problems.join('\n')}`)
}

export default validateData
