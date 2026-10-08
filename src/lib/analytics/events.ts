// Шина аналитики: компоненты и триггеры только сообщают «что произошло»,
// а куда это отправить (GA4, Яндекс.Метрика, консоль) решают подписчики — см. ./providers.

import type { FeedbackTopic } from '../../content'

export type SectionId = 'hero' | 'problems' | 'path' | 'stack' | 'savings' | 'dark-side' | 'cta' | 'feedback'
export type CtaLocation = 'hero' | 'cta'
// Откуда пришли в форму: по кнопке CTA или долистали сами.
export type FormSource = CtaLocation | 'direct'
export type FormErrorType = 'captcha' | 'server' | 'network'

export type AnalyticsEvents = {
  /** Страница загружена */
  landing_loaded: {
    load_time_ms?: number
    dom_ready_ms?: number
    viewport: string
    device_type: 'mobile' | 'tablet' | 'desktop'
    referrer_host: string
    has_hash: boolean
  }
  /** Секция пересекла середину экрана (один раз за визит) */
  section_view: { section_id: SectionId; section_index: number; section_name: string }
  /** Шаг «Пути джедая» стал активным (один раз за визит) */
  step_view: { step_number: number; step_title: string; step_system: string }
  /** Прокрутка достигла 25/50/75/100% */
  scroll_depth: { percent: 25 | 50 | 75 | 100 }
  /** Клик по кнопке призыва к действию */
  cta_click: { cta_location: CtaLocation; cta_text: string; topic?: FeedbackTopic }
  /** Клик по шагу в боковом таймлайне */
  step_nav_click: { step_number: number; step_title: string }
  /** Открыли видео шага на весь экран */
  video_open: { video: string; step_title: string }
  /** Закрыли полноэкранное видео */
  video_close: { video: string; step_title: string; seconds_watched: number }
  /** Первое взаимодействие с формой */
  form_start: { topic: FeedbackTopic; form_source: FormSource; first_field: string }
  /** Сменили тему в форме */
  form_topic_change: { topic: FeedbackTopic }
  /** Нажали «Отправить» с невалидной формой */
  form_validation_error: { fields: string }
  /** Нажали «Отправить», данные валидны — начали отправку */
  form_submit: { topic: FeedbackTopic; form_source: FormSource; has_company: boolean; message_length: number }
  /** Заявка принята сервером */
  form_success: { topic: FeedbackTopic; form_source: FormSource; seconds_to_complete: number }
  /** Отправка не удалась */
  form_submit_error: { topic: FeedbackTopic; error_type: FormErrorType }
  /** Вкладку скрыли/закрыли — итоги визита */
  landing_leave: { sections_viewed: number; max_scroll_percent: number; form_started: boolean; form_sent: boolean }
}

export type EventName = keyof AnalyticsEvents

/** Общие параметры, которые шина добавляет к каждому событию */
export type CommonParams = { seconds_since_load: number }

export type AnalyticsEvent = {
  [K in EventName]: { name: K; params: AnalyticsEvents[K] & CommonParams }
}[EventName]

export type Subscriber = (event: AnalyticsEvent) => void

const subscribers = new Set<Subscriber>()
// Однократные события не повторяются за визит (и не дублируются в StrictMode).
const onceKeys = new Set<string>()
const emittedNames = new Set<EventName>()
const startedAt = performance.now()

export function secondsSinceLoad() {
  return Math.round((performance.now() - startedAt) / 1000)
}

export function subscribe(subscriber: Subscriber) {
  subscribers.add(subscriber)
  return () => {
    subscribers.delete(subscriber)
  }
}

export function emit<K extends EventName>(name: K, params: AnalyticsEvents[K]) {
  const event = { name, params: { ...params, seconds_since_load: secondsSinceLoad() } } as AnalyticsEvent
  emittedNames.add(name)
  for (const s of subscribers) {
    try {
      s(event)
    } catch (err) {
      // Сломанный провайдер не должен ломать страницу и остальных подписчиков.
      console.error('[analytics]', err)
    }
  }
}

/** emit, но не больше одного раза за визит для данного key */
export function emitOnce<K extends EventName>(key: string, name: K, params: AnalyticsEvents[K]) {
  if (onceKeys.has(key)) return
  onceKeys.add(key)
  emit(name, params)
}

/** Было ли однократное событие с таким key */
export function wasEmitted(key: string) {
  return onceKeys.has(key)
}

/** Было ли за визит хоть одно событие с таким именем */
export function hasEmitted(name: EventName) {
  return emittedNames.has(name)
}

export function emittedCount(prefix: string) {
  return [...onceKeys].filter((k) => k.startsWith(prefix)).length
}
