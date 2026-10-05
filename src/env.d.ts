interface ImportMetaEnv {
  /** Публичный site key reCAPTCHA v3 */
  readonly VITE_RECAPTCHA_SITE_KEY?: string
  /** URL веб-приложения Google Apps Script (…/exec) */
  readonly VITE_FEEDBACK_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
