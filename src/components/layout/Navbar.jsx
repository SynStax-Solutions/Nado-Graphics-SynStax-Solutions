import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Logo from '../../assets/Logo.svg'
import './Navbar.css'

const LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/clients', label: 'Our Clients' },
  { path: '/services', label: 'Our Services' },
  { path: '/portfolio', label: 'Our Work' },
  { path: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const [scrolled, setScrolled] = useState(false)

  // Show a faint line under the navbar once the page has scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  // Close the mobile menu whenever the page changes
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
       <nav className={`site-nav ${open ? 'is-open' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap navbar-inner">

        {/* Logo */}
        <Link to="/" className="logo" aria-label="Nado Graphics home">
          <img src={Logo} alt="" className="logo-mark" />
        </Link>

        {/* Page navigation */}
        <div className="navlinks" id="site-menu">
          {LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={isActive(link.path) ? 'active' : ''}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Call to action */}
        <Link to="/contact" className="nav-cta">
          Start a project
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span></span>
          <span></span>
        </button>

      </div>
    </nav>
  )
}