import { subscribe } from './events'
import { consoleLogger } from './providers/console'
import { ga4 } from './providers/ga4'
import { startPageTriggers } from './triggers'

export { emit, emitOnce, secondsSinceLoad } from './events'
export type { AnalyticsEvents, CtaLocation, FormErrorType, FormSource, SectionId } from './events'
export { trackSection } from './triggers'

// Подписчиков подключаем до старта триггеров, чтобы не потерять landing_loaded.
// Новый счётчик (например, Яндекс.Метрика) — ещё один файл в providers/ и строка здесь.
export function setupAnalytics() {
  if (import.meta.env.DEV) subscribe(consoleLogger)

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (gaId) subscribe(ga4(gaId))

  startPageTriggers()
}
