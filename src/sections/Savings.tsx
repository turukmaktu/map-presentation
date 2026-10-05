import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import { motion } from 'motion/react'
import Section from '../components/Section'
import { savings } from '../content'
import { neon } from '../theme'

export default function Savings() {
  return (
    <Section id="savings" overline="Экономия" title="Почему это выгодно">
      <Grid container spacing={3}>
        {savings.map((s, i) => (
          <Grid key={s.title} size={{ xs: 12, sm: 6, md: i < 3 ? 4 : 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              style={{ height: '100%' }}
            >
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  transition: 'border-color .3s, box-shadow .3s',
                  '&:hover': { borderColor: alpha(neon.green, 0.6), boxShadow: `0 0 24px ${alpha(neon.green, 0.15)}` },
                }}
              >
                <LocalFireDepartmentIcon sx={{ color: '#ff9f43', mb: 1 }} />
                <Typography variant="h6" component="h3" sx={{ mb: 1, fontSize: '1.05rem' }}>
                  {s.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{s.text}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Section>
  )
}
