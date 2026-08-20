import { useState } from 'react'
import { FiSend, FiCheckCircle } from 'react-icons/fi'
import Navbar from '../../components/Navbar/Navbar'
import AdminStrip from '../../components/AdminStrip/AdminStrip'
import Footer from '../../components/Footer/Footer'
import { useLanguage } from '../../context/LanguageContext'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setFormData({ name: '', email: '', phone: '', message: '' })
    }, 4000)
  }

  const features = [
    { icon: '🚗', title: t('features.fleetTitle', 'Large choix de véhicules'), desc: t('features.fleetDesc', 'Économiques, berlines, SUV, luxe ou utilitaires.') },
    { icon: '💰', title: t('features.priceTitle', 'Meilleurs prix garantis'), desc: t('features.priceDesc', 'Des tarifs transparents, compétitifs et sans frais cachés.') },
    { icon: '🕒', title: t('features.cancelTitle', 'Annulation gratuite'), desc: t('features.cancelDesc', 'Annulez ou modifiez sans frais supplémentaires.') },
    { icon: '🎧', title: t('features.supportTitle', 'Service client disponible'), desc: t('features.supportDesc', 'Notre équipe est joignable par téléphone et e-mail.') },
    { icon: '📅', title: t('guide.step3Badge', 'Paiement en agence'), desc: t('guide.step3Desc', 'Réservez en ligne gratuitement et payez l\'acompte directement à notre agence.') },
    { icon: '📁', title: t('guide.statusSectionTitle', 'Transparence totale'), desc: t('guide.statusSectionSub', 'Suivi de vos réservations en temps réel.') },
  ]

  return (
    <div className="contact-page">
      <AdminStrip />
      <Navbar />

      <main className="contact-container container">
        {/* Title Header */}
        <div className="contact-header">
          <h1 className="contact-title">
            {t('contact.titleMain', 'À PROPOS D\'')}
            <span className="contact-title--gold">{t('contact.titleGold', 'AUTOMEDON CAR RENTAL SAAS')}</span>
          </h1>
          <p className="contact-subtitle">
            {t('contact.subtitle', 'Plateforme moderne et solution intelligente de location de voitures en Tunisie — au service de votre mobilité avec technologies de pointe.')}
          </p>
        </div>

        {/* Hero Banner: Showroom Team Image */}
        <section className="contact-hero-panel">
          <div className="contact-hero-img-wrap">
            <img src="/agency_team_showroom.png" alt="L'équipe Automedon Car Rental SaaS" />
            <div className="contact-hero-overlay">
              <div className="contact-hero-badge">{t('contact.heroBadge', '📍 Tunisie')}</div>
              <h2>{t('contact.heroTitle', 'Une équipe passionnée à votre service')}</h2>
              <p>{t('contact.heroSub', 'Nous mettons tout en œuvre pour rendre votre expérience de location simple, rapide et transparente.')}</p>
            </div>
          </div>
        </section>

        {/* Agency Info Cards */}
        <div className="contact-info-strip">
          <div className="contact-info-card">
            <div className="contact-info-icon">📞</div>
            <div>
              <div className="contact-info-label">{t('contact.phoneLabel', 'Téléphone')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <a href="tel:+21629662305" className="contact-info-value">+216 29 662 305</a>
              </div>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon">✉️</div>
            <div>
              <div className="contact-info-label">{t('contact.emailLabel', 'Email')}</div>
              <a href="mailto:contact@automedon.tn" className="contact-info-value">contact@automedon.tn</a>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon">📍</div>
            <div>
              <div className="contact-info-label">{t('contact.addressLabel', 'Adresse')}</div>
              <span className="contact-info-value">Monastir, Tunisie</span>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon">🕘</div>
            <div>
              <div className="contact-info-label">{t('contact.hoursLabel', 'Horaires')}</div>
              <span className="contact-info-value">{t('contact.hoursVal', 'Lun–Sam : 08h–19h (Service 24/7 en ligne)')}</span>
            </div>
          </div>
        </div>

        {/* What we offer — 6 feature cards */}
        <section className="contact-card-panel">
          <h2 className="contact-panel-title center">{t('contact.whyTitle', 'Pourquoi choisir Automedon Car Rental SaaS ?')}</h2>
          <p className="contact-panel-sub center">{t('contact.whySub', 'Votre partenaire de confiance pour tous vos déplacements en Tunisie')}</p>

          <div className="contact-features-grid">
            {features.map((f, i) => (
              <div key={i} className="contact-feat-card">
                <div className="contact-feat-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom: Map placeholder + Contact Form */}
        <div className="contact-bottom-grid">
          {/* Map / Location */}
          <div className="contact-card-panel contact-map-panel">
            <h3 className="contact-panel-title">{t('contact.mapTitle', 'Notre emplacement')}</h3>
            <div className="contact-map-embed">
              <iframe
                title="Automedon Car Rental SaaS Monastir"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12975.31291244847!2d10.8113!3d35.7643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302157777174dbd%3A0x7d87b4bceaa1a4c8!2sMonastir%2C%20Tunisia!5e0!3m2!1sen!2stn!4v1680000000000!5m2!1sen!2stn"
                width="100%"
                height="220"
                style={{ border: 0, borderRadius: 10, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
            <div className="contact-map-info">
              <p>🏢 <strong>Automedon Car Rental SaaS</strong></p>
              <p>📍 Monastir, Tunisie</p>
              <p>📞 <a href="tel:+21629662305">+216 29 662 305</a></p>
              <p>✉️ <a href="mailto:contact@automedon.tn">contact@automedon.tn</a></p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-card-panel contact-form-panel">
            <h3 className="contact-panel-title">{t('contact.formTitle', 'Contactez notre équipe')}</h3>

            {sent ? (
              <div className="contact-success-msg">
                <FiCheckCircle size={24} color="#4ade80" />
                <span>{t('contact.successMsg', 'Votre message a bien été envoyé ! Notre équipe vous répondra dans les plus brefs délais.')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <input
                    type="text"
                    required
                    placeholder={t('contact.namePlaceholder', 'Votre nom complet *')}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    required
                    placeholder={t('contact.emailPlaceholder', 'Votre adresse email *')}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="contact-form-row">
                  <input
                    type="tel"
                    placeholder={t('contact.phonePlaceholder', 'Numéro de téléphone')}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--white-50)', paddingLeft: 8, flexWrap: 'wrap', gap: 4 }}>
                    {t('contact.directPhone', '📞 Direct :')} <strong style={{ color: 'var(--gold)' }}>+216 29 662 305</strong>
                  </div>
                </div>

                <textarea
                  required
                  rows={4}
                  placeholder={t('contact.messagePlaceholder', 'Comment pouvons-nous vous aider ? *')}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />

                <button type="submit" className="contact-submit-btn">
                  <FiSend size={15} /> {t('contact.submitBtn', 'Envoyer votre message')}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
