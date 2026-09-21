import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Experience.css'

export default function Experience({ children }) {
  const { pathname } = useLocation()
  const { isRtl } = useLanguage()
  const root = useRef(null)
  const publicPage = !pathname.startsWith('/admin')
  useEffect(() => {
    if (!publicPage) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    const main = root.current.querySelector('main, .vd-body, .ve-container')
    if (main) { main.id = 'page-content'; main.tabIndex = -1 }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })
    const nodes = root.current.querySelectorAll('.features, .categories, .destinations, .concierge, .promo, .stats, .appdownload, .contact-info-strip, .contact-card-panel, .guide-section')
    nodes.forEach(node => { node.classList.add('reveal'); observer.observe(node) })
    const onReduced = () => nodes.forEach(node => node.classList.add('is-revealed'))
    reduced.addEventListener('change', onReduced)
    return () => {
      observer.disconnect()
      reduced.removeEventListener('change', onReduced)
      nodes.forEach(node => node.classList.remove('reveal', 'is-revealed'))
    }
  }, [pathname, publicPage])
  return <div ref={root} className={publicPage ? 'public-experience' : undefined}>
    {publicPage && <a className="skip-link" href="#page-content">{isRtl ? 'انتقل إلى المحتوى' : 'Aller au contenu'}</a>}
    {children}
  </div>
}
