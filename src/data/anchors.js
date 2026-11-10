// Anchors tie a word history to an exact text span in one article revision.
// `prefix` / `suffix` narrow a match to the intended sense of a repeated spelling.
// Matching is exact and case-sensitive within a single text node.
export const ANNOTATED_ARTICLE = {
  title: 'Book of Genesis',
  lang: 'en',
  revision: 1383959692
}

export const wordAnchors = [
  // Only the title-etymology occurrence: other mentions of "Genesis" are left unmarked on purpose.
  { id: 'a-genesis', entryId: 'genesis', senseId: 'book-title', exact: 'Genesis', prefix: 'The name ' },
  { id: 'a-torah', entryId: 'torah', senseId: 'pentateuch', exact: 'Torah' },
  { id: 'a-pentateuch', entryId: 'pentateuch', senseId: 'five-books', exact: 'Pentateuch' },
  { id: 'a-septuagint', entryId: 'septuagint', senseId: 'greek-bible', exact: 'Septuagint' },
  { id: 'a-covenant', entryId: 'covenant', senseId: 'agreement', exact: 'covenant' },
  { id: 'a-covenants', entryId: 'covenant', senseId: 'agreement', exact: 'covenants' },
  { id: 'a-hebrew', entryId: 'hebrew', senseId: 'language-people', exact: 'Hebrew' },
  { id: 'a-moses', entryId: 'moses', senseId: 'name', exact: 'Moses' },
  { id: 'a-adam', entryId: 'adam', senseId: 'first-man', exact: 'Adam' },
  { id: 'a-elohim', entryId: 'elohim', senseId: 'god-gods', exact: 'Elohim' },
  { id: 'a-yahweh', entryId: 'yahweh', senseId: 'divine-name', exact: 'Yahweh' },
  { id: 'a-canaan', entryId: 'canaan', senseId: 'land', exact: 'Canaan' },
  { id: 'a-egypt', entryId: 'egypt', senseId: 'country', exact: 'Egypt' },
  { id: 'a-vulgate', entryId: 'vulgate', senseId: 'latin-bible', exact: 'Vulgate' },
  { id: 'a-toledot', entryId: 'toledot', senseId: 'formula', exact: 'toledot' },
  { id: 'a-bereshit', entryId: 'bereshit', senseId: 'first-word', exact: 'bereshit' }
]
