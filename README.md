# Palimpsest — read through time

An interactive reading layer for Wikipedia articles. With **Reveal history** on, words and passages
show their documented history inside the text: an earlier form appears over the word, a card explains
the relationship, and selecting the word opens a timeline, a *Compare meanings* view and the evidence.

## Run it

```sh
yarn install
yarn start      # http://localhost:3000
yarn lint
```

Node 22, Yarn 4.4 with `nodeLinker: node-modules`, webpack dev server with React Fast Refresh.

## Assumptions

- **JavaScript, not TypeScript.** The project rules forbid TypeScript, so records are plain objects
  validated at start-up by [validateData.js](src/utils/validateData.js).
- **Article loading** uses the MediaWiki Action API (`action=parse`, with `origin=*` for CORS), which
  returns the article HTML and its revision id in one call. Only `en.wikipedia.org` titles and links
  are accepted. HTML is sanitised with DOMPurify before use.
- **Annotations are tied to one revision** (`Book of Genesis`, revision 1383959692). A different
  revision gets no annotations, never old ones attached to new text.

## Three layers, kept apart

| Layer | Answers | Data |
| --- | --- | --- |
| Words | earlier forms, borrowing, meaning change | [wordHistories.js](src/data/wordHistories.js) |
| Writing | scripts and letter shapes; language ≠ script ≠ typeface | [scriptHistory.js](src/data/scriptHistory.js) |
| Context | periods, places, documents behind a passage | [contexts.js](src/data/contexts.js) |

Word histories are graphs: forms (nodes) joined by typed relations — `ancestor`, `borrowing`,
`translation`, `cognate`, `related`, `falseFriend`, `unrelated` — each with an evidence status
(`documented`, `reconstructed`, `proposed`, `disputed`) and its own `sourceIds`. Competing
explanations are `branches`, not merged into one lineage. Sources and licences are in
[sources.js](src/data/sources.js).

## Implemented

- Bundled, attributed demonstration article (Wikipedia *Book of Genesis*, CC BY-SA 4.0) that works offline.
- Any other English Wikipedia article loads; the notice says it has no historical annotations.
- 15 curated word histories (16 anchors) and 3 passage contexts, with a deliberate mix of cases:
  borrowing chains (*Pentateuch*, *Genesis*), change in meaning (*Vulgate* / *vulgar*), translation vs
  ancestry (*Torah* / *nómos*, *covenant* / *bərîṯ*), false friend and cognate (*Egypt* / *Miṣrayim* /
  *Miṣr*), right-to-left forms (Hebrew, Arabic, Paleo-Hebrew), disputed origins (*Hebrew*, *Moses*),
  an origin known to be unknown (*Canaan*), and a reconstruction (*Yahweh*).
- In-text transformation: the form is overlaid at the word's own size, the modern word dims but stays
  readable, and a form too wide for the word is shown in the card instead of overlapping neighbours.
- Curated glyph morph ([GlyphMorph.jsx](src/components/GlyphMorph.jsx), [morph.js](src/utils/morph.js)):
  real font outlines for Phoenician → Imperial Aramaic → square Hebrew letters, resampled and
  interpolated. A slider scrubs it; reduced motion removes autoplay and keeps a static comparison.
- Words inside Wikipedia links keep the link's behaviour; a separate ◇ button opens their history.
- Selecting an unannotated word says *No verified historical annotation is available for this word yet.*
- Hover and focus both work; Escape dismisses; the pointer can move into cards; bottom sheet on small screens.

## Experimental / not done

- **Review status:** every claim cites a source, but nothing has been reviewed by a specialist.
  Dates are marked approximate where they are. Treat the dataset as a prototype to verify.
- Word matching is exact and case-sensitive within one text node; sense checks use `prefix`/`suffix`.
  (*Genesis* is annotated only in "The name Genesis…"; other mentions are left alone on purpose.)
- Passages are whole paragraphs; the highlight covers the paragraph, not a single sentence.
- No hieroglyph or cuneiform rendering: those forms are shown as transliteration, with a note.
- The glyph morph compares letters across scripts; it does not show an attested spelling of any word.
- Untested in a browser here: the build compiled, but `dompurify` and `opentype.js` need `yarn install`.
- No AI is used. A future provider could suggest candidates, but suggestions would stay unverified.

## Provider interface

[curatedProvider.js](src/services/curatedProvider.js) returns `{ anchors, contexts, entries, sources }`
for an article. Other dictionaries or corpora can be added as providers without touching the UI.
