import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiMapPin } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'
import './Destinations.css'

export default function Destinations() {
  const { isRtl } = useLanguage()
  return <section className="destinations">
    <div className="container destinations__layout">
      <div className="destinations__intro">
        <span className="eyebrow">{isRtl ? 'جذورنا في الساحل · طرقاتنا في تونس' : 'RACINES AU SAHEL · ROUTES EN TUNISIE'}</span>
        <h2>{isRtl ? 'بلاد كاملة، على طريقتك.' : <>Tout un pays,<br /><em>à votre rythme.</em></>}</h2>
        <p>{isRtl ? 'من تونس إلى طبرقة، ومن الساحل إلى توزر وجربة. اختر الطريق، ونحن نوفّر لك السيارة المناسبة.' : 'De Tunis à Tabarka, du Sahel à Tozeur et Djerba. Choisissez la route : nous vous aidons à trouver la voiture qui lui ressemble.'}</p>
        <Link to="/voitures" className="destinations__link">{isRtl ? 'اعثر على سيارتك' : 'Trouver ma voiture'} <FiArrowUpRight /></Link>
        <div className="destinations__places"><span>01 · {isRtl ? 'تونس' : 'Tunis'}</span><span>02 · {isRtl ? 'الساحل' : 'Le Sahel'}</span><span>03 · {isRtl ? 'جربة' : 'Djerba'}</span></div>
      </div>
      <div className="destinations__visual">
        <div className="destinations__photo"><img src="/images/sahel-coast.webp" alt={isRtl ? 'رحلة بالسيارة في تونس' : 'Voyage en voiture à travers la Tunisie'} loading="lazy" decoding="async" width="1200" height="800" /><div><FiMapPin /><span>{isRtl ? 'روح الساحل. حرية في كامل تونس.' : 'L’esprit du Sahel. La liberté dans toute la Tunisie.'}</span></div></div>
        <div className="destinations__map" aria-label={isRtl ? 'طريق عبر تونس' : 'Itinéraire à travers la Tunisie'}>
          <div className="destinations__map-head"><span>{isRtl ? 'طريق مقترح' : 'CARNET DE ROUTE'}</span><strong>1 200 KM</strong></div>
          <svg viewBox="0 0 260 390" role="img" aria-hidden="true">
            <path className="destinations__country" d="M108 9L152 18L172 52L162 85L190 118L174 153L193 188L171 223L160 259L174 300L148 330L142 376L112 360L102 324L78 298L91 258L73 221L86 180L72 145L95 109L87 72Z" />
            <path className="destinations__route-line" d="M128 37C110 83 147 103 125 151C106 194 145 220 126 263C112 294 135 325 130 354" />
            <circle cx="128" cy="37" r="5" /><circle cx="125" cy="151" r="5" /><circle cx="126" cy="263" r="5" /><circle cx="130" cy="354" r="5" />
          </svg>
          <span className="destinations__map-label destinations__map-label--tunis">{isRtl ? 'تونس' : 'Tunis'}</span>
          <span className="destinations__map-label destinations__map-label--sahel">{isRtl ? 'الساحل' : 'Sahel'}</span>
          <span className="destinations__map-label destinations__map-label--tozeur">{isRtl ? 'توزر' : 'Tozeur'}</span>
          <span className="destinations__map-label destinations__map-label--djerba">{isRtl ? 'جربة' : 'Djerba'}</span>
        </div>
      </div>
    </div>
  </section>
}
