/**
 * Приёмник формы обратной связи: проверяет reCAPTCHA v3 и пишет строку в эту таблицу.
 * Вставляется в редактор Apps Script, открытый из самой таблицы (Расширения → Apps Script).
 * Настройка — docs/FEEDBACK_SETUP.md.
 *
 * Script Properties (Настройки проекта → Свойства скрипта):
 *   RECAPTCHA_SECRET   — secret key reCAPTCHA (обязательно)
 *   ALLOWED_HOSTNAMES  — через запятую, напр. "turukmaktu.github.io,localhost" (необязательно)
 *   MIN_SCORE          — порог reCAPTCHA v3, по умолчанию 0.5 (необязательно)
 */

const SHEET_NAME = 'Feedback'
const HEADERS = ['Дата', 'Имя', 'Контакт', 'Компания', 'Тема', 'Сообщение', 'Страница', 'reCAPTCHA score', 'Hostname']

// ▶ Запускайте вручную именно эту функцию (выберите «setup» в списке рядом с кнопкой «Выполнить»).
// Выдаёт разрешения, создаёт лист с заголовками и проверяет свойства скрипта.
function setup() {
  getSheet()
  UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'post', muteHttpExceptions: true })
  const props = PropertiesService.getScriptProperties()
  if (!props.getProperty('RECAPTCHA_SECRET')) throw new Error('Не задано свойство скрипта RECAPTCHA_SECRET')
  console.log('Готово: лист «' + SHEET_NAME + '» создан, RECAPTCHA_SECRET задан. Можно разворачивать веб-приложение.')
}

// Вызывается веб-приложением при отправке формы. Вручную не запускать.
function doPost(e) {
  if (!e || !e.postData) {
    throw new Error('doPost вызывается только веб-приложением. Для настройки запустите функцию setup.')
  }
  try {
    const data = JSON.parse(e.postData.contents)

    // Honeypot: делаем вид, что всё хорошо, но ничего не пишем
    if (data.website) return json({ ok: true })

    const props = PropertiesService.getScriptProperties()
    const check = verifyRecaptcha(data.token, props)
    if (!check.ok) return json({ ok: false, error: 'captcha' })

    const name = clip(data.name, 100)
    const contact = clip(data.contact, 200)
    const message = clip(data.message, 5000)
    if (!name || !contact || !message) return json({ ok: false, error: 'invalid' })

    const lock = LockService.getScriptLock()
    lock.waitLock(10000)
    try {
      getSheet().appendRow([
        new Date(),
        safe(name),
        safe(contact),
        safe(clip(data.company, 200)),
        safe(clip(data.topic, 100)),
        safe(message),
        safe(clip(data.page, 500)),
        check.score,
        check.hostname,
      ])
    } finally {
      lock.releaseLock()
    }
    return json({ ok: true })
  } catch (err) {
    console.error(err)
    return json({ ok: false, error: 'server' })
  }
}

function verifyRecaptcha(token, props) {
  const secret = props.getProperty('RECAPTCHA_SECRET')
  if (!secret || !token) return { ok: false }

  const res = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'post',
    payload: { secret: secret, response: String(token) },
    muteHttpExceptions: true,
  })
  const v = JSON.parse(res.getContentText())
  const minScore = Number(props.getProperty('MIN_SCORE') || 0.5)
  const allowed = (props.getProperty('ALLOWED_HOSTNAMES') || '')
    .split(',')
    .map(function (h) { return h.trim() })
    .filter(String)

  const ok =
    v.success === true &&
    v.action === 'feedback' &&
    Number(v.score) >= minScore &&
    (allowed.length === 0 || allowed.indexOf(v.hostname) !== -1)

  return { ok: ok, score: v.score, hostname: v.hostname }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
  }
  return sheet
}

function clip(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max)
}

// Защита от formula injection: строка, начинающаяся с = + - @, иначе станет формулой
function safe(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
