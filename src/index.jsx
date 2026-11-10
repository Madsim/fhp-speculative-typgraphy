import { createRoot } from 'react-dom/client'

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

import App from './components/App'

import './fonts'
import './fonts/handwriting'
import './fonts/fonts.css'

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-sans)'
  }
})

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
)
