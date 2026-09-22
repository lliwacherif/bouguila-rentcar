import { useEffect, useRef } from 'react'
import { FiMaximize2, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'
import { mediaUrl } from '../../services/api'

export default function VehicleGallery({ images, active, onChange, name }) {
  const dialog = useRef(null)
  const touch = useRef(null)
  const { isRtl } = useLanguage()
  const next = delta => onChange((active + delta + images.length) % images.length)
  useEffect(() => () => { document.body.style.overflow = '' }, [])
  const close = () => { dialog.current.close(); document.body.style.overflow = '' }
  const swipe = e => {
    if (touch.current == null) return
    const delta = touch.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) next(delta > 0 ? 1 : -1)
    touch.current = null
  }
  return <>
    <div className="vd-photo" onTouchStart={e => { touch.current = e.touches[0].clientX }} onTouchEnd={swipe}>
      <img key={images[active]} src={mediaUrl(images[active])} alt={name} className="vd-photo__main" width="900" height="600" />
      <button className="vd-photo__expand" aria-label={isRtl ? 'تكبير الصورة' : 'Agrandir la photo'} onClick={() => { dialog.current.showModal(); document.body.style.overflow = 'hidden' }}><FiMaximize2 /></button>
    </div>
    <dialog className="gallery-dialog" ref={dialog} aria-label={isRtl ? 'صور السيارة' : 'Galerie du véhicule'} onClose={() => { document.body.style.overflow = '' }} onKeyDown={e => { if (e.key === 'ArrowRight') next(1); if (e.key === 'ArrowLeft') next(-1) }}>
      <button className="gallery-dialog__close" onClick={close} aria-label={isRtl ? 'إغلاق' : 'Fermer'}><FiX /></button>
      <img src={mediaUrl(images[active])} alt={`${name} — ${active + 1}`} onTouchStart={e => { touch.current = e.touches[0].clientX }} onTouchEnd={swipe} />
      <div className="gallery-dialog__controls">
        <button aria-label={isRtl ? 'السابق' : 'Précédent'} onClick={() => next(-1)}><FiChevronLeft /></button>
        <span aria-live="polite">{active + 1} / {images.length}</span>
        <button aria-label={isRtl ? 'التالي' : 'Suivant'} onClick={() => next(1)}><FiChevronRight /></button>
      </div>
    </dialog>
  </>
}
