import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiMapPin, FiArrowDown, FiNavigation, FiClock } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'
import './Hero.css'

export default function Hero() {
  const { isRtl } = useLanguage()
  return <section className="hero" id="accueil">
    <div className="hero__bg">
      <picture>
        <source media="(max-width: 600px)" srcSet="/images/sahel-hero-mobile.webp" />
        <img src="/images/sahel-hero.webp" alt={isRtl ? 'سيارة بجانب البحر على ساحل المنستير' : 'Une escapade en voiture sur la côte de Monastir'} className="hero__bg-img" fetchPriority="high" width="1536" height="1024" />
      </picture>
      <div className="hero__overlay" />
      <div className="hero__grain" />
    </div>
    <div className="hero__content container">
      <span className="eyebrow hero__eyebrow"><span /> {isRtl ? 'كراء سيارات في كامل تونس' : 'LOCATION PARTOUT EN TUNISIE'}</span>
      <h1 className="hero__title">
        <span>{isRtl ? 'الطريق لك.' : 'La route est à vous.'}</span>
        <em>{isRtl ? 'وتونس كلها تنتظرك.' : 'Toute la Tunisie vous attend.'}</em>
      </h1>
      <p className="hero__subtitle">{isRtl ? 'نسيم البحر، حرية الطريق، وسيارة تناسبك. ابدأ رحلتك في تونس مع بوقيلة كار.' : 'L’air marin, la liberté de partir et la voiture qui vous ressemble. Votre voyage en Tunisie commence avec Bouguila Car.'}</p>
      <div className="hero__actions">
        <a href="#reservation" className="experience-button">{isRtl ? 'خطّط لرحلتك' : 'Préparer mon voyage'} <FiArrowUpRight /></a>
        <Link to="/voitures" className="hero__secondary">{isRtl ? 'اكتشف سياراتنا' : 'Explorer nos voitures'} <FiArrowUpRight /></Link>
      </div>
      <div className="hero__signature"><FiMapPin /> <span>{isRtl ? 'من قلب الساحل، إلى وجهتك.' : 'Du cœur du Sahel, vers votre prochaine escale.'}</span></div>
      <div className="hero__proofs" aria-label={isRtl ? 'مزايا الخدمة' : 'Avantages du service'}>
        <span><FiNavigation /> {isRtl ? 'في كامل تونس' : 'Toute la Tunisie'}</span>
        <span><FiClock /> {isRtl ? 'مساعدة محلية' : 'Assistance locale'}</span>
      </div>
    </div>
    <div className="hero__route" aria-hidden="true">
      <span className="hero__route-label hero__route-label--one">Tunis</span>
      <span className="hero__route-label hero__route-label--two">Monastir</span>
      <span className="hero__route-label hero__route-label--three">Djerba</span>
      <svg viewBox="0 0 410 570" fill="none">
        <path className="hero__route-shadow" d="M98 20C157 106 68 170 169 231C273 294 204 357 282 412C326 443 315 503 370 550" />
        <path className="hero__route-line" d="M98 20C157 106 68 170 169 231C273 294 204 357 282 412C326 443 315 503 370 550" />
        <circle cx="98" cy="20" r="6" />
        <circle cx="169" cy="231" r="6" />
        <circle cx="370" cy="550" r="6" />
      </svg>
      <i />
    </div>
    <a className="hero__scroll" href="#reservation" aria-label={isRtl ? 'الحجز' : 'Découvrir la réservation'}><FiArrowDown /></a>
    <span className="hero__caption">36°48′ N → 33°48′ N <span>TUNISIE · DU NORD AU SUD</span></span>
  </section>
}
