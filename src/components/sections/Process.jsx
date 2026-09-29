import { useState } from 'react'
import './Process.css'

// The full list of services, grouped. Moved here from the About page.
const SERVICE_GROUPS = [
  {
    label: 'Brand & Identity',
    items: ['Branding', 'Logo Design Packages', 'Concept & Design'],
  },
  {
    label: 'Print Collateral',
    items: [
      'Business Cards', 'Flyer Design', 'Poster Design', 'Banner Design',
      'Folder Design', 'Brochure Design', 'Notepads', 'Calendars',
      'Litho & Digital Printing', 'Canvas Printing',
    ],
  },
  {
    label: 'Publications',
    items: ['Publication Design', 'Annual Report Design'],
  },
  {
    label: 'Signage & Large Format',
    items: ['Signage', 'Flag Banners', 'Gazebos'],
  },
  {
    label: 'Promo & Corporate Gifting',
    items: [
      'T-Shirts', 'Caps', 'Magnets', 'Button Badges', 'Lapel Badges',
      'Corporate Gifts', 'Branded USBs', 'Gift Bags', 'Framing',
      'Corporate Invites', 'Licence Discs',
    ],
  },
  {
    label: 'Digital & Motion',
    items: [
      'Animated Explainer Videos',
      'Social Media Animated Posts',
    ],
  },
]

export default function Process({
  heading = 'Services',
  quiet = 'Everything from a single logo to a campus-wide rollout.',
  groups = SERVICE_GROUPS,
  showHead = true,
}) {
  // The first group starts open; set to null to start with everything closed
  const [open, setOpen] = useState(0)

  return (
    <section className="section services-section snap" id="services">
      <div className="wrap">
        {/* The heading is hidden on the Services page, which has its own intro */}
        {showHead && (
          <div className="services-head">
            <h2 className="services-title">
              {heading}
              <span className="quiet">{quiet}</span>
            </h2>
            <p className="services-total">
              {groups.reduce((n, g) => n + g.items.length, 0)}+ services
            </p>
          </div>
        )}

        <div className="services-list">
          {groups.map((group, i) => {
            const isOpen = open === i
            return (
              <div className={`service-row ${isOpen ? 'is-open' : ''}`} key={group.label}>
                <button
                  type="button"
                  className="service-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`service-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <h3>{group.label}</h3>
                  <span className="service-meta">
                    <span className="service-count">{group.items.length} services</span>
                    <span className="service-icon" aria-hidden="true">&#8595;</span>
                  </span>
                </button>
                <div className="service-body" id={`service-${i}`} role="region">
                  <div>
                    <ul className="service-chips">
                      {group.items.map((item) => (
                        <li key={item} className="service-chip">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}