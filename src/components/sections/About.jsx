/* =============================================================================
   ABOUT COMPONENT (About.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the "About" teaser section of the
   Nado Graphics website: a short company introduction with a button to the
   full story, next to the company logo, which rotates as the visitor scrolls.

   What it displays:
   - A small label, a two-part heading and a teaser paragraph.
   - A "Read our story" button linking to the philosophy section of the About page.
   - The company logo, which turns as the section scrolls through the screen.

   How it works:
   - All the text is passed in as props with default values, so the section
     works with no props but can be reused with different wording.
   - A ref gives the code direct access to the logo's <img> element.
   - A useEffect hook adds a scroll listener that works out how far through
     the screen the logo has travelled (a value from -1 to +1) and turns that
     into a rotation from -180deg to +180deg.
   - The rotation is skipped for visitors who have asked their device to
     reduce motion (an accessibility setting).

   Styling is handled in About.css.
   ============================================================================= */

import { useEffect, useRef } from 'react'                  // useEffect runs code after render, useRef holds a reference to a DOM element
import Button from '../ui/Button'                          // Shared button component used across the site
import Logo from '../../assets/Logo.svg'                   // Company logo image
import './About.css'                                       // About-specific styles

// Props with default values: the section works without any props being passed in
export default function About({
  label = 'Our story',                                     // Small label above the heading
  heading = '26+ years of turning ideas',                  // First part of the heading
  quiet = 'into designs worth sharing.',                   // Second part of the heading (shown in a lighter colour)
  teaser = 'It started in the early 2000s with one young designer and a passion for the craft. Here’s how Nado Graphics grew from there.', // Paragraph under the heading
}) {
  // A ref lets us reach the real <img> element in the page (not React's virtual copy)
  // so we can change its rotation directly. It starts as null and is filled in once the logo renders.
  const logoRef = useRef(null)

  // The logo turns as the section scrolls past
  // The empty dependency array [] at the bottom means this is set up once, on first load
  useEffect(() => {
    const el = logoRef.current
    // Safety check: if the logo isn't on the page for some reason, stop here
    if (!el) return
    // Respect the visitor's "reduce motion" setting: if it is on, leave the logo still
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Holds the id of a scheduled animation frame. 0 means nothing is scheduled.
    let raf = 0

    // Works out and applies the logo's rotation for the current scroll position
    const update = () => {
      raf = 0 // The scheduled frame has now run, so clear the flag
      // Gets the logo's current size and position relative to the visible screen
      const rect = el.getBoundingClientRect()
      // Height of the visible screen in pixels
      const viewH = window.innerHeight
      // -1 when the logo is at the bottom of the screen, +1 at the top
      // How it works: take the distance between the screen's centre and the logo's centre,
      // then divide by the furthest that distance can get (half the screen plus half the logo).
      // That scales the result to -1 (logo just entering at the bottom), 0 (logo centred
      // on the screen) and +1 (logo just leaving at the top).
      const progress = ((viewH / 2) - (rect.top + rect.height / 2)) / (viewH / 2 + rect.height / 2)
      // Keeps the value between -1 and +1 so the rotation never goes past 180 degrees either way
      const clamped = Math.max(-1, Math.min(1, progress))
      // Turns -1..+1 into -180..+180 degrees and applies it to the logo
      el.style.transform = `rotate(${clamped * 180}deg)`
    }

    // Runs on every scroll or resize event
    const onScroll = () => {
      // Only schedule an update if one isn't already waiting. Scroll events can fire many
      // times per frame, so this limits the work to once per frame and keeps scrolling smooth.
      if (!raf) raf = requestAnimationFrame(update)
    }

    update() // Run once on load so the logo starts at the correct angle
    // passive: true tells the browser this listener won't block scrolling
    window.addEventListener('scroll', onScroll, { passive: true })
    // Recalculate if the window is resized, since the screen height changes
    window.addEventListener('resize', onScroll)
    // Cleanup: runs when the component is removed from the page.
    // Removes both listeners and cancels any pending frame to avoid memory leaks.
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    // id="about" lets other links jump straight to this section.
    // "section" and "snap" are shared classes defined elsewhere in the project.
    <section className="section about-section snap" id="about">
      <div className="wrap">
        <div className="about-layout">
          {/* Text, in reading order: label, heading, teaser, button */}
          <div className="about-text">
            <p className="about-label">{label}</p>
            <h2 className="about-title">
              {heading}
              {/* The second half of the heading sits on its own line in a lighter colour (see About.css) */}
              <span className="quiet">{quiet}</span>
            </h2>
            <p className="about-teaser">{teaser}</p>
            {/* Links to the About page and jumps to the element with id="philosophy".
                variant and arrow are props handled by the shared Button component */}
            <Button to="/about#philosophy" variant="primary" arrow>Read our story</Button>        
              </div>

          {/* Logo that turns as you scroll */}
          <div className="about-mark">
            {/* ref connects this <img> to logoRef so the effect above can rotate it */}
            <img ref={logoRef} src={Logo} alt="Nado Graphics logo" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* =============================================================================
   REFERENCES
   -----------------------------------------------------------------------------
   React Docs: useRef (holds a reference to the logo's DOM element)
   https://react.dev/reference/react/useRef

   MDN Web Docs: Element.getBoundingClientRect (the logo's size and position
   on screen, used to work out the rotation)
   https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

   MDN Web Docs: requestAnimationFrame (runs the update once per screen
   refresh so scrolling stays smooth)
   https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame

   MDN Web Docs: prefers-reduced-motion (the accessibility setting checked
   with matchMedia before animating)
   https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
   ============================================================================= */

// ---------------------------------- END OF FILE ---------------------------------- //