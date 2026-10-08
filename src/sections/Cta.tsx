import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
// import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import BoltIcon from '@mui/icons-material/Bolt'
// import DownloadIcon from '@mui/icons-material/Download'
// import { techPdf } from '../content'
import { emit, trackSection } from '../lib/analytics'
import { requestFeedback } from '../lib/feedbackBus'
import { glow, neon } from '../theme'

export default function Cta() {
  return (
    <Box component="section" ref={trackSection('cta', 'Призыв к действию')} sx={{ py: { xs: 10, md: 14 }, textAlign: 'center', background: `radial-gradient(ellipse at center, ${alpha(neon.blue, 0.15)}, transparent 65%)` }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 4, textShadow: glow(neon.blue, 1) }}>
          Готов почувствовать силу?
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<BoltIcon />}
            onClick={() => {
              emit('cta_click', { cta_location: 'cta', cta_text: 'Запросить демо', topic: 'Запросить демо' })
              requestFeedback('Запросить демо', 'cta')
            }}
          >
            Запросить демо
          </Button>
          {/* TODO: вернуть, когда появится PDF (и раскомментировать импорты выше)
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
          */}
        </Stack>
      </Container>
    </Box>
  )
}
