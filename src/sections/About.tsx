import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import Section from '../components/Section'
import { about } from '../content'
import { glow, monoFont, neon } from '../theme'

export default function About() {
  return (
    <Section id="about" overline="Кто этот джедай" title={about.name}>
      <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
          {/* TODO: заменить на фото */}
          <Skeleton
            variant="circular"
            animation="wave"
            sx={{ width: 220, height: 220, border: `2px solid ${alpha(neon.blue, 0.5)}`, boxShadow: glow(neon.blue, 1.5) }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack direction="row" spacing={{ xs: 3, md: 6 }} sx={{ mb: 4, flexWrap: 'wrap', rowGap: 2 }}>
            {about.facts.map((f) => (
              <Box key={f.label}>
                <Typography sx={{ fontFamily: monoFont, fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 800, color: neon.green }}>
                  {f.value}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{f.label}</Typography>
              </Box>
            ))}
          </Stack>
          <Box component="blockquote" sx={{ m: 0, pl: 3, borderLeft: `3px solid ${neon.blue}` }}>
            <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' }, fontStyle: 'italic' }}>«{about.quote}»</Typography>
          </Box>
        </Grid>
      </Grid>
    </Section>
  )
}
