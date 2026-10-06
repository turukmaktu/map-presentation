import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { alpha, keyframes } from '@mui/material/styles'
import { monoFont, neon } from '../theme'

const scan = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(400%); }
`

type Props = {
  src?: string
  // Базовое имя видео относительно public/, например 'videos/driver-ways'.
  // Ожидаются файлы <base>.av1.mp4, <base>.h264.mp4, <base>.preview.mp4, <base>.poster.webp.
  video?: string
  ratio?: string
  // Корпус смартфона вокруг экрана — для записей с телефона.
  phone?: boolean
  alt: string
  color?: string
  label?: string
}

// Зацикленное видео без звука: играет только пока видно на экране.
function LoopVideo({ base, alt }: { base: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const url = import.meta.env.BASE_URL + base

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.play().catch(() => {})
      else el.pause()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Box
      component="video"
      ref={ref}
      muted
      loop
      playsInline
      preload="metadata"
      poster={`${url}.poster.webp`}
      aria-label={alt}
      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    >
      <source src={`${url}.preview.mp4`} type="video/mp4" media="(max-width: 600px)" />
      <source src={`${url}.av1.mp4`} type='video/mp4; codecs="av01.0.08M.08"' />
      <source src={`${url}.h264.mp4`} type="video/mp4" />
    </Box>
  )
}

// «Голографическая» рамка: сетка + свечение. Без src/video показывает скелетон.
export default function HoloFrame({ src, video, ratio = '16 / 10', phone, alt, color = neon.blue, label = 'GIF скоро' }: Props) {
  return (
    <Box
      sx={{
        position: 'relative',
        aspectRatio: ratio,
        overflow: 'hidden',
        ...(phone
          ? {
              // Тёмная рамка-корпус + тонкий неоновый контур и свечение снаружи; сетку не рисуем.
              borderRadius: '36px',
              border: '10px solid #05080d',
              boxShadow: `0 0 0 1px ${alpha(color, 0.6)}, 0 0 36px ${alpha(color, 0.35)}, 0 24px 48px rgba(0, 0, 0, 0.5)`,
              bgcolor: '#05080d',
              transition: 'box-shadow .4s',
            }
          : {
              borderRadius: 2,
              border: `1px solid ${alpha(color, 0.5)}`,
              boxShadow: `0 0 24px ${alpha(color, 0.25)}, inset 0 0 32px ${alpha(color, 0.12)}`,
              bgcolor: alpha(color, 0.04),
            }),
        '&::before': phone ? undefined : {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          backgroundImage: `linear-gradient(${alpha(color, 0.07)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(color, 0.07)} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        },
      }}
    >
      {video ? (
        <LoopVideo base={video} alt={alt} />
      ) : src ? (
        <Box
          component="img"
          src={import.meta.env.BASE_URL + src}
          alt={alt}
          loading="lazy"
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <>
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ position: 'absolute', inset: 0, height: '100%', bgcolor: alpha(color, 0.06) }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '25%',
              zIndex: 1,
              background: `linear-gradient(transparent, ${alpha(color, 0.15)}, transparent)`,
              animation: `${scan} 3s linear infinite`,
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          />
          <Typography
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              display: 'grid',
              placeItems: 'center',
              fontFamily: monoFont,
              fontSize: 13,
              color: alpha(color, 0.8),
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </Typography>
        </>
      )}
    </Box>
  )
}
