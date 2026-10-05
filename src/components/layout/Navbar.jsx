/* =============================================================================
   NAVBAR COMPONENT (Navbar.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the site-wide navigation bar for the
   Nado Graphics website, shown at the top of every page.

   What it displays:
   - The company logo, linking back to the home page.
   - A list of page links, with the current page highlighted.
   - A "Start a project" call-to-action button linking to the contact page.
   - On mobile, a hamburger button that opens and closes the menu.

   How it works:
   - The page links are stored in one array (LINKS) and rendered with .map(),
     so adding a page only requires adding one line to the array.
   - useLocation() tells the component which page the visitor is on, so the
     matching link can be highlighted.
   - Two pieces of state control the look of the bar:
       open     -> whether the mobile menu is showing
       scrolled -> whether the page has been scrolled (shows a border line)
     These become CSS classes (is-open / is-scrolled) styled in Navbar.css.
   ============================================================================= */

import { useEffect, useState } from 'react'               // React hooks for side effects and state
import { Link, useLocation } from 'react-router-dom'      // Link = page navigation, useLocation = current URL

import Logo from '../../assets/Logo.svg'                  // Company logo image
import './Navbar.css'                                     // Navbar-specific styles

// Navigation links shown in the menu. Each has a URL path and the text displayed.
const LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/clients', label: 'Our Clients' },
  { path: '/services', label: 'Our Services' },
  { path: '/portfolio', label: 'Our Work' },
  { path: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  // Gives us info about the current URL (e.g. location.pathname = '/about')
  const location = useLocation()

  // Tracks whether the mobile menu is open (false = closed)
  const [open, setOpen] = useState(false)

  // Tracks whether the visitor has scrolled down the page (false = at the top)
  const [scrolled, setScrolled] = useState(false)

  // Show a faint line under the navbar once the page has scrolled
  useEffect(() => {
    // Sets scrolled to true once the page is more than 8px from the top
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll() // Run once on load so the state is correct if the page starts already scrolled
    // passive: true tells the browser this listener won't block scrolling, which keeps it smooth
    window.addEventListener('scroll', onScroll, { passive: true })
    // Cleanup: remove the listener when the component is removed, to avoid memory leaks
    return () => window.removeEventListener('scroll', onScroll)
  }, []) // Empty array = only set up once, when the component first loads

  // Close the mobile menu whenever the page changes
  useEffect(() => {
    setOpen(false)
  }, [location.pathname]) // Runs again every time the URL path changes

  // Works out whether a link matches the page the visitor is on
  const isActive = (path) =>
    // Home ('/') must match exactly, otherwise it would be "active" on every page
    // because every path starts with '/'. Other links just need to start with their path,
    // so '/services/web' still highlights 'Our Services'
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    // Template string builds the class list: "is-open" and "is-scrolled" are only added when true
    <nav className={`site-nav ${open ? 'is-open' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap navbar-inner">

        {/* Logo */}
        {/* aria-label gives screen readers a description, since the link only contains an image.
            The image has an empty alt="" so it isn't announced twice */}
        <Link to="/" className="logo" aria-label="Nado Graphics home">
          <img src={Logo} alt="" className="logo-mark" />
        </Link>

        {/* Page navigation */}
        {/* id matches the aria-controls on the hamburger button below */}
        <div className="navlinks" id="site-menu">
          {/* Loop through LINKS and create one <Link> for each entry.
              key helps React track each item in the list efficiently */}
          {LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={isActive(link.path) ? 'active' : ''}           // Adds the highlight style to the current page
              aria-current={isActive(link.path) ? 'page' : undefined}   // Tells screen readers this is the current page
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
        {/* Only visible on small screens (controlled by Navbar.css) */}
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}                              // Tells screen readers if the menu is open or closed
          aria-controls="site-menu"                         // Links the button to the menu it controls
          aria-label={open ? 'Close menu' : 'Open menu'}    // Label changes depending on the menu state
          onClick={() => setOpen((o) => !o)}                // Flips open between true and false on each click
        >
          {/* These two spans are the hamburger lines. CSS turns them into an "X" when open */}
          <span></span>
          <span></span>
        </button>

      </div>
    </nav>
  )
}

/* =============================================================================
   REFERENCES
   -----------------------------------------------------------------------------
   React Docs: useState (stores the open and scrolled values)
   https://react.dev/reference/react/useState

   React Docs: useEffect (the scroll listener and closing the menu on page change)
   https://react.dev/reference/react/useEffect

   React Docs: Rendering lists (using .map() and key to build the links)
   https://react.dev/learn/rendering-lists

   MDN Web Docs: Window.scrollY (how far the page has been scrolled)
   https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY

   MDN Web Docs: addEventListener (the scroll listener and the passive option)
   https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

   MDN Web Docs: Array.prototype.map (loops through the LINKS array)
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

   MDN Web Docs: String.prototype.startsWith (matches sub-pages to their link)
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith

   MDN Web Docs: aria-expanded (tells screen readers if the menu is open)
   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded

   MDN Web Docs: aria-controls (links the button to the menu it controls)
   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls

   MDN Web Docs: aria-current (marks the current page link)
   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current

   MDN Web Docs: aria-label (accessible names for the logo link and menu button)
   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label
   ============================================================================= */

// ---------------------------------- END OF FILE ---------------------------------- //