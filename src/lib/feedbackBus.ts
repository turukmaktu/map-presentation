import type { FeedbackTopic } from '../content'

// Любая кнопка на странице может открыть форму с заранее выбранной темой.
const EVENT = 'feedback:topic'

export function requestFeedback(topic: FeedbackTopic) {
  window.dispatchEvent(new CustomEvent<FeedbackTopic>(EVENT, { detail: topic }))
  document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' })
}

export function onFeedbackRequest(handler: (topic: FeedbackTopic) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<FeedbackTopic>).detail)
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}
