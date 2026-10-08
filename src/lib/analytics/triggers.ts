// Триггеры уровня страницы: загрузка, прокрутка, просмотр секций, уход.
// Только генерируют события — об отправке ничего не знают.

import { emitOnce, emittedCount, hasEmitted, wasEmitted, type SectionId } from './events'

const sectionOrder: SectionId[] = ['hero', 'problems', 'path', 'stack', 'savings', 'dark-side', 'cta', 'feedback']
const scrollMarks = [25, 50, 75, 100] as const

function deviceType() {
  const w = window.innerWidth
  return w < 600 ? 'mobile' : w < 900 ? 'tablet' : 'desktop'
}

function referrerHost() {
  try {
    return document.referrer ? new URL(document.referrer).hostname : '(direct)'
  } catch {
    return '(direct)'
  }
}

function onLoaded() {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  emitOnce('landing_loaded', 'landing_loaded', {
    load_time_ms: nav ? Math.round(nav.loadEventEnd || nav.domContentLoadedEventEnd) : undefined,
    dom_ready_ms: nav ? Math.round(nav.domContentLoadedEventEnd) : undefined,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    device_type: deviceType(),
    referrer_host: referrerHost(),
    has_hash: Boolean(location.hash),
  })
}

function watchScrollDepth() {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const percent = max > 0 ? (window.scrollY / max) * 100 : 100
    for (const m of scrollMarks) {
      if (percent >= m - 1) emitOnce(`scroll:${m}`, 'scroll_depth', { percent: m })
    }
    if (wasEmitted('scroll:100')) window.removeEventListener('scroll', onScroll)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
}

function maxScrollPercent() {
  return Math.max(0, ...scrollMarks.filter((m) => wasEmitted(`scroll:${m}`)))
}

function watchLeave() {
  // visibilitychange срабатывает и при закрытии вкладки, и при переключении — итоги шлём один раз.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') return
    emitOnce('landing_leave', 'landing_leave', {
      sections_viewed: emittedCount('section:'),
      max_scroll_percent: maxScrollPercent(),
      form_started: hasEmitted('form_start'),
      form_sent: hasEmitted('form_success'),
    })
  })
}

export function startPageTriggers() {
  if (document.readyState === 'complete') onLoaded()
  else window.addEventListener('load', onLoaded, { once: true })
  watchScrollDepth()
  watchLeave()
}

// Секция считается просмотренной, когда пересекает середину экрана (работает и для высоких секций).
const sectionObserver =
  typeof IntersectionObserver === 'undefined'
    ? null
    : new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue
            const el = e.target as HTMLElement
            const id = el.dataset.trackSection as SectionId
            emitOnce(`section:${id}`, 'section_view', {
              section_id: id,
              section_index: sectionOrder.indexOf(id) + 1,
              section_name: el.dataset.trackName ?? id,
            })
            sectionObserver!.unobserve(el)
          }
        },
        { rootMargin: '-50% 0px -50% 0px' },
      )

/** Ref-колбэк для секции: `<Box ref={trackSection('hero', 'Первый экран')}>` */
export function trackSection(id: SectionId, name: string) {
  return (el: HTMLElement | null) => {
    if (!el || !sectionObserver) return
    el.dataset.trackSection = id
    el.dataset.trackName = name
    sectionObserver.observe(el)
    return () => sectionObserver.unobserve(el)
  }
}
