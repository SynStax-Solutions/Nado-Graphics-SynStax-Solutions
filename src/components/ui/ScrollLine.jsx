/* =============================================================================
   SCROLL LINE COMPONENT (ScrollLine.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Creates the curved scrolling line and kite animation used between sections
   of the Nado Graphics website.

   What this component does:
   - Draws a curved SVG string that responds to the page width.
   - Reveals the string as the user scrolls.
   - Positions the kite at the end of the visible string.
   - Rotates the kite so it faces the direction of travel.
   - Recalculates the curve when the window is resized.
   - Respects the user's reduced-motion preference.

   Props:
   - className: Optional additional CSS class for the outer wrapper.

   Note:
   The component is decorative and is hidden from screen readers using
   aria-hidden="true".
   ============================================================================= */

import { useEffect, useRef } from 'react'
import './ScrollLine.css'

/*
  Store references to the main container, SVG, string path and kite.
  These are used to update the animation directly as the user scrolls.
*/
export default function ScrollLine({ className = '' }) {
  const boxRef = useRef(null)
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const kiteRef = useRef(null)

  useEffect(() => {
    const box = boxRef.current
    const svg = svgRef.current
    const path = pathRef.current
    const kite = kiteRef.current

    // Stop if any of the required elements are not available.
    if (!box || !svg || !path || !kite) return

    // Check whether the user has requested reduced motion.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let length = 0
    let raf = 0

    // -------------------------------------------------------------------------
    // Build the curved string to fit the current container size
    // -------------------------------------------------------------------------
    const layout = () => {
      const W = box.clientWidth
      const H = box.clientHeight

      // Make the SVG match the current width and height of the container.
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)

      const cx = W / 2
      const endX = 40

      // Create the curved path the kite will follow.
      path.setAttribute(
        'd',
        [
          `M ${cx} 0`,
          `C ${cx + W * 0.02} ${H * 0.35}, ${cx + W * 0.16} ${H * 0.55}, ${cx + W * 0.06} ${H * 0.7}`,
          `C ${cx - W * 0.02} ${H * 0.82}, ${cx - W * 0.12} ${H * 0.62}, ${cx - W * 0.2} ${H * 0.6}`,
          `S ${endX + 60} ${H * 0.98}, ${endX} ${H}`,
        ].join(' ')
      )

      // Get the total length of the newly created path.
      length = path.getTotalLength()

      // Use the path length for the scroll-based reveal.
      path.style.strokeDasharray = `${length}`

      draw()
    }

    // -------------------------------------------------------------------------
    // Draw the visible part of the string and position the kite
    // -------------------------------------------------------------------------
    const draw = () => {
      raf = 0

      let p = 1

      if (!reduceMotion) {
        const rect = box.getBoundingClientRect()
        const viewH = window.innerHeight

        // Define when the animation starts and finishes in the viewport.
        const start = viewH * 0.9
        const end = viewH * 0.45

        // Convert the scroll position into a value between 0 and 1.
        p = Math.max(
          0,
          Math.min(
            1,
            (start - rect.top) / (rect.height + (start - end))
          )
        )
      }

      // Reveal the string according to the current scroll progress.
      path.style.strokeDashoffset = `${length * (1 - p)}`

      // -----------------------------------------------------------------------
      // Position and rotate the kite at the visible tip of the string
      // -----------------------------------------------------------------------

      const at = Math.max(1, length * p)

      // Get the current point on the path.
      const tip = path.getPointAtLength(at)

      // Get a point slightly behind the kite to calculate its direction.
      const back = path.getPointAtLength(Math.max(0, at - 2))

      // Calculate the angle of the string at the kite's position.
      const angle =
        (Math.atan2(tip.y - back.y, tip.x - back.x) * 180) / Math.PI

      // Move the kite to the tip of the string and rotate it to face forward.
      kite.style.transform =
        `translate(${tip.x}px, ${tip.y}px) rotate(${angle}deg)`

      // Hide the kite until the string has started drawing.
      kite.style.opacity = p > 0.03 ? 1 : 0
    }

    // -------------------------------------------------------------------------
    // Update the animation while the user scrolls
    // -------------------------------------------------------------------------
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    // Set the initial layout and start listening for changes.
    layout()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', layout)

    // -------------------------------------------------------------------------
    // Clean up event listeners and animation frames
    // -------------------------------------------------------------------------
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', layout)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className={`wrap ${className}`.trim()} aria-hidden="true">
      <div ref={boxRef} className="kite-line">
        <svg ref={svgRef} className="kite-line-svg">
          <path ref={pathRef} className="kite-line-string" />
        </svg>

        {/* -------------------------------------------------------------------
            Kite
            The kite follows the end of the string and has a gentle sway.
            ------------------------------------------------------------------- */}
        <div ref={kiteRef} className="kite-line-kite">
          <svg
            className="kite-line-sway"
            viewBox="-30 -22 60 44"
            width="96"
            height="70"
          >
            {/* Diamond shape using two different yellow shades */}
            <path d="M 26 0 L 0 -16 L -8 0 Z" fill="#fabe3d" />
            <path d="M 26 0 L -8 0 L 0 16 Z" fill="#e3a52a" />

            {/* Spars that form the structure of the kite */}
            <path
              d="M 26 0 L -8 0 M 0 -16 L 0 16"
              stroke="#000"
              strokeWidth="1.2"
              fill="none"
            />

            {/* Small bows forming the kite's tail */}
            <path
              d="M -8 0 C -14 4, -18 -4, -26 1"
              stroke="#000"
              strokeWidth="1"
              fill="none"
            />

            <path
              d="M -15 1 l -3 -3 l 0 6 Z M -22 -1 l -3 -3 l 0 6 Z"
              fill="#000"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- END OF FILE ---------------------------------- */