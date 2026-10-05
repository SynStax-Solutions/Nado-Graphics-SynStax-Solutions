/* =============================================================================
   HERO COMPONENT (Hero.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the hero section at the top of the
   Nado Graphics home page: the company name, a tagline and a button to the
   portfolio, plus a short animated scene played over the section.

   What it displays:
   - A large headline ("Nado Graphics.") with a tagline on a second line
     ("Communicate. Collaborate. Create.").
   - An "Explore our work" button linking to the portfolio page.
   - An animated scene (the StickPusher component) that plays once. When it
     reaches the end of the tagline, the tagline fills from grey to yellow.
     After the scene finishes, it is removed from the page.

   How it works:
   - Two refs give the animation component direct access to the page:
       sectionRef -> the whole hero section
       anchorRef  -> an invisible marker at the end of the tagline, so the
                     animation knows exactly where the text ends
   - Two pieces of state track the animation's progress:
       filled    -> becomes true when the animation arrives, which adds the
                    is-filled class that triggers the colour fill in Hero.css
       sceneDone -> becomes true when the animation finishes, which removes
                    StickPusher from the page
   - The component passes two callback functions to StickPusher (onArrive and
     onDone) so the animation can report back when each stage is reached.

   Styling is handled in Hero.css, plus the shared two-tone class that is
   defined elsewhere in the project.
   ============================================================================= */

import { useRef, useState } from 'react'               // useRef holds references to DOM elements, useState stores changing values
import Button from '../ui/Button'                      // Shared button component used across the site
import StickPusher from '../ui/StickPusher'            // The animated scene played over the hero
import './Hero.css'                                    // Hero-specific styles

// Props with default values: the hero works without any props being passed in
export default function Hero({
  heading = 'Nado Graphics.',                          // First line of the headline
  lead = 'Communicate. Collaborate. Create.',          // Tagline on the second line (receives the colour fill)
}) {
  // Reference to the whole hero section, passed to the animation so it knows the area it plays in.
  // It starts as null and is filled in once the element has rendered.
  const sectionRef = useRef(null)

  // Reference to the invisible marker at the end of the tagline, passed to the animation
  // so it can find where the text ends
  const anchorRef = useRef(null)

  // Whether the tagline has been filled with yellow yet (false = still grey)
  const [filled, setFilled] = useState(false)

  // Whether the animated scene has finished playing (false = still playing)
  const [sceneDone, setSceneDone] = useState(false)

  return (
    // ref connects this <section> to sectionRef. id="hero" lets other links jump straight to this section.
    <section className="hero" id="hero" ref={sectionRef}>
      <div className="wrap hero-inner">
        {/* Main headline. two-tone is a shared class defined elsewhere in the project */}
        <h1 className="two-tone hero-title">
          {heading}
          {/* Second line: starts grey, fills with yellow when the logo reaches "Create." */}
          {/* hero-line puts this on its own line. The is-filled class is only added once
              filled is true, and that class triggers the colour sweep defined in Hero.css */}
          <span className="hero-line">
            <span className={`hero-fill ${filled ? 'is-filled' : ''}`}>
              {lead}
              {/* Invisible marker: where the text ends and where its baseline is */}
              {/* ref connects this marker to anchorRef. aria-hidden hides it from screen readers
                  because it is empty and only exists for positioning */}
              <span ref={anchorRef} className="hero-anchor" aria-hidden="true" />
            </span>
          </span>
        </h1>

        <div className="hero-ctas">
          {/* variant and arrow are props handled by the shared Button component:
              "primary" is the solid style and arrow adds an arrow icon */}
          <Button to="/portfolio" variant="primary" arrow>
            Explore our work
          </Button>
        </div>
      </div>

      {/* Only render the animated scene while it hasn't finished (!sceneDone).
          Once it reports it is done, it is removed from the page entirely.
          onArrive and onDone are callbacks: StickPusher calls them at the right moment.
            onArrive -> sets filled to true, which starts the yellow colour fill
            onDone   -> sets sceneDone to true, which removes the scene */}
      {!sceneDone && (
        <StickPusher
          sectionRef={sectionRef}
          anchorRef={anchorRef}
          onArrive={() => setFilled(true)}
          onDone={() => setSceneDone(true)}
        />
      )}
    </section>
  )
}

// ---------------------------------- END OF FILE ---------------------------------- //