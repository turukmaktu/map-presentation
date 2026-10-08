import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { alpha, keyframes } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { emit } from '../lib/analytics'
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

// Полноэкранный просмотр: полное качество (без превью-версии), с панелью управления.
function FullscreenVideo({ base, alt, open, onClose }: { base: string; alt: string; open: boolean; onClose: () => void }) {
  const url = import.meta.env.BASE_URL + base
  return (
    <Dialog fullScreen open={open} onClose={onClose} slotProps={{ paper: { sx: { bgcolor: '#000', backgroundImage: 'none' } } }}>
      <IconButton
        onClick={onClose}
        aria-label="Закрыть"
        sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1, color: '#fff', bgcolor: 'rgba(0, 0, 0, 0.5)', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' } }}
      >
        <CloseIcon />
      </IconButton>
      <Box
        component="video"
        autoPlay
        loop
        controls
        playsInline
        poster={`${url}.poster.webp`}
        aria-label={alt}
        sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      >
        <source src={`${url}.av1.mp4`} type='video/mp4; codecs="av01.0.08M.08"' />
        <source src={`${url}.h264.mp4`} type="video/mp4" />
      </Box>
    </Dialog>
  )
}

// Слой поверх видео: на ховере затемнение и кнопка «play», по клику — полный экран.
function PlayOverlay({ color, onClick }: { color: string; onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-label="Смотреть в полном экране"
      disableRipple
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        cursor: 'pointer',
        transition: 'background-color .3s',
        '& .play': {
          width: 72,
          height: 72,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          color: '#fff',
          bgcolor: alpha(color, 0.25),
          border: `2px solid ${color}`,
          boxShadow: `0 0 24px ${alpha(color, 0.6)}`,
          backdropFilter: 'blur(4px)',
          opacity: 0,
          transform: 'scale(.8)',
          transition: 'opacity .3s, transform .3s',
        },
        '&:hover, &.Mui-focusVisible': { bgcolor: 'rgba(0, 0, 0, 0.35)' },
        '&:hover .play, &.Mui-focusVisible .play': { opacity: 1, transform: 'scale(1)' },
        // На тач-устройствах ховера нет — кнопку показываем всегда, но приглушённо.
        '@media (hover: none)': { '& .play': { opacity: 0.7, transform: 'scale(.7)' } },
      }}
    >
      <Box className="play">
        <PlayArrowIcon sx={{ fontSize: 40 }} />
      </Box>
    </ButtonBase>
  )
}

// «Голографическая» рамка: сетка + свечение. Без src/video показывает скелетон.
export default function HoloFrame({ src, video, ratio = '16 / 10', phone, alt, color = neon.blue, label = 'GIF скоро' }: Props) {
  const [fullscreen, setFullscreen] = useState(false)
  const openedAt = useRef(0)
  const videoName = video?.split('/').pop() ?? ''

  const open = () => {
    openedAt.current = performance.now()
    setFullscreen(true)
    emit('video_open', { video: videoName, step_title: alt })
  }
  const close = () => {
    setFullscreen(false)
    emit('video_close', { video: videoName, step_title: alt, seconds_watched: Math.round((performance.now() - openedAt.current) / 1000) })
  }
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
        <>
          <LoopVideo base={video} alt={alt} />
          <PlayOverlay color={color} onClick={open} />
          <FullscreenVideo base={video} alt={alt} open={fullscreen} onClose={close} />
        </>
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
