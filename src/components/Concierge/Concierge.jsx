import { FiArrowUpRight, FiMessageCircle, FiPhoneCall } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'
import { AGENCY } from '../../constants/agency'
import './Concierge.css'

export default function Concierge() {
  const { isRtl } = useLanguage()
  return (
    <section className="concierge">
      <div className="concierge__card container">
        <div className="concierge__media">
          <img src="/images/sahel-keys.webp" alt={isRtl ? 'تسليم مفاتيح سيارة بوقيلة كار' : 'Remise des clés avec Bouguila Car'} loading="lazy" decoding="async" width="1024" height="1024" />
          <span><i /> {isRtl ? 'فريقنا متاح' : 'Notre équipe est disponible'}</span>
        </div>
        <div className="concierge__content">
          <span className="eyebrow">{isRtl ? 'خدمة قريبة منك' : 'VOTRE CONCIERGERIE DE ROUTE'}</span>
          <h2>{isRtl ? 'شخص حقيقي، في كل مرحلة.' : <>Une vraie personne,<br /><em>à chaque étape.</em></>}</h2>
          <p>{isRtl ? 'سؤال عن السيارة أو الطريق أو موعد الانطلاق؟ فريق بوقيلة كار يساعدك بسرعة ووضوح.' : 'Une question sur la voiture, votre itinéraire ou votre départ ? L’équipe Bouguila Car vous répond avec simplicité et précision.'}</p>
          <div className="concierge__actions">
            <a href={`https://wa.me/${AGENCY.phoneTel.replace('+', '')}`} target="_blank" rel="noreferrer" className="concierge__primary"><FiMessageCircle /> WhatsApp <FiArrowUpRight /></a>
            <a href={`tel:${AGENCY.phoneTel}`} className="concierge__phone"><FiPhoneCall /> {AGENCY.phoneDisplay}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
