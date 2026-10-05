import Box from '@mui/material/Box'
import { motion } from 'motion/react'
import { glow, neon } from '../theme'

export default function SaberDivider({ color = neon.blue, width = 160 }: { color?: string; width?: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width }}>
      {/* рукоять */}
      <Box sx={{ width: 22, height: 8, borderRadius: 1, bgcolor: '#9aa3b5', flexShrink: 0 }} />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        style={{
          originX: 0,
          height: 4,
          flexGrow: 1,
          borderRadius: 4,
          background: '#fff',
          boxShadow: glow(color, 1.2),
        }}
      />
    </Box>
  )
}
