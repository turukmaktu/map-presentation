import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { alpha, keyframes } from '@mui/material/styles'
import { useReducedMotion } from 'motion/react'
import { monoFont, neon } from '../theme'

const blink = keyframes`50% { opacity: 0; }`

export default function Terminal({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion()
  const full = lines.join('\n')
  const [typed, setTyped] = useState(0)
  const shown = reduce ? full.length : typed

  useEffect(() => {
    if (reduce || typed >= full.length) return
    const id = setTimeout(() => setTyped((n) => n + 1), full[typed] === '\n' ? 350 : 28)
    return () => clearTimeout(id)
  }, [typed, full, reduce])

  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${alpha(neon.green, 0.35)}`,
        boxShadow: `0 0 40px ${alpha(neon.green, 0.15)}`,
        bgcolor: alpha('#000', 0.6),
        backdropFilter: 'blur(6px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, borderBottom: `1px solid ${alpha(neon.green, 0.2)}` }}>
        {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
          <Box key={c} sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: c }} />
        ))}
        <Box sx={{ ml: 1, fontFamily: monoFont, fontSize: 12, color: 'text.secondary' }}>jedi@holocron: ~/logistics</Box>
      </Box>
      <Box
        component="pre"
        aria-label={full}
        sx={{
          m: 0,
          p: 2.5,
          minHeight: { xs: 220, md: 250 },
          fontFamily: monoFont,
          fontSize: { xs: 12, sm: 14 },
          lineHeight: 1.8,
          color: neon.green,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {full.slice(0, shown)}
        <Box component="span" sx={{ animation: `${blink} 1s step-end infinite` }}>
          ▋
        </Box>
      </Box>
    </Box>
  )
}
