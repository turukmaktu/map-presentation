import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import BoltIcon from '@mui/icons-material/Bolt'
import DownloadIcon from '@mui/icons-material/Download'
import { techPdf } from '../content'
import { requestFeedback } from '../lib/feedbackBus'
import { glow, neon } from '../theme'

export default function Cta() {
  return (
    <Box component="section" sx={{ py: { xs: 10, md: 14 }, textAlign: 'center', background: `radial-gradient(ellipse at center, ${alpha(neon.blue, 0.15)}, transparent 65%)` }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 4, textShadow: glow(neon.blue, 1) }}>
          Готов почувствовать силу?
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
          <Button variant="contained" size="large" startIcon={<BoltIcon />} onClick={() => requestFeedback('Запросить демо')}>
            Запросить демо
          </Button>
          <Tooltip title={techPdf ? '' : 'Скоро будет'}>
            <span>
              <Button
                variant="outlined"
                size="large"
                startIcon={<DownloadIcon />}
                disabled={!techPdf}
                href={import.meta.env.BASE_URL + (techPdf ?? '')}
                target="_blank"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Скачать тех. описание (PDF)
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Container>
    </Box>
  )
}
