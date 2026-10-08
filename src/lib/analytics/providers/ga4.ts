// Подписчик Google Analytics 4 (gtag.js): загружает тег и пересылает события шины.

import type { Subscriber } from '../events'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function ga4(measurementId: string): Subscriber {
  window.dataLayer = window.dataLayer ?? []
  // gtag.js ожидает в dataLayer именно объект arguments, а не массив.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  // ?ga_debug в адресе — события видны в GA → Администратор → DebugView.
  window.gtag('config', measurementId, new URLSearchParams(location.search).has('ga_debug') ? { debug_mode: true } : {})

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)

  return ({ name, params }) => {
    window.gtag!('event', name, params)
    // Рекомендованное событие GA4 для лидов — его удобно отметить ключевым (конверсией).
    if (name === 'form_success') window.gtag!('event', 'generate_lead', { topic: params.topic, form_source: params.form_source })
  }
}
