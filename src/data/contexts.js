// Passage-level context annotations. A passage here is a whole paragraph, matched by a text
// snippet so the annotation is tied to this revision and never silently moves to other text.
// `quotations` are labelled: original | translation | summary.
const contexts = [
  {
    id: 'c-title',
    blockIncludes: 'The name Genesis is from the Latin Vulgate',
    title: 'Three ancient names for one book',
    summary: 'The book was named in Hebrew, Greek and Latin at different times and places, and each name works differently.',
    connections: [
      { id: 'masoretic', label: 'Hebrew text: the Masoretic tradition', place: 'Tiberias and the wider Jewish world', period: 'early medieval; the Leningrad Codex was copied c. 1008 CE', startYear: 1008, endYear: 1009, status: 'documented', explanation: 'The Hebrew title is the first word of the text. The earliest complete Hebrew Bible manuscript, the Leningrad Codex, is a copy from the early 11th century CE.', sourceIds: ['wlc'] },
      { id: 'alexandria', label: 'Greek translation: Septuagint', place: 'Alexandria, Egypt', period: '3rd–2nd c. BCE', startYear: -250, endYear: -150, status: 'documented', explanation: 'Greek-speaking Jews produced a Greek Torah. Fragments of a Greek Pentateuch survive on papyrus from the 2nd century BCE. A legend (Letter of Aristeas) credits royal sponsorship; its reliability is uncertain.', sourceIds: ['wp-septuagint', 'wp-aristeas'] },
      { id: 'vulgate', label: 'Latin translation: the Vulgate', place: 'Bethlehem and Rome', period: 'late 4th – early 5th c. CE', startYear: 382, endYear: 405, status: 'documented', explanation: 'Jerome translated the Hebrew scriptures into Latin; the Latin title Genesis follows the Greek.', sourceIds: ['wp-vulgate'] }
    ],
    quotations: [
      { kind: 'original', label: 'Original text (Masoretic, Leningrad Codex)', text: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ', language: 'Biblical Hebrew', langTag: 'hbo', script: 'Hebr', dir: 'rtl', reference: 'Genesis 1:1', sourceIds: ['wlc'] },
      { kind: 'translation', label: 'Ancient translation (Septuagint)', text: 'Ἐν ἀρχῇ ἐποίησεν ὁ θεὸς τὸν οὐρανὸν καὶ τὴν γῆν', language: 'Koine Greek', langTag: 'grc', script: 'Grek', dir: 'ltr', reference: 'Genesis 1:1', sourceIds: ['rahlfs'] },
      { kind: 'translation', label: 'Ancient translation (Vulgate)', text: 'In principio creavit Deus caelum et terram', language: 'Latin', langTag: 'la', script: 'Latn', dir: 'ltr', reference: 'Genesis 1:1', sourceIds: ['clementine'] },
      { kind: 'summary', label: 'Present-day summary', text: 'Hebrew names the book by its first word; Greek and Latin name it by what it is about.', language: 'English', langTag: 'en', script: 'Latn', dir: 'ltr', sourceIds: ['wp-genesis'] }
    ]
  },
  {
    id: 'c-composition',
    blockIncludes: 'Tradition credits Moses as the Torah',
    title: 'When Genesis was written',
    summary: 'Tradition names Moses; most scholars date the final text to the period after the Babylonian exile.',
    connections: [
      { id: 'tradition', label: 'Traditional attribution to Moses', place: 'Sinai and the wilderness (as told in the Torah)', period: 'no fixed date', status: 'disputed', explanation: 'Jewish and Christian tradition credits Moses. This is a tradition, and it has no contemporary documentary support.', sourceIds: ['wp-genesis'] },
      { id: 'exile', label: 'Babylonian exile', place: 'Babylon and Judah', period: '586–539 BCE (approx.)', startYear: -586, endYear: -539, status: 'documented', explanation: 'Judah’s elite were deported to Babylonia after the fall of Jerusalem. The exile is the dividing line the article uses for dating.', sourceIds: ['wp-babylonian-captivity'] },
      { id: 'persian', label: 'Persian period composition', place: 'Persian Yehud (Judah)', period: 'c. 539–332 BCE', startYear: -539, endYear: -332, status: 'proposed', explanation: 'Many scholars place the Pentateuch’s final form in the Persian period. Earlier source material is widely assumed, and the dating of each stage is debated.', sourceIds: ['ska', 'carr', 'wp-genesis'] }
    ],
    quotations: [
      { kind: 'summary', label: 'Present-day summary', text: 'The article reports a scholarly consensus that Genesis was composed centuries after Moses’ traditional time. It does not date the sources or the final text exactly.', language: 'English', langTag: 'en', script: 'Latn', dir: 'ltr', sourceIds: ['wp-genesis', 'ska'] }
    ]
  },
  {
    id: 'c-ur',
    blockIncludes: 'Ur of the Chaldeans',
    title: 'Abraham’s “Ur of the Chaldeans”',
    summary: 'The text names a city and a people from different periods, so the place is hard to pin down.',
    connections: [
      { id: 'sumerian-ur', label: 'Sumerian Ur', place: 'Tell el-Muqayyar, southern Iraq', period: 'major city in the 3rd millennium BCE', startYear: -2600, endYear: -2000, status: 'proposed', explanation: 'The usual identification. The city was excavated in the 1920s and 1930s. The article calls the identification tentative.', sourceIds: ['wp-ur', 'woolley', 'wp-genesis'] },
      { id: 'chaldeans', label: 'The Chaldeans', place: 'Southern Mesopotamia', period: 'named in Assyrian records from the 9th c. BCE; Chaldean dynasty 626–539 BCE', startYear: -850, endYear: -539, status: 'documented', explanation: 'The Chaldeans appear in the sources much later than the patriarchal setting. The tension is one reason the identification is uncertain.', sourceIds: ['wp-chaldea'] }
    ],
    quotations: [
      { kind: 'summary', label: 'Present-day summary', text: 'Ur and the Chaldeans are attested in different centuries. The passage may use a later name for an earlier place, or refer to a different city.', language: 'English', langTag: 'en', script: 'Latn', dir: 'ltr', sourceIds: ['wp-ur', 'wp-chaldea'] }
    ]
  }
]

export default contexts
