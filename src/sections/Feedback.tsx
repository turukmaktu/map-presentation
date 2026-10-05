import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SendIcon from '@mui/icons-material/Send'
import Section from '../components/Section'
import { feedbackTopics, type FeedbackTopic } from '../content'
import { onFeedbackRequest } from '../lib/feedbackBus'
import { getRecaptchaToken, loadRecaptcha } from '../lib/recaptcha'

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
const endpoint = import.meta.env.VITE_FEEDBACK_ENDPOINT
const configured = Boolean(siteKey && endpoint)

type Form = {
  name: string
  contact: string
  company: string
  topic: FeedbackTopic
  message: string
  website: string // honeypot: люди его не видят, боты заполняют
}

const empty: Form = { name: '', contact: '', company: '', topic: 'Запросить демо', message: '', website: '' }

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string }

export default function Feedback() {
  const [form, setForm] = useState<Form>(empty)
  const [consent, setConsent] = useState(false)
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  useEffect(() => onFeedbackRequest((topic) => setForm((f) => ({ ...f, topic }))), [])

  useEffect(() => {
    if (siteKey) loadRecaptcha(siteKey).catch(() => {})
  }, [])

  const set = (key: keyof Form) => (e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const errors = {
    name: !form.name.trim() ? 'Как к вам обращаться?' : '',
    contact: !form.contact.trim() ? 'Email, телефон или Telegram' : '',
    message: form.message.trim().length < 10 ? 'Хотя бы пару слов (от 10 символов)' : '',
  }
  const valid = !errors.name && !errors.contact && !errors.message && consent

  async function submit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!valid || !configured) return

    setStatus({ kind: 'sending' })
    try {
      const token = await getRecaptchaToken(siteKey!, 'feedback')
      // text/plain — «простой» запрос без CORS-preflight, который Apps Script не поддерживает
      const res = await fetch(endpoint!, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...form, token, page: location.href }),
      })
      const data: { ok: boolean; error?: string } = await res.json()
      if (!data.ok) throw new Error(data.error === 'captcha' ? 'Проверка reCAPTCHA не пройдена. Попробуйте ещё раз.' : 'Сервер не принял заявку.')
      setStatus({ kind: 'sent' })
      setForm(empty)
      setConsent(false)
      setTouched(false)
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Что-то пошло не так.' })
    }
  }

  const show = (msg: string) => (touched && msg ? msg : undefined)

  return (
    <Section id="feedback" overline="Обратная связь" title="Связаться с джедаем">
      <Paper component="form" noValidate onSubmit={submit} sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 820, mx: 'auto' }}>
        {!configured && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Форма ещё не подключена: задайте VITE_RECAPTCHA_SITE_KEY и VITE_FEEDBACK_ENDPOINT.
          </Alert>
        )}
        {status.kind === 'sent' && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setStatus({ kind: 'idle' })}>
            Сообщение получено. Сила уже в пути — отвечу в ближайшее время.
          </Alert>
        )}
        {status.kind === 'error' && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setStatus({ kind: 'idle' })}>
            {status.message}
          </Alert>
        )}

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Имя" required fullWidth value={form.name} onChange={set('name')} error={!!show(errors.name)} helperText={show(errors.name)} slotProps={{ htmlInput: { maxLength: 100 } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Контакт" required fullWidth value={form.contact} onChange={set('contact')} error={!!show(errors.contact)} helperText={show(errors.contact) ?? 'Email, телефон или Telegram'} slotProps={{ htmlInput: { maxLength: 200 } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Компания" fullWidth value={form.company} onChange={set('company')} slotProps={{ htmlInput: { maxLength: 200 } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select label="Тема" fullWidth value={form.topic} onChange={set('topic')}>
              {feedbackTopics.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={12}>
            <TextField label="Сообщение" required fullWidth multiline minRows={4} value={form.message} onChange={set('message')} error={!!show(errors.message)} helperText={show(errors.message)} slotProps={{ htmlInput: { maxLength: 5000 } }} />
          </Grid>
        </Grid>

        <Box aria-hidden sx={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
        </Box>

        <FormControlLabel
          sx={{ mt: 2 }}
          control={<Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} />}
          label={
            <Typography variant="body2" color={touched && !consent ? 'error' : 'text.secondary'}>
              Согласен на обработку персональных данных
            </Typography>
          }
        />

        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 440 }}>
            Защищено reCAPTCHA:{' '}
            <Link href="https://policies.google.com/privacy" target="_blank" rel="noopener">
              Политика конфиденциальности
            </Link>{' '}
            и{' '}
            <Link href="https://policies.google.com/terms" target="_blank" rel="noopener">
              Условия использования
            </Link>{' '}
            Google.
          </Typography>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!configured || status.kind === 'sending'}
            endIcon={status.kind === 'sending' ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
          >
            Отправить
          </Button>
        </Box>
      </Paper>
    </Section>
  )
}
