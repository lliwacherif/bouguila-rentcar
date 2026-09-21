import { FiCheck, FiCompass, FiHeadphones, FiShield } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'
import './Features.css'

export default function Features() {
  const { isRtl } = useLanguage()
  const items = [
    {
      id: 'tunisia', number: '01', icon: <FiCompass />,
      title: isRtl ? 'من الشمال إلى الجنوب' : 'Du nord au sud',
      desc: isRtl ? 'رحلتك لا تتوقف عند الساحل. اختر وجهتك أينما كانت في تونس.' : 'Votre route ne s’arrête pas au Sahel. Choisissez votre destination partout en Tunisie.',
      detail: isRtl ? 'خدمة وطنية' : 'Service national',
    },
    {
      id: 'fleet', number: '02', icon: <FiShield />,
      title: isRtl ? 'سيارات مختارة بعناية' : 'Une flotte choisie avec soin',
      desc: isRtl ? 'سيارات نظيفة، مُراقبة وجاهزة لكل نوع من الرحلات.' : 'Des véhicules propres, contrôlés et prêts pour chaque type de voyage.',
      detail: isRtl ? 'راحة وأمان' : 'Confort & sérénité',
    },
    {
      id: 'support', number: '03', icon: <FiHeadphones />,
      title: isRtl ? 'فريق محلي قريب منك' : 'Une équipe locale, vraiment disponible',
      desc: isRtl ? 'مساعدة واضحة وسريعة قبل الرحلة وأثناءها وبعدها.' : 'Une réponse claire et rapide avant, pendant et après votre location.',
      detail: isRtl ? 'مساعدة بشرية' : 'Assistance humaine',
    },
  ]

  return (
    <section className="features" aria-labelledby="features-title">
      <div className="features__heading container">
        <span className="eyebrow">{isRtl ? 'وعد بوقيلة كار' : 'LA PROMESSE BOUGUILA CAR'}</span>
        <h2 id="features-title">{isRtl ? 'التفاصيل الصغيرة تصنع الرحلات الكبيرة.' : <>Les petits détails font<br /><em>les grands voyages.</em></>}</h2>
      </div>
      <div className="features__inner container">
        {items.map(item => (
          <article key={item.id} className="features__item">
            <span className="features__number">{item.number}</span>
            <div className="features__icon">{item.icon}</div>
            <h3 className="features__title">{item.title}</h3>
            <p className="features__desc">{item.desc}</p>
            <span className="features__detail"><FiCheck /> {item.detail}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
