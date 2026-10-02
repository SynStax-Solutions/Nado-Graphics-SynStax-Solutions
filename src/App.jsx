import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import Hero from './components/sections/Hero'
import Marquee from './components/sections/Marquee'
import About from './components/sections/About'
import WorkGrid from './components/sections/WorkGrid'
import ScrollLine from './components/ui/ScrollLine'

import SmoothScroll from './SmoothScroll'
import ScrollToTop from './ScrollToTop'

import AboutPage from './pages/AboutPage'
import PortfolioPage from './pages/PortfolioPage'
import ContactPage from './pages/ContactPage'
import ServicesPage from './pages/ServicesPage'
import ClientsPage from './pages/ClientsPage'
import PrivacyPage from './pages/PrivacyPage'

import './App.css'


function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <WorkGrid />
      <ScrollLine />
      <About />
    </>
  )
}


export default function App() {
  return (
    <Router>
      <SmoothScroll />
      <ScrollToTop />

      <div className="app">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} /> 
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/contact" element={<ContactPage />} /> 
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}