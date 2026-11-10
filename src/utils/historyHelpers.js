export const getForm = (entry, id) => entry.forms.find(item => item.id === id)

export const stageForms = entry => entry.stages.map(id => getForm(entry, id))

export const modernForm = entry => getForm(entry, entry.stages[entry.stages.length - 1])

export const relationBetween = (entry, aId, bId) => entry.relations.find(item => (
  (item.from === aId && item.to === bId) || (item.from === bId && item.to === aId)
))

export const hasForm = (entry, script) => entry.forms.some(item => item.script === script)

export const sourcesFor = (sources, ids) => ids.filter(id => sources[id]).map(id => ({ id, ...sources[id] }))
