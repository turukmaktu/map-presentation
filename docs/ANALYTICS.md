# Аналитика: события лендинга → GA4 (и другие счётчики)

```
компоненты / триггеры ──emit()──▶ шина (src/lib/analytics/events.ts) ──▶ подписчики (providers/)
                                                                        ├─ ga4.ts      → Google Analytics 4
                                                                        ├─ console.ts  → консоль (только dev)
                                                                        └─ yandex.ts   → (позже) Яндекс.Метрика
```

- **Триггеры** только сообщают, что произошло: `emit('cta_click', {...})`. Об отправке они ничего не знают.
- **Подписчики** решают, куда и в каком виде отправить. Подключаются в `src/lib/analytics/index.ts`.
- Все события и их параметры типизированы в `AnalyticsEvents` (`events.ts`). Новое событие сначала описывается там.
- К каждому событию шина добавляет `seconds_since_load` — секунды с загрузки страницы.

## События

| Событие | Когда | Параметры |
|---|---|---|
| `landing_loaded` | страница загружена | `load_time_ms`, `dom_ready_ms`, `viewport`, `device_type` (mobile/tablet/desktop), `referrer_host`, `has_hash` |
| `section_view` | секция пересекла середину экрана (1 раз за визит) | `section_id`, `section_index`, `section_name` |
| `step_view` | шаг «Пути джедая» стал активным (1 раз за визит) | `step_number`, `step_title`, `step_system` |
| `scroll_depth` | прокрутка 25/50/75/100% (каждая отметка 1 раз) | `percent` |
| `cta_click` | клик по кнопке CTA | `cta_location` (hero/cta), `cta_text`, `topic` |
| `step_nav_click` | клик по шагу в боковом таймлайне | `step_number`, `step_title` |
| `video_open` | открыли видео шага на весь экран | `video`, `step_title` |
| `video_close` | закрыли полноэкранное видео | `video`, `step_title`, `seconds_watched` |
| `form_start` | первый фокус в форме (1 раз за визит) | `topic`, `form_source` (hero/cta/direct), `first_field` |
| `form_topic_change` | сменили тему вручную | `topic` |
| `form_validation_error` | «Отправить» с невалидной формой | `fields` — через запятую: name, contact, message, consent |
| `form_submit` | валидная форма ушла на отправку | `topic`, `form_source`, `has_company`, `message_length` |
| `form_success` | сервер принял заявку | `topic`, `form_source`, `seconds_to_complete` |
| `form_submit_error` | отправка не удалась | `topic`, `error_type` (captcha/server/network) |
| `landing_leave` | вкладку впервые скрыли или закрыли | `sections_viewed`, `max_scroll_percent`, `form_started`, `form_sent` |

Секции по порядку (`section_index`): 1 `hero`, 2 `problems`, 3 `path`, 4 `stack`, 5 `savings`, 6 `dark-side`, 7 `cta`, 8 `feedback`.

GA4-подписчик дополнительно отправляет рекомендованное событие `generate_lead` при `form_success`.

## Подключение GA4

1. https://analytics.google.com → **Администратор → Создать → Ресурс**, затем **Потоки данных → Веб** с адресом `https://turukmaktu.github.io/map-presentation/`.
2. Скопируйте **Идентификатор потока данных** (`G-XXXXXXXXXX`).
3. GitHub → **Settings → Secrets and variables → Actions → Variables** → `VITE_GA_MEASUREMENT_ID`. Локально — в `.env.local`.
4. В потоке данных, в разделе **Улучшенная статистика**, можно отключить «Прокрутку»: глубину прокрутки мы считаем сами, точнее.
5. **Администратор → Ключевые события** → отметьте `generate_lead` (это конверсия).
6. **Администратор → Пользовательские определения → Создать** (область «Событие»). Зарегистрируйте параметры, которые нужны в отчётах: `section_id`, `section_index`, `step_number`, `cta_location`, `form_source`, `topic`, `error_type`, `fields`, `percent`. Как метрики можно добавить `seconds_to_complete`, `seconds_watched` и `load_time_ms`. Незарегистрированные параметры собираются, но в отчётах не видны.

Проверка: откройте сайт с `?ga_debug`, например `…/map-presentation/?ga_debug`. События появятся в **Администратор → DebugView**. В dev-режиме (`npm run dev`) они также пишутся в консоль браузера как `[analytics]`.

## Воронка

**Исследования → Анализ последовательностей**, шаги:

1. `landing_loaded`
2. `section_view`, где `section_id` = `path` (посмотрели, как работает)
3. `section_view`, где `section_id` = `feedback` (дошли до формы)
4. `form_start`
5. `form_submit`
6. `form_success`

Полезные разбивки: `form_source` (какая кнопка приводит лиды), `device_type`, `first_field`. Где отваливаются на форме, видно по `form_validation_error.fields` и `form_submit_error.error_type`.

## Как добавить Яндекс.Метрику

Создайте `src/lib/analytics/providers/yandex.ts` — подписчик, который загружает `tag.js` и вызывает `ym(id, 'reachGoal', name, params)`:

```ts
import type { Subscriber } from '../events'

export function yandexMetrika(counterId: number): Subscriber {
  // …вставка tag.js и ym(counterId, 'init', { webvisor: true, clickmap: true, … })
  return ({ name, params }) => window.ym?.(counterId, 'reachGoal', name, params)
}
```

В `index.ts` добавьте `if (ymId) subscribe(yandexMetrika(Number(ymId)))`, переменную `VITE_YM_COUNTER_ID` в `env.d.ts`, `.env.example` и `deploy.yml`. В Метрике заведите цели типа «JavaScript-событие» с идентификаторами событий (`form_success` и т. д.).
