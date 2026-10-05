/* =============================================================================
   VALUES COMPONENT (Values.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the "How we work" section of the
   Nado Graphics website: three numbered cards (Communicate, Collaborate,
   Create) that stack on top of each other as the visitor scrolls.

   What it displays:
   - An eyebrow label ("The process") and a heading ("How we work.").
   - Three cards, each with a number, a title and a short description.

   How it works:
   - The three values are stored in one array (VALUES) and turned into cards
     with .map(), so adding a value only requires adding an object to the array.
   - Each card is given its position in the list as a CSS variable (--i), which
     Values.css uses to make each card stick a little lower than the one before.
   - The sticking itself is done by CSS (position: sticky). The extra effect,
     where a card shrinks and fades as the next one covers it, is done here
     with JavaScript:
       1. A useEffect hook adds a scroll listener.
       2. On each scroll, for every card it measures how far the next card is
          from covering it, as a value from 0 (not covered) to 1 (fully covered).
       3. That value is turned into a scale (down to 96%) and an opacity
          (down to 65%) applied to the card underneath.
   - The effect is skipped for visitors who have asked their device to reduce
     motion, so the cards simply stack without shrinking.

   Styling is handled in Values.css, plus shared classes (nd-eyebrow, nd-heading)
   that are defined elsewhere in the project.
   ============================================================================= */

import { useEffect, useRef } from 'react'              // useEffect runs code after render, useRef holds a reference to a DOM element
import Reveal from '../ui/Reveal'                      // Wrapper that animates its content in when it appears on screen
import './Values.css'                                  // Values-specific styles

// The three values shown as cards. Each has:
//   num   -> the number shown in the badge
//   title -> the card heading
//   desc  -> the card description
//   tone  -> which badge colour to use (becomes the class tone-ink, tone-yellow or tone-soft)
const VALUES = [
  {
    num: '01',
    title: 'Communicate',
    desc: 'Every project starts with a conversation. We listen, ask questions and get to the heart of what you are trying to achieve.',
    tone: 'ink',
  },
  {
    num: '02',
    title: 'Collaborate',
    desc: 'We work alongside you throughout the process, sharing ideas, refining directions and making decisions together.',
    tone: 'yellow',
  },
  {
    num: '03',
    title: 'Create',
    desc: 'Once the direction is right, we bring it to life through thoughtful design and quality print.',
    tone: 'soft',
  },
]

export default function Values() {
  // A ref lets us reach the real <ol> element in the page (not React's virtual copy)
  // so we can find the cards inside it. It starts as null and is filled in once the list renders.
  const listRef = useRef(null)

  // As each new card slides over, the card underneath shrinks back slightly
  // The empty dependency array [] at the bottom means this is set up once, on first load
  useEffect(() => {
    const list = listRef.current
    // Safety check: if the list isn't on the page for some reason, stop here
    if (!list) return
    // Respect the visitor's "reduce motion" setting: if it is on, skip the shrink and fade effect
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Collect every card inside the list into a real array so it can be looped over
    const cards = Array.from(list.querySelectorAll('.step-card'))
    // Holds the id of a scheduled animation frame. 0 means nothing is scheduled.
    let raf = 0

    // Works out and applies the shrink and fade for every card at the current scroll position
    const update = () => {
      raf = 0 // The scheduled frame has now run, so clear the flag
      cards.forEach((card, i) => {
        // The card that comes after this one. The last card has no next card, so it is never shrunk.
        const next = cards[i + 1]
        if (!next) return
        // How far each card's top edge is from the top of the visible screen
        const cardTop = card.getBoundingClientRect().top
        const nextTop = next.getBoundingClientRect().top
        // This card's height in pixels
        const h = card.offsetHeight
        // 0 while the next card is a full card-height away, 1 once it has fully covered this one
        // (nextTop - cardTop) is the gap between the two cards' tops. Dividing by the card height
        // turns it into a fraction, and "1 -" flips it so a smaller gap means a bigger result.
        // Math.max and Math.min clamp the result between 0 and 1.
        const covered = Math.max(0, Math.min(1, 1 - (nextTop - cardTop) / h))
        // Shrink by up to 4% (scale 1 down to 0.96) and fade by up to 35% (opacity 1 down to 0.65)
        card.style.transform = `scale(${1 - covered * 0.04})`
        card.style.opacity = `${1 - covered * 0.35}`
      })
    }

    // Runs on every scroll or resize event
    const onScroll = () => {
      // Only schedule an update if one isn't already waiting. Scroll events can fire many
      // times per frame, so this limits the work to once per frame and keeps scrolling smooth.
      if (!raf) raf = requestAnimationFrame(update)
    }

    update() // Run once on load so the cards start in the correct state
    // passive: true tells the browser this listener won't block scrolling
    window.addEventListener('scroll', onScroll, { passive: true })
    // Recalculate if the window is resized, since card sizes and positions change
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
    // id="values" lets other links jump straight to this section
    <section className="nd-values" id="values">
      <div className="wrap">
        {/* Small label above the heading. With no "as" prop, Reveal falls back to its default element */}
        <Reveal className="nd-eyebrow">The process</Reveal>

        {/* "as" sets which HTML tag Reveal renders (here an <h2>), and "delay" staggers the timing
            so this appears after the label. The delay unit is set inside Reveal */}
        <Reveal as="h2" className="nd-heading nd-values-title" delay={80}>
          How we work.
        </Reveal>

        {/* Cards stick near the top and stack on each other as you scroll */}
        {/* An ordered list (<ol>), since the cards are steps in a sequence.
            ref connects it to listRef so the effect above can find the cards */}
        <ol ref={listRef} className="step-stack">
          {/* Loop through the values and create one card for each.
              i is the position in the list (0, 1, 2) */}
          {VALUES.map((v, i) => (
            <li
              key={v.num}
              // Builds the class list, for example "step-card tone-ink". The tone class picks the badge colour.
              className={`step-card tone-${v.tone}`}
              // Passes the card's position to CSS as a custom property (--i). Values.css uses it
              // in calc() so each card sticks lower than the last.
              style={{ '--i': i }}
            >
              <span className="step-num">{v.num}</span>
              <h3 className="step-title">{v.title}</h3>
              <p className="step-desc">{v.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* =============================================================================
   REFERENCES
   -----------------------------------------------------------------------------
   MDN Web Docs: Element.getBoundingClientRect (each card's position on screen,
   used to work out how far the next card is from covering it)
   https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

   MDN Web Docs: requestAnimationFrame (runs the update once per screen
   refresh so scrolling stays smooth)
   https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
   ============================================================================= */

// ---------------------------------- END OF FILE ---------------------------------- //