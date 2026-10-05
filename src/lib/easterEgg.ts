const saber = String.raw`
        ▄▄
   ═══[██]══════════════════════════════════
        ▀▀
`

export function printEasterEgg() {
  console.log(`%c${saber}`, 'color:#39ff88;font-family:monospace;text-shadow:0 0 6px #39ff88')
  console.log('%cMay the Force be with your logistics', 'color:#3fa9ff;font:bold 16px monospace')
  console.log('%cРаз уж ты здесь — пиши в форму внизу, поговорим о коде.', 'color:#9aa3b5;font-family:monospace')
}
