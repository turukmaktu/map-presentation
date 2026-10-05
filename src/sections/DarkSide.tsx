import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { motion } from 'motion/react'
import Section from '../components/Section'
import { darkSide } from '../content'
import { glow, neon } from '../theme'

export default function DarkSide() {
  return (
    <Box sx={{ background: `radial-gradient(ellipse at 50% 0%, ${alpha(neon.red, 0.15)}, transparent 60%)` }}>
      <Section id="dark-side" overline="Тёмная сторона" title="Пока другие собирают франкенштейна…" color={neon.red}>
        <Grid container spacing={3}>
          {darkSide.map((d, i) => (
            <Grid key={d.title} size={{ xs: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, rotateX: 30 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ height: '100%' }}
              >
                <Paper sx={{ p: 3, height: '100%', borderColor: alpha(neon.red, 0.4), bgcolor: alpha(neon.red, 0.04) }}>
                  <Typography variant="h6" component="h3" sx={{ color: neon.red, mb: 1, textShadow: glow(neon.red, 0.4) }}>
                    {d.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{d.text}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        <Typography sx={{ mt: 5, fontSize: { xs: '1.1rem', md: '1.3rem' }, maxWidth: 760 }}>
          «Старая школа значит: один разработчик, ноль зависимостей, полный контроль.»{' '}
          <Box component="span" sx={{ color: neon.green }}>
            Сила — в интеграции, а не в подписках.
          </Box>
        </Typography>
      </Section>
    </Box>
  )
}
