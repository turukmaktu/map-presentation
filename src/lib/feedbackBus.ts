import type { FeedbackTopic } from '../content'
import type { CtaLocation } from './analytics'

// Любая кнопка на странице может открыть форму с заранее выбранной темой.
const EVENT = 'feedback:topic'

type Request = { topic: FeedbackTopic; source: CtaLocation }

export function requestFeedback(topic: FeedbackTopic, source: CtaLocation) {
  window.dispatchEvent(new CustomEvent<Request>(EVENT, { detail: { topic, source } }))
  document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' })
}

export function onFeedbackRequest(handler: (request: Request) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<Request>).detail)
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}
