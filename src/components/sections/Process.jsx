/* =============================================================================
   PROCESS / SERVICES COMPONENT (Process.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the services section on the Nado Graphics
   home page: an accordion where each row is a group of services (for example
   "Print Collateral"). Clicking a row opens it to show that group's services
   as small tags.

   What it displays:
   - An optional heading area: a title, a lighter subtitle and the total number
     of services across all groups.
   - A list of rows, one per service group. Each row shows the group name,
     how many services it contains and an arrow icon.
   - When a row is open, the services in that group are shown as tags.

   How it works:
   - The services are stored in one array (SERVICE_GROUPS), grouped by category.
     Adding a service only requires adding a line to the right group.
   - One piece of state (open) stores the index of the open row, or null if
     every row is closed. Only one row can be open at a time, so opening a
     row closes the previous one.
   - The open row gets the is-open class, and the CSS in Process.css uses that
     class to animate the row open and flip the arrow.

   Accessibility:
   - Each row header is a real <button> with aria-expanded and aria-controls,
     so keyboard and screen reader users know what it does and whether it is open.

   Styling is handled in Process.css, plus shared classes (section, snap, wrap,
   quiet) that are defined elsewhere in the project.
   ============================================================================= */

import { useState } from 'react'                       // useState stores which row is open
import './Process.css'                                 // Services-specific styles and the accordion animation

// The full list of services, grouped. Moved here from the About page.
// Each group has a label (the row title) and an items array (the tags shown when it is open)
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

// Props with default values: the section works without any props being passed in
export default function Process({
  heading = 'Services',                                        // Main title
  quiet = 'Everything from a single logo to a campus-wide rollout.', // Lighter subtitle under the title
  groups = SERVICE_GROUPS,                                     // The service groups to display
  showHead = true,                                             // Set to false to hide the heading area
}) {
  // The first group starts open; set to null to start with everything closed
  // open stores the index of the open row (0 = first row), or null when all rows are closed
  const [open, setOpen] = useState(0)

  return (
    // id="services" lets other links jump straight to this section.
    // "section" and "snap" are shared classes defined elsewhere in the project.
    <section className="section services-section snap" id="services">
      <div className="wrap">
        {/* The heading is hidden on the Services page, which has its own intro */}
        {/* && only renders what comes after it when showHead is true */}
        {showHead && (
          <div className="services-head">
            <h2 className="services-title">
              {heading}
              {/* The span holds the lighter subtitle so CSS can style it separately */}
              <span className="quiet">{quiet}</span>
            </h2>
            <p className="services-total">
              {/* Adds up the number of items in every group to get the total.
                  reduce() loops through the groups, keeping a running total (n)
                  that starts at 0 and grows by each group's item count (g.items.length) */}
              {groups.reduce((n, g) => n + g.items.length, 0)}+ services
            </p>
          </div>
        )}

        <div className="services-list">
          {/* Loop through the groups and create one accordion row for each.
              i is the position of the group in the list (0, 1, 2 ...) */}
          {groups.map((group, i) => {
            // True when this row is the one currently open
            const isOpen = open === i
            return (
              // The is-open class is only added when this row is open, and the CSS animation depends on it.
              // key helps React track each row efficiently. The label is used because each is unique.
              <div className={`service-row ${isOpen ? 'is-open' : ''}`} key={group.label}>
                {/* The clickable row header. A real <button> is used so it works with
                    the keyboard (Tab and Enter) and screen readers by default */}
                <button
                  type="button"
                  className="service-trigger"
                  aria-expanded={isOpen}              // Tells screen readers whether the row is open or closed
                  aria-controls={`service-${i}`}      // Links the button to the content it opens (the id below)
                  // If this row is already open, close it (null). Otherwise open this row (i),
                  // which automatically closes whichever row was open before.
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <h3>{group.label}</h3>
                  <span className="service-meta">
                    {/* Number of services inside this group */}
                    <span className="service-count">{group.items.length} services</span>
                    {/* &#8595; is the HTML code for a down arrow. aria-hidden hides it from screen
                        readers because it is decoration. CSS rotates it 180 degrees when open */}
                    <span className="service-icon" aria-hidden="true">&#8595;</span>
                  </span>
                </button>
                {/* The area that opens and closes. The id matches aria-controls on the button above.
                    The extra inner <div> is needed for the open/close animation in Process.css */}
                <div className="service-body" id={`service-${i}`} role="region">
                  <div>
                    <ul className="service-chips">
                      {/* One tag for each service in the group. The item name is used as the key */}
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

/* =============================================================================
   REFERENCES
   -----------------------------------------------------------------------------
   MDN Web Docs: Array.prototype.reduce (adds up the items in every group to
   get the total number of services)
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

   W3C WAI-ARIA Authoring Practices: Accordion pattern (the button with
   aria-expanded and aria-controls that opens and closes each row)
   https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
   ============================================================================= */

// ---------------------------------- END OF FILE ---------------------------------- */