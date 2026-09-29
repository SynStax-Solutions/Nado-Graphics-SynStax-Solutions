import './Marquee.css'

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

export default function Marquee({ items = DEFAULT_ITEMS }) {
  // The list is repeated once so the loop runs without a gap
  const track = [...items, ...items]
  return (
    <div className="marquee" aria-label={`Our services: ${items.join(', ')}`}>
      <div className="marquee-track" aria-hidden="true">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-item">
            {item}
            <span className="marquee-sep">|</span>
          </span>
        ))}
      </div>
    </div>
  )
}