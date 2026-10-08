interface ImportMetaEnv {
  /** Публичный site key reCAPTCHA v3 */
  readonly VITE_RECAPTCHA_SITE_KEY?: string
  /** URL веб-приложения Google Apps Script (…/exec) */
  readonly VITE_FEEDBACK_ENDPOINT?: string
  /** Идентификатор потока данных GA4 (G-XXXXXXXXXX) */
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
