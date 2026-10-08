// Подписчик для разработки: печатает события в консоль.

import type { Subscriber } from '../events'

export const consoleLogger: Subscriber = ({ name, params }) => console.debug('[analytics]', name, params)
