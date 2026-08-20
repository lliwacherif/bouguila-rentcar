import Navbar from '../../components/Navbar/Navbar'
import AdminStrip from '../../components/AdminStrip/AdminStrip'
import Hero from '../../components/Hero/Hero'
import BookingForm from '../../components/BookingForm/BookingForm'
import Features from '../../components/Features/Features'
import CarCategories from '../../components/CarCategories/CarCategories'
import PromoBanner from '../../components/PromoBanner/PromoBanner'
import Stats from '../../components/Stats/Stats'
import AppDownload from '../../components/AppDownload/AppDownload'
import Footer from '../../components/Footer/Footer'

export default function Home() {
  return (
    <>
      <AdminStrip />
      <Navbar />
      <main>
        <Hero />
        <BookingForm />
        <Features />
        <CarCategories />
        <PromoBanner />
        <Stats />
        <AppDownload />
      </main>
      <Footer />
    </>
  )
}
