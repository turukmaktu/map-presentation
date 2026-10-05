import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { motion } from 'motion/react'
import SaberDivider from './SaberDivider'

type Props = {
  id: string
  overline?: string
  title?: ReactNode
  color?: string
  children: ReactNode
}

export default function Section({ id, overline, title, color, children }: Props) {
  return (
    <Box component="section" id={id} sx={{ py: { xs: 8, md: 12 }, scrollMarginTop: 24 }}>
      <Container maxWidth="lg">
        {(overline || title) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            {overline && (
              <Typography variant="overline" sx={{ color: color ?? 'secondary.main' }}>
                {overline}
              </Typography>
            )}
            {title && (
              <Typography variant="h3" component="h2" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, mb: 2 }}>
                {title}
              </Typography>
            )}
            <SaberDivider color={color} />
          </motion.div>
        )}
        <Box sx={{ mt: 5 }}>{children}</Box>
      </Container>
    </Box>
  )
}
