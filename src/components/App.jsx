import { Container, Typography } from '@mui/material'

import ParagraphStack from './ParagraphStack'

import buildLayers from '../utils/buildLayers'

import genesis from '../../data/genesis.json'
import authors from '../../data/genesis.authors.json'
import translations from '../../data/genesis.layers.json'

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
  </Container>
)

export default App
