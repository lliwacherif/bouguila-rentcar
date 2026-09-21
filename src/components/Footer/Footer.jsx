import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin, FiSend, FiInstagram } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'
import { AGENCY } from '../../constants/agency'
import './Footer.css'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { t } = useLanguage()

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 4000)
  }

  const infoList = [
    t('footer.terms', 'Conditions générales'),
    t('footer.privacy', 'Politique de confidentialité'),
    t('footer.faq', 'FAQ'),
    t('footer.guide', 'Guide de location'),
  ]

  return (
    <footer className="footer">
      <div className="footer__top container">
        {/* Brand column */}
        <div className="footer__col footer__col--brand">
          <Link to="/" className="footer__logo">
            <img src={AGENCY.logo} alt={AGENCY.name} className="footer__logo-img" />
          </Link>
          <p className="footer__brand-desc">
            {t('footer.brandDesc', 'Location de voitures à Sayada, Monastir — votre partenaire de confiance en Tunisie.')}
          </p>
          <div className="footer__socials">
            <a href={AGENCY.instagram} target="_blank" rel="noreferrer" className="footer__social" aria-label="Instagram"><FiInstagram size={16} /></a>
          </div>
        </div>

        {/* Liens utiles */}
        <div className="footer__col">
          <h4 className="footer__col-title">{t('footer.usefulLinks', 'Liens utiles')}</h4>
          <ul className="footer__links">
            <li><Link to="/" className="footer__link">{t('footer.home', 'Accueil')}</Link></li>
            <li><Link to="/voitures" className="footer__link">{t('footer.cars', 'Voitures')}</Link></li>
            <li><Link to="/voitures?sortBy=pricePerDay&sortOrder=asc" className="footer__link">{t('footer.offers', 'Offres spéciales')}</Link></li>
            <li><Link to="/voitures" className="footer__link">{t('footer.allCategories', 'Toutes les catégories')}</Link></li>
          </ul>
        </div>

        {/* Informations */}
        <div className="footer__col">
          <h4 className="footer__col-title">{t('footer.information', 'Informations')}</h4>
          <ul className="footer__links">
            {infoList.map(l => (
              <li key={l}><span className="footer__link footer__link--text">{l}</span></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <h4 className="footer__col-title">{t('footer.contact', 'Contact')}</h4>
          <ul className="footer__contact-list">
            <li className="footer__contact-item" style={{ alignItems: 'flex-start' }}>
              <FiPhone size={13} style={{ marginTop: 3 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <a href={`tel:${AGENCY.phoneTel}`} className="footer__link">{AGENCY.phoneDisplay}</a>
              </div>
            </li>
            <li className="footer__contact-item">
              <FiMail size={13} />
              <a href={`mailto:${AGENCY.email}`} className="footer__link">{AGENCY.email}</a>
            </li>
            <li className="footer__contact-item">
              <FiMapPin size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span className="footer__address">{AGENCY.address}</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer__col">
          <h4 className="footer__col-title">{t('footer.newsletter', 'Newsletter')}</h4>
          <p className="footer__newsletter-desc">{t('footer.newsletterDesc', 'Recevez nos offres et actualités')}</p>
          {sent ? (
            <p style={{ color: '#4ade80', fontSize: 13, marginTop: 8 }}>{t('footer.subscribedMsg', '✓ Merci, vous êtes abonné !')}</p>
          ) : (
            <form className="footer__newsletter" onSubmit={handleNewsletter}>
              <input
                type="email"
                className="footer__newsletter-input"
                placeholder={t('footer.emailPlaceholder', 'Votre email')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="footer__newsletter-btn" aria-label={t('footer.subscribeBtn', "S'abonner")}>
                <FiSend size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p className="footer__copyright">
            © {YEAR} {AGENCY.name}. {t('footer.copyright', 'Tous droits réservés.')} ·{' '}
            <a href="https://automedon.tn" target="_blank" rel="noreferrer">Automedon Platforms Technologies</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
