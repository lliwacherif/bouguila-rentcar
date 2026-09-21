import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiUser, FiPhone, FiChevronDown, FiMenu, FiX, FiLogOut, FiGrid, FiClock } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import CurrencyToggle from '../CurrencyToggle/CurrencyToggle'
import { AGENCY } from '../../constants/agency'
import './Navbar.css'

export default function Navbar({ home = false }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, openAuthModal, logout } = useAuth()
  const { lang, setLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const langRef = useRef(null)
  const isAdmin = user?.role === 'admin'

  useEffect(() => { setMobileOpen(false); setLangDropdownOpen(false) }, [location.pathname])
  useEffect(() => {
    if (!home) return undefined
    const onScroll = () => setScrolled(window.scrollY > 42)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [home])
  useEffect(() => {
    const dismiss = e => { if (e.key === 'Escape') { setMobileOpen(false); setLangDropdownOpen(false) } }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [])

  const navLinks = [
    { key: 'accueil',     href: '/',             label: t('nav.accueil', 'Accueil') },
    { key: 'voitures',    href: '/voitures',     label: t('nav.voitures', 'Voitures') },
    { key: 'guide',       href: '/guide',        label: t('nav.guide', 'Guide') },
    { key: 'contact',     href: '/contact',      label: t('nav.contact', 'À Propos') },
  ]

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={`navbar${home ? ' navbar--home' : ''}${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img src="/images/bouguila-logo.webp" alt="" className="navbar__logo-img" width="49" height="49" />
          <span className="navbar__wordmark"><strong>BOUGUILA CAR</strong><small>LOCATION · TUNISIE</small></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar__nav">
          {navLinks.map(link => (
            <Link
              key={link.key}
              to={link.href}
              className={`navbar__link ${location.pathname === link.href ? 'navbar__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="navbar__actions">
          {/* Currency Toggle */}
          <CurrencyToggle />

          {/* Language Selector Dropdown */}
          <div className="navbar__lang-wrap" ref={langRef}>
            <button
              type="button"
              className="navbar__lang"
              onClick={() => setLangDropdownOpen(prev => !prev)}
              aria-label={lang === 'ar' ? 'العربية' : 'Français'}
              aria-expanded={langDropdownOpen}
            >
              <img
                src={lang === 'ar' ? '/Ar.png' : '/Fr.png'}
                alt=""
                className="navbar__lang-flag"
                width={16}
                height={11}
              />
              <span className="navbar__lang-name">{lang === 'ar' ? 'العربية' : 'Français'}</span>
              <span className="navbar__lang-code">{lang === 'ar' ? 'AR' : 'FR'}</span>
              <FiChevronDown size={13} className={`navbar__lang-chevron${langDropdownOpen ? ' navbar__lang-chevron--open' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="navbar__lang-dropdown">
                <button
                  type="button"
                  className={`navbar__lang-opt ${lang === 'fr' ? 'active' : ''}`}
                  onClick={() => { setLanguage('fr'); setLangDropdownOpen(false) }}
                >
                  <img src="/Fr.png" alt="" className="navbar__lang-flag" width={16} height={11} />
                  <span>Français</span>
                </button>
                <button
                  type="button"
                  className={`navbar__lang-opt ${lang === 'ar' ? 'active' : ''}`}
                  onClick={() => { setLanguage('ar'); setLangDropdownOpen(false) }}
                >
                  <img src="/Ar.png" alt="" className="navbar__lang-flag" width={16} height={11} />
                  <span>العربية</span>
                </button>
              </div>
            )}
          </div>

          {user ? (
            <div className="navbar__user-menu">
              {isAdmin && (
                <Link to="/admin" className="navbar__admin-badge">
                  <FiGrid size={13} /> {t('nav.admin', 'Admin')}
                </Link>
              )}
              {!isAdmin && (
                <Link
                  to="/historique"
                  className="navbar__admin-badge"
                  title={t('nav.historique', 'Historique')}
                  style={{ gap: 5 }}
                >
                  <FiClock size={13} /> {t('nav.historique', 'Historique')}
                </Link>
              )}
              <span className="navbar__user-name">
                <FiUser size={15} /> {user.firstName}
              </span>
              <button
                className="navbar__user navbar__user--logout"
                onClick={handleLogout}
                title={t('nav.logout', 'Déconnexion')}
              >
                <FiLogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="navbar__user" onClick={() => openAuthModal('login')} title={t('nav.login', 'Se connecter')}>
              <FiUser size={17} />
            </button>
          )}

          <a href={`tel:${AGENCY.phoneTel}`} className="navbar__phone">
            <FiPhone size={14} />
            <span>{AGENCY.phoneDisplay}</span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen} aria-controls="mobile-navigation">
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav id="mobile-navigation" className="navbar__mobile" aria-label={t('nav.accueil', 'Navigation')}>
          <div className="navbar__mobile-toolbar">
            <CurrencyToggle />
            <div className="navbar__mobile-langs">
              <button
                type="button"
                className={`navbar__mobile-lang-btn ${lang === 'fr' ? 'navbar__mobile-lang-btn--active' : ''}`}
                onClick={() => setLanguage('fr')}
              >
                <img src="/Fr.png" alt="" className="navbar__lang-flag" width={16} height={11} />
                Français
              </button>
              <button
                type="button"
                className={`navbar__mobile-lang-btn ${lang === 'ar' ? 'navbar__mobile-lang-btn--active' : ''}`}
                onClick={() => setLanguage('ar')}
              >
                <img src="/Ar.png" alt="" className="navbar__lang-flag" width={16} height={11} />
                العربية
              </button>
            </div>
          </div>
          {(isAdmin
            ? [{ key: 'admin', label: t('nav.tableauDeBord', 'Dashboard'), href: '/admin' }, ...navLinks]
            : [...navLinks, { key: 'historique', label: `🕐 ${t('nav.historique', 'Historique')}`, href: '/historique' }]
          ).map(link => (
            <Link
              key={link.key}
              to={link.href}
              className="navbar__mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              className="navbar__mobile-link"
              onClick={() => { handleLogout(); setMobileOpen(false) }}
            >
              <FiLogOut size={14} /> {t('nav.logout', 'Déconnexion')}
            </button>
          ) : (
            <button
              className="navbar__mobile-link"
              onClick={() => { openAuthModal('login'); setMobileOpen(false) }}
            >
              <FiUser size={14} /> {t('nav.login', 'Se connecter')}
            </button>
          )}
          <a href={`tel:${AGENCY.phoneTel}`} className="navbar__mobile-phone">
            <FiPhone size={14} /> {AGENCY.phoneDisplay}
          </a>
        </nav>
      )}
    </header>
  )
}
