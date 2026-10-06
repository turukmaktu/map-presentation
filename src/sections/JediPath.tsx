import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { motion } from 'motion/react'
import HoloFrame from '../components/HoloFrame'
import Section from '../components/Section'
import { steps } from '../content'
import { glow, monoFont, neon } from '../theme'

// Точки маршрута на мини-карте — по одной на этап.
const route = [
  [30, 30], [150, 50], [70, 100], [165, 135], [45, 175], [140, 210], [95, 245],
] as const

const isPortrait = (ratio?: string) => {
  const [w, h] = (ratio ?? '').split('/').map(Number)
  return w < h
}

function RouteMap({ active }: { active: number }) {
  const all = route.map((p) => p.join(',')).join(' ')
  const done = route.slice(0, active + 1).map((p) => p.join(',')).join(' ')
  const [cx, cy] = route[active]

  return (
    <Box component="svg" viewBox="0 0 200 270" sx={{ width: '100%', maxHeight: 300, display: 'block' }} aria-hidden>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={alpha(neon.blue, 0.08)} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="200" height="270" fill="url(#grid)" />
      <polyline points={all} fill="none" stroke={alpha(neon.blue, 0.25)} strokeWidth="2" strokeDasharray="4 6" />
      <polyline points={done} fill="none" stroke={neon.green} strokeWidth="2.5" style={{ filter: `drop-shadow(0 0 4px ${neon.green})`, transition: 'all .4s' }} />
      {route.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={i <= active ? neon.green : neon.paper} stroke={i <= active ? neon.green : alpha(neon.blue, 0.5)} strokeWidth="2" />
      ))}
      <motion.circle r={9} fill="none" stroke="#fff" strokeWidth="2" animate={{ cx, cy }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} style={{ filter: `drop-shadow(0 0 6px ${neon.green})` }} />
    </Box>
  )
}

export default function JediPath() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Активным считается этап, пересекающий середину экрана.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <Section id="path" overline="Путь джедая" title={`От зова Силы до архивов Храма — ${steps.length} шагов`}>
      <Grid container spacing={{ xs: 3, md: 6 }}>
        {/* Липкая навигация: карта маршрута + таймлайн (только десктоп) */}
        <Grid size={{ md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ position: 'sticky', top: 64 }}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <RouteMap active={active} />
            </Paper>
            {steps.map((s, i) => (
              <Box
                key={s.title}
                component="a"
                href={`#step-${i + 1}`}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  py: 0.75,
                  textDecoration: 'none',
                  color: i === active ? neon.green : i < active ? 'text.primary' : 'text.secondary',
                  fontFamily: monoFont,
                  fontSize: 13,
                  transition: 'color .3s',
                }}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span>{s.title}</span>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ position: 'relative', pl: { xs: 4, md: 0 } }}>
            {/* Вертикальная линия-прогресс на мобильных */}
            <Box sx={{ display: { md: 'none' }, position: 'absolute', left: 11, top: 0, bottom: 0, width: 2, bgcolor: alpha(neon.blue, 0.2) }}>
              <Box
                sx={{
                  width: '100%',
                  height: `${((active + 1) / steps.length) * 100}%`,
                  bgcolor: neon.green,
                  boxShadow: glow(neon.green, 0.5),
                  transition: 'height .4s',
                }}
              />
            </Box>
            {steps.map((s, i) => (
              <Box
                key={s.title}
                id={`step-${i + 1}`}
                data-index={i}
                ref={(el: HTMLDivElement | null) => {
                  refs.current[i] = el
                }}
                sx={{ position: 'relative', mb: s.gif || s.video ? { xs: 6, md: 10 } : { xs: 4, md: 6 }, scrollMarginTop: 80 }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: -32,
                    top: 2,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: { xs: 'grid', md: 'none' },
                    placeItems: 'center',
                    fontFamily: monoFont,
                    fontSize: 11,
                    bgcolor: i <= active ? neon.green : neon.paper,
                    color: i <= active ? neon.bg : 'text.secondary',
                    border: `2px solid ${i <= active ? neon.green : alpha(neon.blue, 0.4)}`,
                  }}
                >
                  {i + 1}
                </Box>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontFamily: monoFont, color: neon.green, display: { xs: 'none', md: 'block' } }}>
                      [{String(i + 1).padStart(2, '0')}]
                    </Typography>
                    <Typography variant="h5" component="h3" sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' } }}>
                      {s.title}
                    </Typography>
                    <Chip label={s.system} size="small" variant="outlined" color="primary" sx={{ fontFamily: monoFont }} />
                  </Box>
                  {/* Рамку показываем только когда есть медиа — без пустых заглушек.
                      Вертикальное видео с телефона — узкая рамка, остальные до 600px. */}
                  {(s.gif || s.video) && (
                    <Box sx={s.video ? { maxWidth: isPortrait(s.ratio) ? 320 : 600, mb: 1.5 } : { mb: 1.5 }}>
                      <HoloFrame src={s.gif} video={s.video} ratio={s.ratio} alt={s.title} color={i === active ? neon.green : neon.blue} />
                    </Box>
                  )}
                  <Typography sx={{ color: 'text.secondary' }}>{s.text}</Typography>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Section>
  )
}
