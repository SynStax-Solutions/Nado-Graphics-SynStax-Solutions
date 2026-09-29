import { useEffect, useRef } from 'react'
import Button from '../ui/Button'
import Logo from '../../assets/Logo.svg'
import './About.css'

export default function About({
  label = 'Our story',
  heading = '26+ years of turning ideas',
  quiet = 'into designs worth sharing.',
  teaser = 'It started in the early 2000s with one young designer and a passion for the craft. Here’s how Nado Graphics grew from there.',
}) {
  const logoRef = useRef(null)

  // The logo turns as the section scrolls past
  useEffect(() => {
    const el = logoRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const viewH = window.innerHeight
      // -1 when the logo is at the bottom of the screen, +1 at the top
      const progress = ((viewH / 2) - (rect.top + rect.height / 2)) / (viewH / 2 + rect.height / 2)
      const clamped = Math.max(-1, Math.min(1, progress))
      el.style.transform = `rotate(${clamped * 180}deg)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="section about-section snap" id="about">
      <div className="wrap">
        <div className="about-layout">
          {/* Text, in reading order: label, heading, teaser, button */}
          <div className="about-text">
            <p className="about-label">{label}</p>
            <h2 className="about-title">
              {heading}
              <span className="quiet">{quiet}</span>
            </h2>
            <p className="about-teaser">{teaser}</p>
            <Button to="/about#philosophy" variant="primary" arrow>Read our story</Button>        
              </div>

          {/* Logo that turns as you scroll */}
          <div className="about-mark">
            <img ref={logoRef} src={Logo} alt="Nado Graphics logo" />
          </div>
        </div>
      </div>
    </section>
  )
}