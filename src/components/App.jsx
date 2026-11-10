import { Container, Typography } from '@mui/material'

import ParagraphStack from './ParagraphStack'
import TalkSection from './TalkSection'

import buildLayers from '../utils/buildLayers'

import genesis from '../../data/genesis.json'
import authors from '../../data/genesis.authors.json'
import translations from '../../data/genesis.layers.json'
import talk from '../../data/genesis.talk.json'

const paragraphs = genesis.paragraphs.map((paragraph, index) => ({
  ...paragraph,
  showSection: index === 0 || genesis.paragraphs[index - 1].section !== paragraph.section,
  layers: buildLayers(paragraph, translations[paragraph.id], authors[paragraph.id])
}))

const App = () => (
  <Container maxWidth="md" sx={{ py: 6 }}>
    {paragraphs.map(({ id, section, showSection, layers }) => (
      <div key={id}>
        {
          showSection
            && (
              <Typography
                variant="h4"
                sx={{ mt: 6, mb: 2 }}
              >
                {section}
              </Typography>
            )
        }
        <ParagraphStack layers={layers} />
      </div>
    ))}
    <Typography
      variant="h4"
      sx={{ mt: 8, mb: 3 }}
    >
      Discussion
    </Typography>
    {talk.sections.map(({ title, comments }) => (
      <TalkSection
        key={title}
        title={title}
        comments={comments}
      />
    ))}
  </Container>
)

export default App
