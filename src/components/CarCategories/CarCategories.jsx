import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowUpRight, FiBriefcase, FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronUp, FiRefreshCw, FiUsers } from 'react-icons/fi'
import { vehiclesService } from '../../services/vehiclesService'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrency } from '../../context/CurrencyContext'
import './CarCategories.css'

const FALLBACK_IMAGES = {
  'Économique': '/images/car_hyundai.webp', 'Compacte': '/images/car_vw_golf.webp',
  'Berline': '/images/car_berline.webp', 'SUV': '/images/car_suv.webp',
  'Luxe': '/images/car_luxe.webp', 'Monospace': '/images/car_citadine.webp',
  'Utilitaire': '/images/car_utilitaire.webp',
}

const COLLAPSED_COUNT = 6

export default function CarCategories() {
  const sliderRef = useRef(null)
  const sectionRef = useRef(null)
  const navigate = useNavigate()
  const { t, isRtl } = useLanguage()
  const { formatPrice } = useCurrency()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const loadVehicles = () => {
    setLoading(true)
    setError(false)
    vehiclesService.getAll({ limit: 50, page: 1, status: 'Disponible', sortBy: 'pricePerDay', sortOrder: 'asc' })
      .then(data => setVehicles(data?.vehicles || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadVehicles() }, [])

  const displayedVehicles = expanded ? vehicles : vehicles.slice(0, COLLAPSED_COUNT)

  const scroll = (direction) => {
    if (!sliderRef.current) return
    sliderRef.current.scrollBy({ left: (isRtl ? -1 : 1) * direction * 330, behavior: 'smooth' })
  }

  const updateSliderProgress = (event) => {
    const firstCard = event.currentTarget.querySelector('.categories__card')
    if (!firstCard) return
    const step = firstCard.getBoundingClientRect().width + 20
    setActiveIndex(Math.min(displayedVehicles.length - 1, Math.max(0, Math.round(Math.abs(event.currentTarget.scrollLeft) / step))))
  }

  const toggleExpanded = () => {
    setExpanded(current => {
      if (current) window.requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      return !current
    })
  }

  return (
    <section ref={sectionRef} className={`categories${expanded ? ' categories--expanded' : ''}`} id="voitures">
      <div className="container">
        <div className="categories__header">
          <div>
            <span className="eyebrow categories__eyebrow">{isRtl ? 'أسطولنا الحقيقي' : 'LA FLOTTE, EN TEMPS RÉEL'}</span>
            <h2 className="categories__title">{isRtl ? 'سياراتنا المتاحة' : 'Nos voitures disponibles'}</h2>
            {!loading && !error && <p className="categories__subtitle">{vehicles.length} {isRtl ? 'سيارة جاهزة لرحلتك' : vehicles.length > 1 ? 'voitures prêtes pour votre prochain départ' : 'voiture prête pour votre prochain départ'}</p>}
          </div>
          {vehicles.length > COLLAPSED_COUNT && (
            <button className="categories__view-all" type="button" onClick={toggleExpanded} aria-expanded={expanded} aria-controls="home-fleet-list">
              {expanded ? (isRtl ? 'عرض أقل' : 'Réduire') : (isRtl ? `عرض كل السيارات (${vehicles.length})` : `Voir les ${vehicles.length} voitures`)}
              {expanded ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          )}
        </div>

        {error ? (
          <div className="categories__state"><p>{isRtl ? 'تعذّر تحميل السيارات.' : 'Impossible de charger la flotte.'}</p><button type="button" onClick={loadVehicles}><FiRefreshCw /> {isRtl ? 'إعادة المحاولة' : 'Réessayer'}</button></div>
        ) : (
          <div className="categories__slider-wrap">
            {!expanded && displayedVehicles.length > 1 && <button className="categories__arrow categories__arrow--left" onClick={() => scroll(-1)} aria-label={t('categories.prev', 'Précédent')}><FiChevronLeft /></button>}

            <div id="home-fleet-list" className="categories__slider" ref={sliderRef} onScroll={updateSliderProgress}>
              {loading
                ? [1,2,3,4].map(item => <div key={item} className="categories__card categories__card--skeleton" />)
                : displayedVehicles.map(vehicle => (
                    <article
                      key={vehicle._id}
                      className="categories__card"
                      role="link"
                      tabIndex="0"
                      aria-label={`${vehicle.name} — ${formatPrice(vehicle.pricePerDay, isRtl)} / ${t('searchResults.day', 'jour')}`}
                      onClick={() => navigate(`/voitures/${vehicle._id}`)}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); navigate(`/voitures/${vehicle._id}`) } }}
                    >
                      <div className="categories__card-img-wrap">
                        <img
                          src={vehicle.images?.[0] || FALLBACK_IMAGES[vehicle.category] || '/images/car_citadine.webp'}
                          alt={vehicle.name}
                          loading="lazy"
                          decoding="async"
                          width="640"
                          height="420"
                          className="categories__card-img"
                          onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_IMAGES[vehicle.category] || '/images/car_citadine.webp' }}
                        />
                        <span className="categories__availability"><i /> {isRtl ? 'متاحة' : 'Disponible'}</span>
                        <span className="categories__category">{vehicle.category}</span>
                      </div>
                      <div className="categories__card-info">
                        <div className="categories__card-heading"><h3 className="categories__card-name">{vehicle.name}</h3><span>{vehicle.year}</span></div>
                        <div className="categories__card-specs">
                          <span>{vehicle.transmission}</span><span>{vehicle.fuel}</span>
                          <span><FiUsers /> {vehicle.seats}</span><span><FiBriefcase /> {vehicle.bags}</span>
                        </div>
                        <div className="categories__card-footer">
                          <div><small>{isRtl ? 'السعر لليوم' : 'Prix par jour'}</small><strong>{formatPrice(vehicle.pricePerDay, isRtl)}</strong></div>
                          <span className="categories__card-link" aria-hidden="true">{isRtl ? 'التفاصيل' : 'Détails'} <FiArrowUpRight /></span>
                        </div>
                      </div>
                    </article>
                  ))}
              {!loading && vehicles.length === 0 && <div className="categories__state"><p>{isRtl ? 'لا توجد سيارات متاحة حاليًا.' : 'Aucune voiture disponible pour le moment.'}</p></div>}
            </div>

            {!expanded && displayedVehicles.length > 1 && <button className="categories__arrow categories__arrow--right" onClick={() => scroll(1)} aria-label={t('categories.next', 'Suivant')}><FiChevronRight /></button>}
          </div>
        )}

        {!loading && !error && !expanded && displayedVehicles.length > 0 && <div className="categories__progress"><span style={{ transform: `scaleX(${(activeIndex + 1) / displayedVehicles.length})` }} /><small>{String(activeIndex + 1).padStart(2, '0')} / {String(displayedVehicles.length).padStart(2, '0')}</small></div>}
      </div>
    </section>
  )
}
