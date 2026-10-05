import { alpha, createTheme } from '@mui/material/styles'

export const neon = {
  blue: '#3fa9ff',
  green: '#39ff88',
  red: '#ff3b4e',
  bg: '#05070d',
  paper: '#0b1020',
}

export const monoFont = '"JetBrains Mono", "Fira Code", ui-monospace, monospace'
const sansFont = '"Inter Variable", Inter, system-ui, sans-serif'

export const glow = (color: string, strength = 1) =>
  `0 0 ${6 * strength}px ${alpha(color, 0.8)}, 0 0 ${18 * strength}px ${alpha(color, 0.45)}`

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: neon.blue },
    secondary: { main: neon.green },
    error: { main: neon.red },
    background: { default: neon.bg, paper: neon.paper },
    divider: alpha(neon.blue, 0.15),
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: sansFont,
    h1: { fontFamily: monoFont, fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontFamily: monoFont, fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontFamily: monoFont, fontWeight: 700 },
    h4: { fontFamily: monoFont, fontWeight: 700 },
    h5: { fontFamily: monoFont, fontWeight: 600 },
    h6: { fontFamily: monoFont, fontWeight: 600 },
    overline: { fontFamily: monoFont, letterSpacing: '0.2em' },
    button: { fontFamily: monoFont, fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        body: { overflowX: 'hidden' },
        '::selection': { background: alpha(neon.green, 0.35) },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${alpha(neon.blue, 0.15)}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: 'contained', color: 'primary' },
              style: { boxShadow: glow(neon.blue, 0.8), '&:hover': { boxShadow: glow(neon.blue, 1.4) } },
            },
            {
              props: { variant: 'contained', color: 'secondary' },
              style: { boxShadow: glow(neon.green, 0.8), '&:hover': { boxShadow: glow(neon.green, 1.4) } },
            },
          ],
        },
      },
    },
  },
})
