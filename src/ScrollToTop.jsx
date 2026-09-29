import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/*
  Runs every time the page changes.
  - Normal links: start the new page at the top.
  - Links with a # (e.g. /about#philosophy): jump to that section instead,
    leaving room for the sticky navbar.
*/
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    // Stop the browser from restoring the old scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const jumpTo = (y) => {
      window.__lenis?.scrollTo(y, { immediate: true, force: true })
      window.scrollTo(0, y)
    }

    if (hash) {
      const goToSection = () => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (!el) return false
        const navHeight = document.querySelector('.site-nav')?.offsetHeight ?? 0
        jumpTo(el.getBoundingClientRect().top + window.scrollY - navHeight - 16)
        return true
      }

      if (goToSection()) {
        // Check again once images and fonts have settled, in case the page shifted
        const timer = setTimeout(goToSection, 300)
        return () => clearTimeout(timer)
      }
    }

    jumpTo(0)
  }, [pathname, hash])

  return null
}