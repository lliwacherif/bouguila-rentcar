import { useEffect } from 'react'

export default function useModalFocus(open, ref, onClose) {
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const root = ref.current
    if (!root) return
    const focusable = () => [...root.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex="0"]')].filter(el => el.getClientRects().length)
    const frame = requestAnimationFrame(() => focusable()[0]?.focus())
    const handleKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab') return
      const items = focusable()
      const first = items[0], last = items[items.length - 1]
      if (!first) { e.preventDefault(); return }
      if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('keydown', handleKey); if (previous?.isConnected) previous.focus() }
  }, [open, ref, onClose])
}
