import { useState } from 'react'
import Box from '@mui/material/Box'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { glow, monoFont, neon } from '../theme'

const ranks = ['Youngling', 'Padawan', 'Jedi Knight', 'Jedi Master', 'Grand Master']

// Прогресс скролла как путь от падавана до мастера интеграции.
export default function ForceMeter() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [rank, setRank] = useState(ranks[0])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setRank(ranks[Math.min(ranks.length - 1, Math.floor(v * ranks.length))])
  })

  return (
    <>
      <motion.div
        style={{
          scaleX,
          originX: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          height: 3,
          background: `linear-gradient(90deg, ${neon.blue}, ${neon.green})`,
          boxShadow: glow(neon.green, 0.6),
        }}
      />
      {/* На мобильных — снизу слева, чтобы не перекрывать текст (справа внизу бейдж reCAPTCHA) */}
      <Box
        sx={{
          position: 'fixed',
          zIndex: 1200,
          pointerEvents: 'none',
          top: { md: 10 },
          right: { md: 12 },
          bottom: { xs: 12, md: 'auto' },
          left: { xs: 12, md: 'auto' },
          px: 1.25,
          py: 0.25,
          borderRadius: 1,
          fontFamily: monoFont,
          fontSize: 11,
          color: neon.green,
          bgcolor: 'rgba(5,7,13,0.85)',
          border: `1px solid ${neon.green}44`,
        }}
      >
        Force: {rank}
      </Box>
    </>
  )
}
