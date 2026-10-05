import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { alpha } from '@mui/material/styles'
import { motion } from 'motion/react'
import Section from '../components/Section'
import { stack } from '../content'
import { monoFont, neon } from '../theme'

export default function TechStack() {
  return (
    <Section id="stack" overline="Для тех, кто шарит" title="Технический стек">
      <Paper sx={{ p: { xs: 2.5, md: 4 }, fontFamily: monoFont, fontSize: { xs: 13, md: 15 }, bgcolor: alpha('#000', 0.4) }}>
        <Box sx={{ color: 'text.secondary', mb: 2 }}>{'// jedi.config.ts'}</Box>
        <Box sx={{ color: neon.blue }}>{'export default {'}</Box>
        {stack.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
          >
            <Box sx={{ pl: { xs: 2, md: 4 }, py: 0.75, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Box component="span" sx={{ color: neon.green }}>
                {s.label}:
              </Box>
              <Box component="span" sx={{ color: '#f1d18a' }}>
                "{s.value}"
              </Box>
            </Box>
          </motion.div>
        ))}
        <Box sx={{ color: neon.blue }}>{'}'}</Box>
      </Paper>
    </Section>
  )
}
