import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import BoltIcon from '@mui/icons-material/Bolt'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { motion } from 'motion/react'
import Terminal from '../components/Terminal'
import { hero } from '../content'
import { emit, trackSection } from '../lib/analytics'
import { requestFeedback } from '../lib/feedbackBus'
import { glow, neon } from '../theme'

// Звёздное небо из радиальных градиентов — без картинок и canvas.
const stars = [
  '12% 18%', '28% 72%', '41% 33%', '57% 81%', '66% 14%', '78% 52%', '89% 27%', '7% 58%', '35% 91%', '93% 86%',
  '50% 50%', '20% 40%', '70% 66%', '84% 8%', '3% 94%',
]
  .map((pos, i) => `radial-gradient(${i % 3 === 0 ? 2 : 1}px ${i % 3 === 0 ? 2 : 1}px at ${pos}, rgba(255,255,255,0.8), transparent)`)
  .join(', ')

export default function Hero() {
  return (
    <Box
      component="header"
      ref={trackSection('hero', 'Первый экран')}
      sx={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        py: { xs: 10, md: 8 },
        background: `${stars}, radial-gradient(ellipse at 20% 0%, ${alpha(neon.blue, 0.18)}, transparent 55%), radial-gradient(ellipse at 90% 100%, ${alpha(neon.green, 0.12)}, transparent 50%)`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 6 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <Typography variant="overline" color="secondary">
                {hero.overline}
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.3rem', sm: '3.2rem', md: '3.8rem' },
                  lineHeight: 1.05,
                  mb: 3,
                  color: '#fff',
                  textShadow: glow(neon.blue, 1.4),
                }}
              >
                {hero.title}
              </Typography>
              <Typography variant="h6" component="p" sx={{ color: neon.green, mb: 2, fontSize: { xs: '1rem', md: '1.15rem' } }}>
                «{hero.slogan}»
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 4, maxWidth: 520, fontSize: '1.05rem' }}>{hero.subtitle}</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<BoltIcon />}
                  onClick={() => {
                    emit('cta_click', { cta_location: 'hero', cta_text: 'Почувствовать силу', topic: 'Запросить демо' })
                    requestFeedback('Запросить демо', 'hero')
                  }}
                >
                  Почувствовать силу
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  endIcon={<KeyboardArrowDownIcon />}
                  href="#path"
                  onClick={() => emit('cta_click', { cta_location: 'hero', cta_text: 'Смотреть как работает' })}
                >
                  Смотреть как работает
                </Button>
              </Stack>
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <Terminal lines={hero.terminal} />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
