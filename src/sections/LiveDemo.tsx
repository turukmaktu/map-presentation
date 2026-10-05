import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import HoloFrame from '../components/HoloFrame'
import Section from '../components/Section'
import { integrationSteps } from '../content'
import { requestFeedback } from '../lib/feedbackBus'

export default function LiveDemo() {
  return (
    <Section id="demo" overline="Живое демо" title="Потрогать до покупки">
      <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 7 }}>
          {/* TODO: заменить на видеоплеер или ссылку на sandbox-стенд */}
          <HoloFrame alt="Видео-демо" label="Видео-демо скоро" />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
            Как проходит интеграция
          </Typography>
          <Stepper orientation="vertical" activeStep={-1} sx={{ mb: 3 }}>
            {integrationSteps.map((label) => (
              <Step key={label} expanded>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Button variant="contained" color="secondary" size="large" startIcon={<RocketLaunchIcon />} onClick={() => requestFeedback('Развернуть у меня')}>
            Развернуть у меня
          </Button>
        </Grid>
      </Grid>
    </Section>
  )
}
