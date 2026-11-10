// Curated word histories. Each entry is a small graph: forms (nodes) connected by typed relations.
// `stages` is the ordered, documented path from the earliest form to the modern word.
// Prototype status: every claim cites a source, but none has had expert review yet.

const LANG_TAGS = {
  'Biblical Hebrew': 'hbo',
  'Ancient Greek': 'grc',
  'Koine Greek': 'grc',
  Latin: 'la',
  English: 'en',
  'Old French': 'fro',
  Arabic: 'ar',
  Akkadian: 'akk',
  Egyptian: 'egy',
  Moabite: 'obm',
  'Proto-Indo-European': 'ine-pro'
}
const RTL_SCRIPTS = ['Hebr', 'Arab', 'Phnx', 'Armi']

const form = (id, written, language, script, meaning, extra = {}) => ({
  id,
  written,
  language,
  langTag: LANG_TAGS[language],
  script,
  dir: RTL_SCRIPTS.includes(script) ? 'rtl' : 'ltr',
  meaning,
  status: 'documented',
  ...extra
})

const rel = (from, to, type, sourceIds, extra = {}) => ({ from, to, type, status: 'documented', sourceIds, ...extra })

const wordHistories = {
  genesis: {
    id: 'genesis',
    headword: 'Genesis',
    senses: [{ id: 'book-title', gloss: 'the title of the first book of the Bible' }],
    originStatus: 'known',
    headline: 'grc',
    stages: ['grc', 'la', 'en'],
    forms: [
      form('grc', 'Γένεσις', 'Ancient Greek', 'Grek', 'origin, coming into being', { translit: 'génesis', dateText: 'Classical Greek, 5th–4th c. BCE (approx.)', dateKind: 'approximate', sourceIds: ['lsj', 'wikt-genesis'] }),
      form('la', 'Genesis', 'Latin', 'Latn', 'title of the book in the Latin Vulgate', { dateText: 'Vulgate, late 4th – early 5th c. CE (approx.)', dateKind: 'approximate', sourceIds: ['wp-vulgate', 'wikt-genesis'] }),
      form('en', 'Genesis', 'English', 'Latn', 'the first book of the Bible', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-genesis'] }),
      form('he', 'בְּרֵאשִׁית', 'Biblical Hebrew', 'Hebr', '“In [the] beginning” — the book’s Hebrew title', { translit: 'bərēʾšīṯ', sourceIds: ['wp-genesis'] })
    ],
    relations: [
      rel('grc', 'la', 'borrowing', ['wikt-genesis']),
      rel('la', 'en', 'borrowing', ['wikt-genesis']),
      rel('he', 'grc', 'unrelated', ['wp-genesis'], { note: 'The Hebrew title names the book by its first word; the Greek title names it by its subject. Neither translates the other.' })
    ],
    claims: [
      { text: 'English Genesis comes from the Latin title in the Vulgate, which took over Greek génesis, “origin”, the book’s title in the Septuagint.', sourceIds: ['wp-genesis', 'wikt-genesis', 'lsj'] }
    ]
  },

  torah: {
    id: 'torah',
    headword: 'Torah',
    senses: [{ id: 'pentateuch', gloss: 'the first five books of the Hebrew Bible' }],
    originStatus: 'known',
    headline: 'he',
    stages: ['he-root', 'he', 'en'],
    forms: [
      form('he-root', 'י־ר־ה', 'Biblical Hebrew', 'Hebr', 'root: to throw, shoot; to direct, teach', { translit: 'y-r-h', status: 'reconstructed', dateText: 'abstract root — not itself attested as a word', sourceIds: ['bdb', 'halot'] }),
      form('he', 'תּוֹרָה', 'Biblical Hebrew', 'Hebr', 'instruction, teaching; law', { translit: 'tōrāh', dateText: 'Hebrew Bible (composed over the 1st millennium BCE; exact earliest use uncertain)', dateKind: 'approximate', sourceIds: ['bdb', 'wikt-torah'] }),
      form('grc', 'νόμος', 'Koine Greek', 'Grek', 'custom, usage, law', { translit: 'nómos', dateText: 'Septuagint, Hellenistic Greek (3rd–2nd c. BCE, approx.)', dateKind: 'approximate', sourceIds: ['wikt-torah', 'lsj'] }),
      form('en-law', 'law', 'English', 'Latn', 'rule enforced by an authority', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-torah'] }),
      form('en', 'Torah', 'English', 'Latn', 'the Pentateuch; Jewish teaching more broadly', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-torah'] })
    ],
    relations: [
      rel('he-root', 'he', 'related', ['bdb', 'halot'], { status: 'reconstructed', note: 'tōrāh is analysed as a noun built on the root y-r-h.' }),
      rel('he', 'en', 'borrowing', ['wikt-torah']),
      rel('he', 'grc', 'translation', ['wikt-torah', 'lsj'], { note: 'The Septuagint usually renders tōrāh with nómos. That is a translation choice, not descent.' }),
      rel('he', 'en-law', 'translation', ['wikt-torah'], { note: '“Law” is the traditional gloss, but tōrāh covers “instruction” more broadly. The meanings only partly overlap.' })
    ],
    claims: [
      { text: 'English Torah is borrowed directly from Hebrew tōrāh, “instruction, teaching”.', sourceIds: ['wikt-torah', 'bdb'] },
      { text: 'The Greek Septuagint translated it nómos, “law”. That translation, not an ancestry, is why “law” became its usual English gloss.', sourceIds: ['wikt-torah', 'lsj'] }
    ]
  },

  pentateuch: {
    id: 'pentateuch',
    headword: 'Pentateuch',
    senses: [{ id: 'five-books', gloss: 'the first five books of the Bible' }],
    originStatus: 'known',
    headline: 'grc',
    stages: ['grc', 'la', 'en'],
    forms: [
      form('grc', 'πεντάτευχος', 'Koine Greek', 'Grek', 'five-volumed (work)', { translit: 'pentáteuchos', dateText: 'Greek Christian writers, 2nd–3rd c. CE (approx.)', dateKind: 'approximate', sourceIds: ['wikt-pentateuch', 'lsj'] }),
      form('grc-five', 'πέντε', 'Ancient Greek', 'Grek', 'five', { translit: 'pénte', sourceIds: ['wikt-pentateuch', 'wikt-five'] }),
      form('grc-teuchos', 'τεῦχος', 'Ancient Greek', 'Grek', 'implement, vessel; later also a scroll-case or volume', { translit: 'teûchos', sourceIds: ['wikt-pentateuch', 'lsj'] }),
      form('pie', '*pénkʷe', 'Proto-Indo-European', 'Latn', 'five', { status: 'reconstructed', dateText: 'reconstructed; not attested in writing', sourceIds: ['wikt-five'] }),
      form('la', 'Pentateuchus', 'Latin', 'Latn', 'the five books (of Moses)', { dateText: 'Late Latin, Christian writers', dateKind: 'approximate', sourceIds: ['wikt-pentateuch'] }),
      form('en-five', 'five', 'English', 'Latn', 'the number 5', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-five'] }),
      form('en', 'Pentateuch', 'English', 'Latn', 'the first five books of the Bible', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-pentateuch'] })
    ],
    relations: [
      rel('grc-five', 'grc', 'related', ['wikt-pentateuch'], { note: 'First element of the compound.' }),
      rel('grc-teuchos', 'grc', 'related', ['wikt-pentateuch'], { note: 'Second element of the compound.' }),
      rel('grc', 'la', 'borrowing', ['wikt-pentateuch']),
      rel('la', 'en', 'borrowing', ['wikt-pentateuch']),
      rel('pie', 'grc-five', 'ancestor', ['wikt-five'], { status: 'reconstructed' }),
      rel('grc-five', 'en-five', 'cognate', ['wikt-five'], { status: 'reconstructed', note: 'English five and Greek pénte share the reconstructed ancestor *pénkʷe; neither comes from the other.' })
    ],
    claims: [
      { text: 'Pentateuch is a Greek compound: pénte, “five”, plus teûchos, here “volume”. English took it from Late Latin.', sourceIds: ['wikt-pentateuch', 'lsj'] }
    ]
  },

  septuagint: {
    id: 'septuagint',
    headword: 'Septuagint',
    senses: [{ id: 'greek-bible', gloss: 'the ancient Greek translation of the Hebrew scriptures' }],
    originStatus: 'known',
    headline: 'la',
    stages: ['la', 'en'],
    forms: [
      form('la', 'septuāgintā', 'Latin', 'Latn', 'seventy', { sourceIds: ['wikt-septuagint'] }),
      form('grc', 'Ἑβδομήκοντα', 'Koine Greek', 'Grek', 'seventy (“the Seventy”)', { translit: 'Hebdomḗkonta', sourceIds: ['wp-septuagint', 'lsj'] }),
      form('en', 'Septuagint', 'English', 'Latn', 'the Greek translation of the Hebrew scriptures', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-septuagint'] })
    ],
    relations: [
      rel('la', 'en', 'borrowing', ['wikt-septuagint']),
      rel('la', 'grc', 'translation', ['wp-septuagint'], { note: 'Both mean “seventy”; the Greek name is not the source of the English word.' })
    ],
    claims: [
      { text: 'The name is Latin for “seventy”, after the tradition that about seventy translators produced the Greek version (the Letter of Aristeas). That tradition is a legend of uncertain reliability.', sourceIds: ['wikt-septuagint', 'wp-septuagint', 'wp-aristeas'] }
    ]
  },

  covenant: {
    id: 'covenant',
    headword: 'covenant',
    senses: [{ id: 'agreement', gloss: 'a binding agreement between God and a people' }],
    originStatus: 'known',
    headline: 'la',
    stages: ['la', 'fro', 'en'],
    forms: [
      form('la', 'convenīre', 'Latin', 'Latn', 'to come together, to agree', { sourceIds: ['wikt-covenant'] }),
      form('fro', 'covenant', 'Old French', 'Latn', 'agreement, pact', { sourceIds: ['wikt-covenant'] }),
      form('en', 'covenant', 'English', 'Latn', 'a binding agreement', { dateText: 'Middle English onward', dateKind: 'approximate', sourceIds: ['wikt-covenant'] }),
      form('he', 'בְּרִית', 'Biblical Hebrew', 'Hebr', 'covenant, treaty, alliance', { translit: 'bərîṯ', sourceIds: ['bdb'] }),
      form('grc', 'διαθήκη', 'Koine Greek', 'Grek', 'arrangement, will; (Septuagint) covenant', { translit: 'diathḗkē', dateText: 'Septuagint (3rd–2nd c. BCE, approx.)', dateKind: 'approximate', sourceIds: ['lsj'] })
    ],
    relations: [
      rel('la', 'fro', 'ancestor', ['wikt-covenant']),
      rel('fro', 'en', 'borrowing', ['wikt-covenant']),
      rel('he', 'grc', 'translation', ['lsj', 'bdb'], { note: 'The Septuagint renders bərîṯ with diathḗkē.' }),
      rel('he', 'en', 'translation', ['bdb'], { note: 'English covenant is the customary translation of bərîṯ. The two words are not related by descent.' })
    ],
    claims: [
      { text: 'English covenant comes through Old French from Latin convenīre, “to come together, agree”.', sourceIds: ['wikt-covenant'] },
      { text: 'The Hebrew word it conventionally translates, bərîṯ, is not its ancestor. The Septuagint rendered bərîṯ with Greek diathḗkē.', sourceIds: ['bdb', 'lsj'] }
    ]
  },

  hebrew: {
    id: 'hebrew',
    headword: 'Hebrew',
    senses: [{ id: 'language-people', gloss: 'the Hebrew language, and the people who spoke it' }],
    originStatus: 'disputed',
    originNote: 'The earlier history of the Hebrew name is debated.',
    headline: 'he',
    stages: ['he', 'grc', 'la', 'en'],
    forms: [
      form('he-root', 'ע־ב־ר', 'Biblical Hebrew', 'Hebr', 'root: to cross over, pass beyond', { translit: 'ʿ-b-r', status: 'proposed', sourceIds: ['bdb', 'halot'] }),
      form('he', 'עִבְרִי', 'Biblical Hebrew', 'Hebr', 'Hebrew (a person or the people)', { translit: 'ʿivrî', sourceIds: ['bdb', 'wikt-hebrew'] }),
      form('grc', 'Ἑβραῖος', 'Ancient Greek', 'Grek', 'Hebrew', { translit: 'Hebraîos', sourceIds: ['wikt-hebrew', 'lsj'] }),
      form('la', 'Hebraeus', 'Latin', 'Latn', 'Hebrew', { sourceIds: ['wikt-hebrew'] }),
      form('en', 'Hebrew', 'English', 'Latn', 'the Hebrew language or people', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-hebrew'] }),
      form('habiru', 'ʿapiru / Ḫabiru', 'Akkadian', 'Xsux', 'a social class named in Bronze and Iron Age texts', { translit: 'ʿapiru', status: 'disputed', dateText: 'Bronze Age texts (2nd millennium BCE)', dateKind: 'approximate', sourceIds: ['wp-habiru'] })
    ],
    relations: [
      rel('he', 'grc', 'borrowing', ['wikt-hebrew'], { note: 'Usually explained as passing through Aramaic.' }),
      rel('grc', 'la', 'borrowing', ['wikt-hebrew']),
      rel('la', 'en', 'borrowing', ['wikt-hebrew']),
      rel('he-root', 'he', 'related', ['bdb', 'halot'], { status: 'proposed' }),
      rel('habiru', 'he', 'related', ['wp-habiru', 'halot'], { status: 'disputed', note: 'Some scholars connect the ʿapiru with the Hebrews; others reject it.' })
    ],
    branches: [
      { id: 'across', label: 'From ʿ-b-r, “to cross over”', status: 'proposed', summary: 'Often linked to ʿēber, “the region beyond”, so “those from the other side”.', formIds: ['he-root'], sourceIds: ['bdb', 'halot'] },
      { id: 'habiru', label: 'Connection with the ʿapiru / Habiru', status: 'disputed', summary: 'Scholars disagree whether the two names are related. The ʿapiru were a social class named across many regions, not a single people.', formIds: ['habiru'], sourceIds: ['wp-habiru', 'halot'] }
    ],
    claims: [
      { text: 'The English word runs Hebrew → Greek Hebraîos → Latin Hebraeus → English. The origin of the Hebrew name itself is disputed.', sourceIds: ['wikt-hebrew', 'halot'] }
    ]
  },

  moses: {
    id: 'moses',
    headword: 'Moses',
    senses: [{ id: 'name', gloss: 'the name of the leader in the Exodus story' }],
    originStatus: 'disputed',
    originNote: 'Two explanations compete; neither is settled.',
    headline: 'he',
    stages: ['he', 'grc', 'la', 'en'],
    forms: [
      form('he', 'מֹשֶׁה', 'Biblical Hebrew', 'Hebr', 'Moses', { translit: 'Mōšeh', sourceIds: ['bdb', 'wikt-moses'] }),
      form('he-mashah', 'מָשָׁה', 'Biblical Hebrew', 'Hebr', 'to draw out', { translit: 'māšāh', sourceIds: ['bdb'] }),
      form('egy', 'ms(j)', 'Egyptian', 'Egyp', 'to be born; child', { translit: 'ms(j)', status: 'proposed', dateText: 'transliteration only; hieroglyphic form not shown', sourceIds: ['wp-moses', 'wikt-moses'] }),
      form('grc', 'Μωυσῆς', 'Koine Greek', 'Grek', 'Moses', { translit: 'Mōusês', dateText: 'Septuagint (3rd–2nd c. BCE, approx.)', dateKind: 'approximate', sourceIds: ['wikt-moses', 'lsj'] }),
      form('la', 'Moyses', 'Latin', 'Latn', 'Moses', { dateText: 'Vulgate', sourceIds: ['wikt-moses'] }),
      form('en', 'Moses', 'English', 'Latn', 'Moses', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-moses'] })
    ],
    relations: [
      rel('he', 'grc', 'borrowing', ['wikt-moses']),
      rel('grc', 'la', 'borrowing', ['wikt-moses']),
      rel('la', 'en', 'borrowing', ['wikt-moses']),
      rel('he-mashah', 'he', 'related', ['bdb'], { note: 'The biblical text itself explains the name by this verb (Exodus 2:10). That is the narrator’s wordplay, not necessarily the linguistic origin.' }),
      rel('egy', 'he', 'related', ['wp-moses'], { status: 'proposed', note: 'Proposed Egyptian source, compared with the second element of names such as Thutmose.' })
    ],
    branches: [
      { id: 'biblical', label: 'The Bible’s own explanation: “drawn out”', status: 'documented', summary: 'Exodus 2:10 links the name to Hebrew māšāh, “to draw out”.', formIds: ['he-mashah'], sourceIds: ['bdb'] },
      { id: 'egyptian', label: 'An Egyptian word for “child”', status: 'proposed', summary: 'Many scholars compare the name with Egyptian ms(j), “born; child”.', formIds: ['egy'], sourceIds: ['wp-moses', 'wikt-moses'] }
    ],
    claims: [
      { text: 'The English name passes Hebrew Mōšeh → Greek Mōusês → Latin Moyses → English. Its deeper origin has two competing explanations.', sourceIds: ['wikt-moses', 'wp-moses'] }
    ]
  },

  adam: {
    id: 'adam',
    headword: 'Adam',
    senses: [{ id: 'first-man', gloss: 'the name of the first man in Genesis' }],
    originStatus: 'disputed',
    originNote: 'The link with “ground” is widely noted; the deeper root is uncertain.',
    headline: 'he',
    stages: ['he', 'grc', 'la', 'en'],
    forms: [
      form('he', 'אָדָם', 'Biblical Hebrew', 'Hebr', 'human being, humankind; the name Adam', { translit: 'ʾādām', sourceIds: ['bdb', 'wikt-adam'] }),
      form('he-adamah', 'אֲדָמָה', 'Biblical Hebrew', 'Hebr', 'ground, soil', { translit: 'ʾădāmāh', sourceIds: ['bdb'] }),
      form('grc', 'Ἀδάμ', 'Koine Greek', 'Grek', 'Adam', { translit: 'Adám', sourceIds: ['wikt-adam', 'lsj'] }),
      form('la', 'Adam', 'Latin', 'Latn', 'Adam', { sourceIds: ['wikt-adam'] }),
      form('en', 'Adam', 'English', 'Latn', 'the first man', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-adam'] })
    ],
    relations: [
      rel('he', 'grc', 'borrowing', ['wikt-adam']),
      rel('grc', 'la', 'borrowing', ['wikt-adam']),
      rel('la', 'en', 'borrowing', ['wikt-adam']),
      rel('he-adamah', 'he', 'related', ['bdb'], { status: 'proposed', note: 'Genesis 2:7 plays on the two words. Whether they share a root is debated.' })
    ],
    claims: [
      { text: 'In this article Adam is a proper name. In Biblical Hebrew ʾādām is also the ordinary word for “human being”, and Genesis plays on its likeness to ʾădāmāh, “ground”.', sourceIds: ['bdb', 'wikt-adam'] }
    ]
  },

  elohim: {
    id: 'elohim',
    headword: 'Elohim',
    senses: [{ id: 'god-gods', gloss: 'the Hebrew word for God (or gods)' }],
    originStatus: 'known',
    headline: 'he',
    stages: ['he-eloah', 'he', 'en'],
    forms: [
      form('he-eloah', 'אֱלוֹהַּ', 'Biblical Hebrew', 'Hebr', 'god', { translit: 'ʾĕlôah', sourceIds: ['bdb'] }),
      form('he', 'אֱלֹהִים', 'Biblical Hebrew', 'Hebr', 'God; gods (plural in form)', { translit: 'ʾĕlōhîm', sourceIds: ['bdb', 'wikt-elohim'] }),
      form('ar', 'إله', 'Arabic', 'Arab', 'god', { translit: 'ʾilāh', sourceIds: ['halot'] }),
      form('en', 'Elohim', 'English', 'Latn', 'the Hebrew word for God, used in English', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-elohim'] }),
      form('en-god', 'God', 'English', 'Latn', 'the deity of the Bible', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-elohim'] })
    ],
    relations: [
      rel('he-eloah', 'he', 'related', ['bdb'], { note: 'ʾĕlōhîm has the plural ending; it takes singular verbs when it means the one God.' }),
      rel('he', 'en', 'borrowing', ['wikt-elohim']),
      rel('he-eloah', 'ar', 'cognate', ['halot'], { status: 'reconstructed', note: 'Both descend from a shared Semitic ancestor.' }),
      rel('he', 'en-god', 'translation', ['wikt-elohim'], { note: 'English “God” is the customary translation. It has Germanic ancestry and is unrelated to the Hebrew word.' })
    ],
    claims: [
      { text: 'Elohim is Hebrew, plural in form. The article notes it is the generic Hebrew word for “gods”, rendered as “God” in English.', sourceIds: ['bdb', 'wikt-elohim'] }
    ]
  },

  yahweh: {
    id: 'yahweh',
    headword: 'Yahweh',
    senses: [{ id: 'divine-name', gloss: 'the personal name of God in the Hebrew Bible' }],
    originStatus: 'disputed',
    originNote: 'The pronunciation “Yahweh” is a scholarly reconstruction.',
    headline: 'phnx',
    stages: ['phnx', 'he', 'en'],
    forms: [
      form('phnx', '𐤉𐤄𐤅𐤄', 'Moabite', 'Phnx', 'the divine name, four consonants', { translit: 'YHWH', dateText: 'Mesha Stele, c. 840 BCE (approx.)', dateKind: 'approximate', sourceIds: ['wp-mesha', 'wp-tetragrammaton'], note: 'The Mesha Stele is written in Moabite, in the Paleo-Hebrew script. The language is Moabite and the script is Phoenician/Paleo-Hebrew.' }),
      form('he', 'יהוה', 'Biblical Hebrew', 'Hebr', 'the divine name (consonants only)', { translit: 'YHWH', sourceIds: ['wp-tetragrammaton'] }),
      form('he-adonai', 'אֲדֹנָי', 'Biblical Hebrew', 'Hebr', 'my lord — read aloud in place of the name', { translit: 'ʾăḏōnāy', sourceIds: ['wp-tetragrammaton'] }),
      form('grc', 'Κύριος', 'Koine Greek', 'Grek', 'lord', { translit: 'Kýrios', dateText: 'Septuagint (3rd–2nd c. BCE, approx.)', dateKind: 'approximate', sourceIds: ['wp-tetragrammaton', 'wp-septuagint'] }),
      form('en-lord', 'LORD', 'English', 'Latn', 'English translation convention for the name', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wp-tetragrammaton'] }),
      form('en', 'Yahweh', 'English', 'Latn', 'scholarly reconstruction of the name’s pronunciation', { status: 'reconstructed', dateText: 'reconstructed; the vowels are not written in the name', sourceIds: ['wp-tetragrammaton'] })
    ],
    relations: [
      rel('phnx', 'he', 'related', ['wp-tetragrammaton', 'wp-mesha'], { note: 'The same four consonants, first written in Paleo-Hebrew script and later in square Hebrew script. This is a script change, not a language change.' }),
      rel('he', 'en', 'related', ['wp-tetragrammaton'], { status: 'reconstructed', note: 'The vowels of “Yahweh” are inferred; the Hebrew text writes only consonants.' }),
      rel('he-adonai', 'grc', 'translation', ['wp-tetragrammaton'], { note: 'Both mean “lord” and stand in for the divine name.' }),
      rel('he', 'en-lord', 'translation', ['wp-tetragrammaton'], { note: 'English Bibles often print LORD in small capitals for the name.' })
    ],
    branches: [
      { id: 'mesha', label: 'Mesha Stele, c. 840 BCE', status: 'documented', summary: 'A securely read early inscription that contains the name.', formIds: ['phnx'], sourceIds: ['wp-mesha'] },
      { id: 'shasu', label: 'Possible earlier Egyptian references', status: 'disputed', summary: 'Some scholars connect an Egyptian place-name “Yhw” in the land of the Shasu with the divine name. The reading is disputed.', formIds: [], sourceIds: ['wp-tetragrammaton'] }
    ],
    claims: [
      { text: 'The name is written with four consonants (YHWH). “Yahweh” is a modern reconstruction of how it was pronounced.', sourceIds: ['wp-tetragrammaton'] }
    ]
  },

  canaan: {
    id: 'canaan',
    headword: 'Canaan',
    senses: [{ id: 'land', gloss: 'the land and people of the southern Levant' }],
    originStatus: 'unknown',
    originNote: 'Researched, and the origin of the name is unknown. Proposals exist, but none is established.',
    headline: 'akk',
    stages: ['akk', 'he', 'grc', 'la', 'en'],
    forms: [
      form('akk', 'Kinaḫni', 'Akkadian', 'Xsux', 'Canaan (land and people)', { translit: 'Kinaḫni', dateText: 'Amarna letters, 14th c. BCE (approx.)', dateKind: 'earliest-evidence', sourceIds: ['wp-amarna', 'wp-canaan'], note: 'Shown as transliteration; no verified cuneiform sign sequence is bundled.' }),
      form('he', 'כְּנַעַן', 'Biblical Hebrew', 'Hebr', 'Canaan', { translit: 'Kənaʿan', sourceIds: ['bdb', 'wikt-canaan'] }),
      form('grc', 'Χαναάν', 'Koine Greek', 'Grek', 'Canaan', { translit: 'Chanaán', dateText: 'Septuagint (3rd–2nd c. BCE, approx.)', dateKind: 'approximate', sourceIds: ['wikt-canaan', 'lsj'] }),
      form('la', 'Chanaan', 'Latin', 'Latn', 'Canaan', { dateText: 'Vulgate', sourceIds: ['wikt-canaan'] }),
      form('en', 'Canaan', 'English', 'Latn', 'Canaan', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-canaan'] })
    ],
    relations: [
      rel('akk', 'he', 'related', ['wp-canaan'], { note: 'The same place-name in two languages; the exact route between the forms is not established.' }),
      rel('he', 'grc', 'borrowing', ['wikt-canaan']),
      rel('grc', 'la', 'borrowing', ['wikt-canaan']),
      rel('la', 'en', 'borrowing', ['wikt-canaan'])
    ],
    branches: [
      { id: 'purple', label: 'A link with “purple”', status: 'proposed', summary: 'A proposed connection with the purple-dye trade of the coast. It is debated and not established.', formIds: [], sourceIds: ['wp-canaan'] },
      { id: 'idrimi', label: 'Earlier attestation at Alalakh', status: 'disputed', summary: 'The inscription of Idrimi of Alalakh is sometimes cited as an earlier mention. Its date is debated, so the Amarna letters are shown as the earliest firmly dated evidence here.', formIds: [], sourceIds: ['wp-idrimi'] }
    ],
    claims: [
      { text: 'The name is attested in Akkadian texts of the 14th century BCE (the Amarna letters). Its origin is unknown.', sourceIds: ['wp-amarna', 'wp-canaan'] }
    ]
  },

  egypt: {
    id: 'egypt',
    headword: 'Egypt',
    senses: [{ id: 'country', gloss: 'the land of the Nile' }],
    originStatus: 'disputed',
    originNote: 'The Egyptian source of the Greek name is proposed, not proven.',
    headline: 'grc',
    stages: ['egy', 'grc', 'la', 'en'],
    forms: [
      form('egy', 'ḥwt-kꜣ-ptḥ', 'Egyptian', 'Egyp', 'mansion of the ka of Ptah (a name of Memphis)', { translit: 'ḥwt-kꜣ-ptḥ', status: 'proposed', dateText: 'transliteration only; hieroglyphic form not shown', sourceIds: ['wikt-egypt'] }),
      form('grc', 'Αἴγυπτος', 'Ancient Greek', 'Grek', 'Egypt', { translit: 'Aígyptos', dateText: 'Homeric Greek, c. 8th c. BCE (approx.)', dateKind: 'approximate', sourceIds: ['wikt-egypt', 'lsj'] }),
      form('la', 'Aegyptus', 'Latin', 'Latn', 'Egypt', { sourceIds: ['wikt-egypt'] }),
      form('en', 'Egypt', 'English', 'Latn', 'the country', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-egypt'] }),
      form('he', 'מִצְרַיִם', 'Biblical Hebrew', 'Hebr', 'Egypt', { translit: 'Miṣrayim', sourceIds: ['bdb'] }),
      form('ar', 'مصر', 'Arabic', 'Arab', 'Egypt', { translit: 'Miṣr', sourceIds: ['bdb'] })
    ],
    relations: [
      rel('egy', 'grc', 'borrowing', ['wikt-egypt'], { status: 'proposed', note: 'A commonly cited but unproven source for the Greek name.' }),
      rel('grc', 'la', 'borrowing', ['wikt-egypt']),
      rel('la', 'en', 'borrowing', ['wikt-egypt']),
      rel('he', 'en', 'unrelated', ['bdb', 'wikt-egypt'], { note: 'Hebrew Miṣrayim and English Egypt name the same land but have separate origins.' }),
      rel('he', 'ar', 'cognate', ['bdb'], { status: 'reconstructed', note: 'Hebrew Miṣrayim and Arabic Miṣr share a Semitic ancestor.' })
    ],
    claims: [
      { text: 'English Egypt comes from Latin Aegyptus and Greek Aígyptos. A link to Egyptian ḥwt-kꜣ-ptḥ (“mansion of the ka of Ptah”) is proposed. The Hebrew name Miṣrayim is unrelated to the English word.', sourceIds: ['wikt-egypt', 'bdb'] }
    ]
  },

  vulgate: {
    id: 'vulgate',
    headword: 'Vulgate',
    senses: [{ id: 'latin-bible', gloss: 'the late-4th-century Latin translation of the Bible' }],
    originStatus: 'known',
    headline: 'la-vulgus',
    stages: ['la-vulgus', 'la', 'en'],
    forms: [
      form('la-vulgus', 'vulgus', 'Latin', 'Latn', 'the common people, the crowd', { sourceIds: ['wikt-vulgate', 'wikt-vulgar'] }),
      form('la', 'vulgāta', 'Latin', 'Latn', '(editio vulgāta) the commonly used edition', { sourceIds: ['wikt-vulgate', 'wp-vulgate'] }),
      form('en', 'Vulgate', 'English', 'Latn', 'the Latin Bible', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-vulgate'] }),
      form('en-vulgar', 'vulgar', 'English', 'Latn', 'crude; formerly “of the common people”', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wikt-vulgar'] })
    ],
    relations: [
      rel('la-vulgus', 'la', 'related', ['wikt-vulgate']),
      rel('la', 'en', 'borrowing', ['wikt-vulgate']),
      rel('la-vulgus', 'en-vulgar', 'related', ['wikt-vulgar'], { note: 'English vulgar also comes from this Latin source. Its meaning shifted from “common” to “coarse”.' })
    ],
    claims: [
      { text: 'Vulgate is “the common (edition)”, from Latin vulgus, “the common people”. The same source gave English vulgar, whose meaning later drifted from “common” to “crude”.', sourceIds: ['wikt-vulgate', 'wikt-vulgar'] }
    ]
  },

  toledot: {
    id: 'toledot',
    headword: 'toledot',
    senses: [{ id: 'formula', gloss: 'the “these are the generations” formula that structures Genesis' }],
    originStatus: 'known',
    headline: 'he',
    stages: ['he-yld', 'he', 'en'],
    forms: [
      form('he-yld', 'י־ל־ד', 'Biblical Hebrew', 'Hebr', 'root: to bear, give birth', { translit: 'y-l-d', status: 'reconstructed', dateText: 'abstract root — not itself attested as a word', sourceIds: ['bdb', 'halot'] }),
      form('he', 'תּוֹלְדוֹת', 'Biblical Hebrew', 'Hebr', 'generations; descendants; a genealogical account', { translit: 'tôləḏôṯ', sourceIds: ['bdb'] }),
      form('en', 'toledot', 'English', 'Latn', 'the Hebrew term, used by scholars of Genesis', { dateText: 'Modern scholarly English', dateKind: 'modern', sourceIds: ['wp-genesis'] })
    ],
    relations: [
      rel('he-yld', 'he', 'related', ['bdb', 'halot'], { status: 'reconstructed' }),
      rel('he', 'en', 'borrowing', ['wp-genesis'])
    ],
    claims: [
      { text: 'Toledot is the Hebrew noun for “generations”, built on the root y-l-d, “to bear”. Scholars use it as the name of the formula that marks the book’s sections.', sourceIds: ['bdb', 'wp-genesis'] }
    ]
  },

  bereshit: {
    id: 'bereshit',
    headword: 'bereshit',
    senses: [{ id: 'first-word', gloss: 'the first word of Genesis, which gives the book its Hebrew name' }],
    originStatus: 'known',
    headline: 'he',
    stages: ['he-rosh', 'he', 'en'],
    forms: [
      form('he-rosh', 'רֹאשׁ', 'Biblical Hebrew', 'Hebr', 'head', { translit: 'rōʾš', sourceIds: ['bdb'] }),
      form('he', 'בְּרֵאשִׁית', 'Biblical Hebrew', 'Hebr', 'in [the] beginning', { translit: 'bərēʾšīṯ', sourceIds: ['bdb', 'wlc'] }),
      form('grc', 'Ἐν ἀρχῇ', 'Koine Greek', 'Grek', 'in [the] beginning', { translit: 'En archê', dateText: 'Septuagint (3rd–2nd c. BCE, approx.)', dateKind: 'approximate', sourceIds: ['rahlfs'] }),
      form('la', 'In principio', 'Latin', 'Latn', 'in [the] beginning', { dateText: 'Vulgate', sourceIds: ['clementine'] }),
      form('en', 'bereshit', 'English', 'Latn', 'the Hebrew word, transliterated', { dateText: 'Modern English', dateKind: 'modern', sourceIds: ['wp-genesis'] })
    ],
    relations: [
      rel('he-rosh', 'he', 'related', ['bdb'], { note: 'rēʾšīt, “beginning”, is derived from rōʾš, “head”; the prefix bə- means “in”.' }),
      rel('he', 'en', 'borrowing', ['wp-genesis']),
      rel('he', 'grc', 'translation', ['rahlfs']),
      rel('he', 'la', 'translation', ['clementine'])
    ],
    claims: [
      { text: 'Bereshit is the prefix bə-, “in”, plus rēʾšīt, “beginning”, which comes from rōʾš, “head”. The Septuagint and the Vulgate translate it (En archê, In principio); they are translations, not descendants.', sourceIds: ['bdb', 'rahlfs', 'clementine'] }
    ]
  }
}

export default wordHistories
