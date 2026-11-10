import { createRoot } from 'react-dom/client'

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

import App from './components/App'

import './fonts'
import './fonts/fonts.css'

const theme = createTheme({
  palette: {
    primary: { main: '#1d4f91' },
    secondary: { main: '#2f6f4e' },
    warning: { main: '#b26a00' }
  },
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
