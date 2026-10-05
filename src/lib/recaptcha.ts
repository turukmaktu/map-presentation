type Grecaptcha = {
  ready(cb: () => void): void
  execute(siteKey: string, options: { action: string }): Promise<string>
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha
  }
}

let loading: Promise<Grecaptcha> | null = null

export function loadRecaptcha(siteKey: string): Promise<Grecaptcha> {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    script.async = true
    script.onload = () => window.grecaptcha!.ready(() => resolve(window.grecaptcha!))
    script.onerror = () => {
      loading = null
      script.remove()
      reject(new Error('Не удалось загрузить reCAPTCHA'))
    }
    document.head.appendChild(script)
  })
  return loading
}

export async function getRecaptchaToken(siteKey: string, action: string) {
  const grecaptcha = await loadRecaptcha(siteKey)
  return grecaptcha.execute(siteKey, { action })
}
