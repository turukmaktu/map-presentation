import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { monoFont } from '../theme'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 4, borderTop: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ fontFamily: monoFont, color: 'text.secondary' }}>
          © {year} OLDSCOOL JEDI DEVELOPMENT
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: monoFont, color: 'text.secondary' }}>
          No SaaS were harmed in the making of this logistics.
        </Typography>
      </Container>
    </Box>
  )
}
