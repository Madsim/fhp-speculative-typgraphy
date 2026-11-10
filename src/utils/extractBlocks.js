const SKIPPED_SECTIONS = ['References', 'Notes', 'Bibliography', 'Further reading', 'External links', 'See also', 'Commentaries', 'General']

// Splits sanitised article HTML into reading blocks: headings and paragraphs.
const extractBlocks = html => {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const blocks = []
  let skipping = false

  doc.body.querySelectorAll('p, h2, h3').forEach(element => {
    const text = element.textContent.replace(/\s+/g, ' ').trim()
    if (!text) return

    if (element.tagName === 'H2') skipping = SKIPPED_SECTIONS.includes(text)
    if (skipping) return

    const id = `b${blocks.length}`
    if (element.tagName === 'P') {
      blocks.push({
        id, tag: 'p', html: element.innerHTML, text
      })
    }
    if (element.tagName !== 'P') blocks.push({ id, tag: element.tagName.toLowerCase(), text })
  })

  return blocks
}

export default extractBlocks
