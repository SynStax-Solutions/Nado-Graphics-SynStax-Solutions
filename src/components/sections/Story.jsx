/* =============================================================================
   STORY COMPONENT (Story.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the "Our philosophy" section of the
   Nado Graphics website: a short company story whose words light up one by
   one as the visitor scrolls, followed by three headline figures.

   What it displays:
   - A small eyebrow label ("Our philosophy").
   - The company story as one large statement. Every word starts faded out and
     becomes fully visible as the visitor scrolls past it, so the text appears
     to be "read" as the page moves.
   - Three figures (for example "20+") with a short description under each.

   How it works:
   - The story is stored as one string and split into separate words. Each word
     is rendered in its own <span>, so its opacity can be changed individually.
   - A useEffect hook adds a scroll listener. On every scroll, it works out how
     far through the screen the text has travelled (a value from 0 to 1),
     converts that into how many words should be lit, and sets each word's
     opacity from faint (0.15) up to full (1).
   - The effect is skipped for visitors who have asked their device to reduce
     motion: every word is simply shown at full opacity straight away.
   - Story.css sets each word's starting opacity and the short fade between
     changes. This file changes the opacity itself while scrolling.

   Styling is handled in Story.css, plus shared classes (nd-eyebrow, nd-figures,
   nd-figure, nd-figure-value) that are defined elsewhere in the project.
   ============================================================================= */

import { useEffect, useRef } from 'react'              // useEffect runs code after render, useRef holds a reference to a DOM element
import Reveal from '../ui/Reveal'                      // Wrapper that animates its content in when it appears on screen
import './Story.css'                                   // Story-specific styles

// The story, as one statement. Each word lights up as you scroll past.
const STORY =
  'Nado Graphics began in the early 2000s with a young designer and a passion for turning ideas into something people could see and remember. Years of hands-on work and mentorship later, every project is still a chance to push the craft a little further.'

// The three figures shown under the story. Each has a big value and a short description.
const STATS = [
  { value: '20+', text: 'Years of experience turning ideas into visual identities.' },
  { value: '40+', text: 'Brands brought to life across print, digital and motion.' },
  { value: '1', text: 'Passion for design that has never stopped evolving.' },
]

export default function Story() {
  // A ref lets us reach the real <p> element in the page (not React's virtual copy)
  // so we can measure it and find the words inside it. It starts as null and is filled in once the text renders.
  const textRef = useRef(null)

  // Split the story into an array of words by cutting at every space
  const words = STORY.split(' ')

  // Sets up the scroll effect. The empty dependency array [] at the bottom means this runs once, on first load
  useEffect(() => {
    const block = textRef.current
    // Safety check: if the text isn't on the page for some reason, stop here
    if (!block) return
    // Collect every word <span> inside the text into a real array so it can be looped over
    const spans = Array.from(block.querySelectorAll('.story-word'))

    // No animation for people who turned it off: show every word lit
    // This checks the visitor's "reduce motion" setting. If it is on, every word is set to full opacity and we stop here.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.forEach((s) => (s.style.opacity = 1))
      return
    }

    // Holds the id of a scheduled animation frame. 0 means nothing is scheduled.
    let raf = 0

    // Works out and applies each word's opacity for the current scroll position
    const update = () => {
      raf = 0 // The scheduled frame has now run, so clear the flag
      // Gets the text block's current size and position relative to the visible screen
      const rect = block.getBoundingClientRect()
      // Height of the visible screen in pixels
      const viewH = window.innerHeight
      // Starts when the text reaches 80% down the screen, done when its bottom reaches the middle
      const start = viewH * 0.8   // The "start line": 80% of the way down the screen
      const end = viewH * 0.5     // The "finish line": the middle of the screen
      // progress is 0 when the top of the text is on the start line, and 1 when the bottom of the text
      // reaches the finish line. The distance travelled between those two moments is the text's own
      // height plus the gap between the lines, which is what we divide by.
      const progress = (start - rect.top) / (rect.height + (start - end))
      // Keep progress between 0 and 1, then multiply by the number of words.
      // lit is how many words should be lit by now (for example 12.5 means 12 words and half of the 13th)
      const lit = Math.max(0, Math.min(1, progress)) * spans.length

      spans.forEach((span, i) => {
        // Each word fades from faint to full as the "lit" point passes it
        // lit - i is how far past this word the lit point is. Below 0 it hasn't been reached,
        // above 1 it is fully passed. Clamping to 0 and 1 makes each word fade over one "word's worth" of scrolling.
        const amount = Math.max(0, Math.min(1, lit - i))
        // Opacity runs from 0.15 (matching the starting opacity in Story.css) up to 1
        span.style.opacity = 0.15 + amount * 0.85
      })
    }

    // Runs on every scroll or resize event
    const onScroll = () => {
      // Only schedule an update if one isn't already waiting. Scroll events can fire many
      // times per frame, so this limits the work to once per frame and keeps scrolling smooth.
      if (!raf) raf = requestAnimationFrame(update)
    }

    update() // Run once on load so the words start at the correct opacity
    // passive: true tells the browser this listener won't block scrolling
    window.addEventListener('scroll', onScroll, { passive: true })
    // Recalculate if the window is resized, since the screen height and text layout change
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
    // id="philosophy" lets other links jump straight to this section
    // (the "Read our story" button in About.jsx links to /about#philosophy)
    <section className="nd-story" id="philosophy">
      <div className="wrap">
        {/* Small label above the statement. "as" sets which HTML tag Reveal renders (here a <p>) */}
        <Reveal as="p" className="nd-eyebrow">Our philosophy</Reveal>

        {/* ref connects this <p> to textRef so the effect above can measure it and find its words */}
        <p ref={textRef} className="story-lit">
          {/* Loop through the words and create one <span> for each, so each can be faded separately.
              The index is used as the key, which is fine here because the list never changes */}
          {words.map((word, i) => (
            <span key={i} className="story-word">
              {/* {' '} adds a space after each word, because JSX would otherwise remove the space between spans */}
              {word}{' '}
            </span>
          ))}
        </p>

        {/* Row of three figures. nd-story-stats (in Story.css) adds the space above it */}
        <div className="nd-figures nd-story-stats">
          {/* One figure for each entry in STATS. delay staggers the timing so they appear one after another:
              the first starts at 120 and each next one adds 80. The delay unit is set inside Reveal. */}
          {STATS.map((stat, i) => (
            <Reveal className="nd-figure" key={stat.value + stat.text} delay={120 + i * 80}>
              <span className="nd-figure-value">{stat.value}</span>
              <p>{stat.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =============================================================================
   REFERENCES
   -----------------------------------------------------------------------------
   MDN Web Docs: Element.getBoundingClientRect (the text block's size and
   position on screen, used to work out the scroll progress)
   https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

   MDN Web Docs: requestAnimationFrame (runs the update once per screen
   refresh so scrolling stays smooth)
   https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame

   MDN Web Docs: prefers-reduced-motion (the accessibility setting checked
   with matchMedia before animating)
   https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
   ============================================================================= */

// ---------------------------------- END OF FILE ---------------------------------- //