import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import AdminStrip from '../../components/AdminStrip/AdminStrip'
import Hero from '../../components/Hero/Hero'
import BookingForm from '../../components/BookingForm/BookingForm'
import Features from '../../components/Features/Features'
import CarCategories from '../../components/CarCategories/CarCategories'
import Footer from '../../components/Footer/Footer'
import Destinations from '../../components/Destinations/Destinations'
import Concierge from '../../components/Concierge/Concierge'
import './Home.css'

export default function Home() {
  const [introVisible, setIntroVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = sessionStorage.getItem('bouguila-home-intro')
    let introTimer
    if (!reduced && !seen) {
      setIntroVisible(true)
      sessionStorage.setItem('bouguila-home-intro', '1')
      introTimer = window.setTimeout(() => setIntroVisible(false), 1250)
    }

    let ticking = false
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight
      setProgress(available > 0 ? Math.min(1, window.scrollY / available) : 0)
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(updateProgress)
      }
    }
    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(introTimer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      {introVisible && (
        <div className="home-intro" aria-hidden="true">
          <div className="home-intro__mark">
            <img src="/images/bouguila-logo.webp" alt="" width="78" height="78" />
            <span>BOUGUILA CAR</span>
            <i />
          </div>
        </div>
      )}
      <div className="home-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      <AdminStrip />
      <Navbar home />
      <main className="home-main">
        <Hero />
        <BookingForm />
        <Features />
        <CarCategories />
        <Destinations />
        <Concierge />
      </main>
      <Footer />
    </>
  )
}
