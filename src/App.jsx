/* =============================================================================
   APP COMPONENT (App.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Defines the main structure and routing for the Nado Graphics website.

   What this component does:
   - Sets up browser-based routing using React Router.
   - Displays the Navbar and Footer across the website.
   - Loads the smooth scrolling functionality.
   - Resets the scroll position when navigating between pages.
   - Defines the home page sections.
   - Connects each URL path to its corresponding page component.

   Routes:
   - /          Home page
   - /about     About page
   - /clients   Clients page
   - /services  Services page
   - /portfolio Portfolio page
   - /contact   Contact page
   - /privacy   Privacy page

   Note:
   The HomePage component is kept inside this file because it is only used
   for the main "/" route.
   ============================================================================= */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// ---------- Layout components ----------
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// ---------- Home page sections ----------
import Hero from './components/sections/Hero'
import Marquee from './components/sections/Marquee'
import About from './components/sections/About'
import WorkGrid from './components/sections/WorkGrid'
import ScrollLine from './components/ui/ScrollLine'

// ---------- Site-wide scrolling utilities ----------
import SmoothScroll from './SmoothScroll'
import ScrollToTop from './ScrollToTop'

// ---------- Website pages ----------
import AboutPage from './pages/AboutPage'
import PortfolioPage from './pages/PortfolioPage'
import ContactPage from './pages/ContactPage'
import ServicesPage from './pages/ServicesPage'
import ClientsPage from './pages/ClientsPage'
import PrivacyPage from './pages/PrivacyPage'

// ---------- Global app styles ----------
import './App.css'


/* =============================================================================
   HOME PAGE
   -----------------------------------------------------------------------------
   Purpose:
   Combines the individual sections that make up the website home page.

   Sections:
   - Hero introduction
   - Marquee animation
   - Work/project grid
   - Scroll line
   - About section
   ============================================================================= */

function HomePage() {
  return (
    <>
      {/* ---------- Hero section ---------- */}
      <Hero />

      {/* ---------- Scrolling marquee section ---------- */}
      <Marquee />

      {/* ---------- Featured work section ---------- */}
      <WorkGrid />

      {/* ---------- Decorative scroll line ---------- */}
      <ScrollLine />

      {/* ---------- About section ---------- */}
      <About />
    </>
  )
}


/* =============================================================================
   MAIN APP
   ============================================================================= */

export default function App() {
  return (
    // ---------- Set up browser routing for the website ----------
    <Router>

      {/* ---------- Enable smooth scrolling throughout the application ---------- */}
      <SmoothScroll />

      {/* ---------- Return the page to the top when navigating between routes ---------- */}
      <ScrollToTop />

      <div className="app">

        {/* ---------- Site-wide navigation ---------- */}
        <Navbar />

        <main>

          {/* ---------- Website page routes ---------- */}
          <Routes>

            {/* ---------- Home page ---------- */}
            <Route path="/" element={<HomePage />} />

            {/* ---------- About page ---------- */}
            <Route path="/about" element={<AboutPage />} />

            {/* ---------- Clients page ---------- */}
            <Route path="/clients" element={<ClientsPage />} />

            {/* ---------- Services page ---------- */}
            <Route path="/services" element={<ServicesPage />} />

            {/* ---------- Portfolio page ---------- */}
            <Route path="/portfolio" element={<PortfolioPage />} />

            {/* ---------- Contact page ---------- */}
            <Route path="/contact" element={<ContactPage />} />

            {/* ---------- Privacy policy page ---------- */}
            <Route path="/privacy" element={<PrivacyPage />} />

          </Routes>

        </main>

        {/* ---------- Site-wide footer ---------- */}
        <Footer />

      </div>
    </Router>
  )
}

/* ---------------------------------- END OF FILE ---------------------------------- */