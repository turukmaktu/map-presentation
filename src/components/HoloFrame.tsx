import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { alpha, keyframes } from '@mui/material/styles'
import { monoFont, neon } from '../theme'

const scan = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(400%); }
`

type Props = { src?: string; alt: string; color?: string; label?: string }

// «Голографическая» рамка: сетка + свечение. Без src показывает скелетон.
export default function HoloFrame({ src, alt, color = neon.blue, label = 'GIF скоро' }: Props) {
  return (
    <Box
      sx={{
        position: 'relative',
        aspectRatio: '16 / 10',
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${alpha(color, 0.5)}`,
        boxShadow: `0 0 24px ${alpha(color, 0.25)}, inset 0 0 32px ${alpha(color, 0.12)}`,
        bgcolor: alpha(color, 0.04),
        '&::before': {
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
      {src ? (
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
