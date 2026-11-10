const WORD_CHAR = /[\p{L}\p{N}]/u

const findMatches = (text, anchors) => {
  const matches = []
  anchors.forEach(anchor => {
    let from = 0
    while (from <= text.length) {
      const index = text.indexOf(anchor.exact, from)
      if (index < 0) break
      from = index + anchor.exact.length
      const before = text[index - 1] ?? ''
      const after = text[index + anchor.exact.length] ?? ''
      const wholeWord = !WORD_CHAR.test(before) && !WORD_CHAR.test(after)
      const prefixOk = !anchor.prefix || text.slice(0, index).endsWith(anchor.prefix)
      const suffixOk = !anchor.suffix || text.slice(index + anchor.exact.length).startsWith(anchor.suffix)
      if (wholeWord && prefixOk && suffixOk) matches.push({ index, end: from, anchor })
    }
  })
  // Longest-first on ties, and no overlaps.
  matches.sort((a, b) => a.index - b.index || b.end - a.end)
  const kept = []
  matches.forEach(match => {
    const last = kept[kept.length - 1]
    if (!last || match.index >= last.end) kept.push(match)
  })
  return kept
}

// Wraps matching words in spans. Words inside links get a separate pin button next to the link,
// so that a link keeps its normal navigation behaviour.
const annotateBlock = (html, anchors, blockId) => {
  const doc = new DOMParser().parseFromString(`<body><div>${html}</div></body>`, 'text/html')
  const root = doc.body.firstElementChild
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)

  let counter = 0
  const linkPins = new Map()

  nodes.forEach(node => {
    const matches = findMatches(node.data, anchors)
    if (matches.length === 0) return

    const link = node.parentElement.closest('a')
    const fragment = doc.createDocumentFragment()
    let cursor = 0

    matches.forEach(({ index, end, anchor }) => {
      fragment.append(node.data.slice(cursor, index))
      counter += 1
      const uid = `${blockId}-${anchor.id}-${counter}`
      const span = doc.createElement('span')
      span.className = 'pal-word'
      span.dataset.occ = anchor.id
      span.dataset.uid = uid
      span.textContent = node.data.slice(index, end)
      if (!link) {
        span.setAttribute('role', 'button')
        span.setAttribute('tabindex', '0')
        span.setAttribute('aria-label', `${span.textContent}: explore its history`)
      }
      if (link) {
        span.dataset.inLink = 'true'
        if (!linkPins.has(link)) linkPins.set(link, { uid, anchor, text: span.textContent })
      }
      fragment.append(span)
      cursor = end
    })

    fragment.append(node.data.slice(cursor))
    node.replaceWith(fragment)
  })

  linkPins.forEach(({ uid, anchor, text }, link) => {
    const pin = doc.createElement('button')
    pin.type = 'button'
    pin.className = 'pal-pin'
    pin.dataset.pin = uid
    pin.dataset.occ = anchor.id
    pin.dataset.uid = uid
    pin.setAttribute('aria-label', `Explore the history of ${text}`)
    pin.textContent = '◇'
    link.after(pin)
  })

  return root.innerHTML
}

export default annotateBlock
