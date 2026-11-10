// Writing-system facts, kept separate from word history: a script can serve many languages,
// and a language can use several scripts. Typefaces are never treated as stages.
export const SCRIPT_FACTS = {
  Phnx: { note: 'The Phoenician / Paleo-Hebrew script is a linear alphabet of 22 consonant letters, written right to left. It was used for Phoenician, Hebrew, Moabite and other Canaanite languages. Unicode encodes Paleo-Hebrew with the Phoenician block.', sourceIds: ['wp-phoenician-alphabet', 'wp-unicode-phoenician', 'daniels-bright'] },
  Armi: { note: 'Imperial Aramaic is the Aramaic alphabet as used across the Achaemenid empire. It is the ancestor of the square Hebrew script.', sourceIds: ['wp-aramaic-alphabet', 'daniels-bright'] },
  Hebr: { note: 'The square Hebrew script developed from the Aramaic alphabet and became the standard for Hebrew texts in the Second Temple period. The vowel marks seen in pointed forms were added by medieval scribes (the Masoretes); the consonantal text is older.', sourceIds: ['wp-hebrew-alphabet', 'daniels-bright'] },
  Grek: { note: 'The Greek alphabet was adapted from the Phoenician alphabet and added letters for vowels.', sourceIds: ['daniels-bright'] },
  Latn: { note: 'The Latin alphabet descends from the Greek alphabet via Etruscan.', sourceIds: ['daniels-bright'] },
  Arab: { note: 'The Arabic script is written right to left and developed from the Nabataean form of the Aramaic alphabet.', sourceIds: ['daniels-bright'] },
  Xsux: { note: 'Cuneiform is a script of wedge impressions on clay, used for Sumerian, Akkadian and other languages. This prototype shows transliteration only, because no verified sign sequence is bundled.', sourceIds: ['daniels-bright'] },
  Egyp: { note: 'Egyptian hieroglyphs are not rendered here. Only a transliteration is shown, because no verified sign sequence is bundled.', sourceIds: ['daniels-bright'] }
}

// Letter lineage used by the curated glyph morph: Phoenician -> Imperial Aramaic -> square Hebrew.
// The three stages follow the standard alphabetical order of the three Unicode blocks.
// The shapes compare letters; they do not give an attested spelling of any word.
export const LETTER_STAGES = [
  { id: 'phnx', label: 'Phoenician / Paleo-Hebrew', script: 'Phnx', period: 'c. 1050–1000 BCE onward (approx.)', fontKey: 'phnx', sourceIds: ['wp-phoenician-alphabet', 'daniels-bright'] },
  { id: 'armi', label: 'Imperial Aramaic', script: 'Armi', period: 'c. 6th–4th c. BCE (approx.)', fontKey: 'armi', sourceIds: ['wp-aramaic-alphabet', 'daniels-bright'] },
  { id: 'hebr', label: 'Square Hebrew', script: 'Hebr', period: 'from c. 3rd c. BCE onward (approx.)', fontKey: 'hebr', sourceIds: ['wp-hebrew-alphabet', 'daniels-bright'] }
]

const LETTERS = 'אבגדהוזחטיכלמנסעפצקרשת'
const FINALS = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' }

// Returns the three stage characters for a Hebrew consonant, or undefined for anything else.
export const lettersForConsonant = consonant => {
  const base = FINALS[consonant] ?? consonant
  const index = LETTERS.indexOf(base)
  if (index < 0) return undefined
  return {
    phnx: String.fromCodePoint(0x10900 + index),
    armi: String.fromCodePoint(0x10840 + index),
    hebr: base
  }
}

// Hebrew consonants of a written form, without vowel and cantillation marks.
export const consonantsOf = written => [...written].filter(char => lettersForConsonant(char))
