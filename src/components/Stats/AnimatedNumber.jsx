import { useEffect, useRef, useState } from 'react'

export default function AnimatedNumber({ value }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(value)
  useEffect(() => {
    const target = Number(value.replace(/[^0-9]/g, ''))
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { setDisplay(value); return }
    let frame
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const animate = now => {
        const progress = Math.min((now - start) / 1100, 1)
        const count = Math.round(target * (1 - (1 - progress) ** 3))
        setDisplay(progress === 1 ? value : `${value.startsWith('+') ? '+' : ''}${count.toLocaleString('fr-FR')}${value.endsWith('%') ? '%' : ''}`)
        if (progress < 1) frame = requestAnimationFrame(animate)
      }
      frame = requestAnimationFrame(animate)
    }, { threshold: .7 })
    observer.observe(ref.current)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [value])
  return <span ref={ref} className="stats__value" aria-label={value}><span aria-hidden="true">{display}</span></span>
}
