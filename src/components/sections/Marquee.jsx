/* =============================================================================
   MARQUEE COMPONENT (Marquee.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the scrolling marquee on the Nado Graphics
   website: a continuous row of the agency's services that moves across the
   screen, like a news ticker.

   What it displays:
   - A single row of service names (CONCEPT, DESIGN, PRINT and so on), each
     followed by a "|" separator.

   How it works:
   - The service names come from an array. A default list is provided, but a
     different list can be passed in as the items prop.
   - The list is copied and joined onto itself, so every item appears twice in
     the row. The CSS animation in Marquee.css slides the row left by exactly
     half its width, which is the length of one full copy. At that point the
     second copy sits where the first one started, so the animation restarts
     with no visible jump or gap.
   - Screen readers: the moving row is hidden from them (aria-hidden) and the
     container carries one aria-label with the full list instead. Without this,
     a screen reader would read every service twice.

   Styling and the scrolling animation are in Marquee.css.
   ============================================================================= */

import './Marquee.css'                         // Marquee styles and the scrolling animation

// Default list of services shown if no items prop is passed in
const DEFAULT_ITEMS = [
  'CONCEPT', 'DESIGN', 'PRINT', 'WEB',
  'ANIMATED EXPLAINER VIDEOS', 'SOCIAL MEDIA ANIMATED POSTS', 'PUBLICATION DESIGN',
  'ANNUAL REPORT DESIGN', 'LOGO DESIGN PACKAGES', 'BUSINESS CARDS', 'FLYER DESIGN',
  'POSTER DESIGN', 'BANNER DESIGN', 'FOLDER DESIGN', 'BROCHURE DESIGN', 'SIGNAGE',
  'BRANDING', 'T-SHIRTS', 'CAPS', 'GAZEBOS', 'FLAG BANNERS', 'NOTEPADS', 'MAGNETS',
  'BUTTON BADGES', 'LAPEL BADGES', 'FRAMING', 'CORPORATE INVITES', 'LICENCE DISCS',
  'CORPORATE GIFTS', 'CALENDARS', 'LITHO AND DIGITAL PRINTING',
  'GIFT BAGS', 'CANVAS PRINTING', 'BRANDED USBs',
]

// items has a default value, so the marquee works without any props being passed in
export default function Marquee({ items = DEFAULT_ITEMS }) {
  // The list is repeated once so the loop runs without a gap
  // The spread operator (...) copies the items into a new array, and listing it twice
  // joins two copies end to end: [A, B, C] becomes [A, B, C, A, B, C]
  const track = [...items, ...items]
  return (
    // aria-label gives screen readers a single description of the whole list,
    // built by joining the items with commas (for example "Our services: CONCEPT, DESIGN, ...")
    <div className="marquee" aria-label={`Our services: ${items.join(', ')}`}>
      {/* aria-hidden hides the moving row from screen readers, so the duplicated
          items aren't read out twice (the aria-label above covers them instead) */}
      <div className="marquee-track" aria-hidden="true">
        {/* Loop through the doubled list and create one <span> for each entry.
            i is the position in the list. */}
        {track.map((item, i) => (
          // The key must be unique, and because every item now appears twice, the
          // item name alone isn't enough. Adding the position (i) makes each key unique.
          <span key={`${item}-${i}`} className="marquee-item">
            {item}
            {/* Separator after every item, including the last one in each copy.
                That keeps both halves exactly the same width, which the -50% loop in the CSS needs. */}
            <span className="marquee-sep">|</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------- END OF FILE ---------------------------------- //