import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import { motion } from 'motion/react'
import Section from '../components/Section'
import { problems } from '../content'
import { neon } from '../theme'

export default function ProblemSolution() {
  return (
    <Section id="problems" overline="Проблема → решение" title="Боль vs Джедай-решение">
      <Stack spacing={2}>
        {problems.map((p, i) => (
          <motion.div
            key={p.pain}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Paper sx={{ p: 2.5, display: 'flex', gap: 1.5, alignItems: 'center', borderColor: alpha(neon.red, 0.35) }}>
                  <CloseIcon sx={{ color: neon.red }} />
                  <Typography sx={{ color: 'text.secondary' }}>{p.pain}</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowForwardIcon sx={{ color: neon.blue, transform: { xs: 'rotate(90deg)', md: 'none' } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Paper
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'center',
                    borderColor: alpha(neon.green, 0.45),
                    bgcolor: alpha(neon.green, 0.05),
                  }}
                >
                  <CheckIcon sx={{ color: neon.green }} />
                  <Typography sx={{ fontWeight: 600 }}>{p.fix}</Typography>
                </Paper>
              </Grid>
            </Grid>
            {i < problems.length - 1 && <Box sx={{ display: { md: 'none' }, height: 8 }} />}
          </motion.div>
        ))}
      </Stack>
    </Section>
  )
}
