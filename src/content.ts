// Все тексты лендинга в одном месте — правьте здесь.

export const hero = {
  overline: 'May the code be with you',
  title: 'OLDSCOOL JEDI DEVELOPMENT',
  slogan: 'Force-powered logistics. No external subscriptions. No license traps.',
  subtitle:
    'Модуль логистики для 1С:УТ + Битрикс + Android-курьер. Полный цикл: от заказа до документа отчётности — в одной силе.',
  terminal: [
    '$ jedi init logistics --no-saas',
    '> Подключаю 1С:УТ .............. ok',
    '> Синхронизирую Bitrix ......... ok',
    '> Собираю Android-курьера ...... ok',
    '> Внешних подписок ............. 0',
    '> Лицензионных ловушек ......... 0',
    '✔ May the Force be with your logistics',
  ],
}

export const problems = [
  { pain: 'Платите за каждый заказ сторонним сервисам', fix: 'Своя логистика внутри 1С' },
  { pain: 'Клеите 5 систем через API', fix: 'Один модуль — одна цепочка' },
  { pain: 'Курьер звонит, диспетчер вбивает вручную', fix: 'Android-приложение + двусторонняя связь' },
  { pain: 'Отчёты собираются в Excel', fix: 'Автодокументы в 1С' },
]

// gif: путь относительно public/, например 'gifs/step-1.gif'. Пока пусто — показывается скелетон.
export const steps: { system: string; title: string; text: string; gif?: string }[] = [
  { system: 'Bitrix', title: 'Оформление заказа на сайте', text: 'Bitrix-шаблон с React/MUI: клиент оформляет заказ, CMS работает как прежде.' },
  { system: '1С', title: 'Адрес — в маршрут', text: 'Диспетчер добавляет адрес в маршрут: drag&drop или прямо на карте.' },
  { system: 'Android', title: 'Курьер активирует маршрут', text: 'Маршрут прилетает в Android-приложение, курьер жмёт «Поехали».' },
  { system: 'Android', title: 'Выполнение заказов', text: 'Статусы, фото, подпись клиента — всё фиксируется на месте.' },
  { system: '1С', title: 'Закрытие маршрута', text: 'Маршрут закрыт — изменения мгновенно отражаются в 1С.' },
  { system: '1С', title: 'Документы отчётности', text: '1С сама создаёт документы доставки. Никакого Excel.' },
  { system: '1С ↔ Bitrix', title: 'Заказ из 1С — на сайте', text: 'Создали заказ в 1С — он виден на сайте. Связь двусторонняя.' },
]

export const stack = [
  { label: 'Frontend', value: 'React + Material UI внутри Bitrix-шаблона — без потери функционала CMS.' },
  { label: 'Backend', value: '1С:Управление торговлей — модуль логистики.' },
  { label: 'Mobile', value: 'Нативное Android-приложение курьера.' },
  { label: 'Интеграция', value: 'Двусторонняя синхронизация 1С ↔ Bitrix через собственный обмен.' },
  { label: 'Лицензии', value: '0 дополнительных. Опенсорс и штатные средства.' },
]

export const savings = [
  { title: '0 ₽ на сторонних сервисах', text: 'Никаких подписок на логистические SaaS.' },
  { title: 'Open-source без доп. лицензий', text: 'Платите только за свою инфраструктуру.' },
  { title: '1 разработчик — весь цех', text: 'От фронта до 1С и Android.' },
  { title: 'AI-ассистирование', text: 'Тикеты, отчёты и тесты закрываются быстрее, чем целым отделом.' },
  { title: 'Демо + интеграция', text: 'Можно потрогать до покупки.' },
]

export const integrationSteps = [
  'Созвон и аудит процессов',
  'Демо-стенд на ваших данных',
  'Установка модуля в 1С и Bitrix',
  'Обучение диспетчеров и курьеров',
  'Запуск и сопровождение',
]

export const about = {
  name: 'Ваше имя', // TODO: заполнить
  avatar: 'jedi.jpg', // относительно public/
  facts: [
    { value: '5 лет', label: 'в 1С' },
    { value: '7 лет', label: 'в React' },
    { value: '100+', label: 'интеграций' },
  ],
  quote: 'Я не продаю часы. Я показываю время. И да, я делаю это сам.',
}

export const darkSide = [
  { title: 'SaaS-империя', text: 'Берёт 5% с каждого заказа. Навсегда.' },
  { title: 'Лицензионный флот', text: 'Каждый новый курьер — новая лицензия.' },
  { title: 'Франкенштейн из API', text: 'Пять систем, пять подписок, пять точек отказа.' },
]

// Путь к PDF относительно public/, например 'tech-spec.pdf'. Пока пусто — кнопка неактивна.
export const techPdf: string | undefined = undefined

export const feedbackTopics = ['Запросить демо', 'Развернуть у меня', 'Вопрос по интеграции', 'Другое'] as const
export type FeedbackTopic = (typeof feedbackTopics)[number]
