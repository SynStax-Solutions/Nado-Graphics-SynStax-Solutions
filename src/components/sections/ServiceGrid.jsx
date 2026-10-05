/* =============================================================================
   SERVICE GRID COMPONENT (ServiceGrid.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the service grid on the Nado Graphics
   website: a grid of cards, one for each service the agency offers.

   What it displays:
   - For each service, a card with:
       - a round icon,
       - a title and a description,
       - a line listing what the service includes (only if it has any items),
       - a "See examples" link to that service's work in the portfolio
         (only if the service has examples).

   How it works:
   - The services come from a data file (SERVICES), so the cards are built
     from data instead of being written out by hand. A different list can be
     passed in as the services prop.
   - .map() loops through the services and creates one card for each.
   - Each card is wrapped in the Reveal component so it animates in when it
     appears on screen. The delay depends on the card's column, so cards in
     the same row appear one after another.
   - The icons alternate between yellow and dark, using the index of each card.

   Styling is handled in ServiceGrid.css.
   ============================================================================= */

import { Link } from 'react-router-dom'                            // Page navigation without a full reload
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'   // Renders Font Awesome icons in React
import Reveal from '../ui/Reveal'                                  // Wrapper that animates its content in when it appears on screen
import { SERVICES } from '../../data/services'                     // The list of services (title, description, icon, items, work)
import { workLink } from '../../data/projects'                     // Builds the portfolio link for a service's examples
import './ServiceGrid.css'                                         // Service grid styles

// Grid of services: round icon, title, description, what's included, link to examples
// services has a default value, so the grid works without any props being passed in
export default function ServiceGrid({ services = SERVICES }) {
  return (
    <section className="service-grid-section">
      <div className="wrap">
        {/* The grid is a list (<ul>), and each card below is a list item (<li>) */}
        <ul className="service-grid">
          {/* Loop through the services and create one card for each.
              i is the position in the list (0, 1, 2 ...) and is used for the icon colour and the delay */}
          {services.map((service, i) => (
            // as="li" makes Reveal render a <li>, so the markup is a valid list.
            // key must be unique, and each service's title is used.
            // i % 3 gives 0, 1, 2, 0, 1, 2 ... which is the card's column in a 3-column grid.
            // Multiplying by 90 staggers the cards in a row. The delay unit is set inside Reveal.
            <Reveal as="li" key={service.title} className="service-card" delay={(i % 3) * 90}>
              {/* i % 2 is 0 for even cards and 1 for odd cards. 0 is falsy, so even cards get no
                  class (yellow) and odd cards get is-dark. This makes the icons alternate.
                  aria-hidden hides the icon from screen readers because it is decoration */}
              <span className={`service-icon-circle ${i % 2 ? 'is-dark' : ''}`} aria-hidden="true">
                {/* The icon comes from the service's data (a Font Awesome icon object) */}
                <FontAwesomeIcon icon={service.icon} />
              </span>

              <h2 className="service-card-title">{service.title}</h2>
              <p className="service-card-desc">{service.description}</p>

              {/* Only show the items line if the service has items.
                  ?. (optional chaining) stops an error if items doesn't exist: it gives undefined
                  instead of crashing, and undefined > 0 is false, so nothing is shown.
                  join(' · ') combines the items into one line separated by dots */}
              {service.items?.length > 0 && (
                <p className="service-card-items">{service.items.join(' · ')}</p>
              )}

              {/* Only show the link if the service has work examples.
                  service.work is an array, and the spread operator (...) unpacks it so each
                  value is passed to workLink() as a separate argument.
                  &#8599; is the HTML code for an up-right arrow, hidden from screen readers
                  because it is decoration */}
              {service.work && (
                <Link to={workLink(...service.work)} className="service-card-link">
                  See examples <span aria-hidden="true">&#8599;</span>
                </Link>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* =============================================================================
   REFERENCES
   -----------------------------------------------------------------------------
   MDN Web Docs: Optional chaining (?.) (safely reads service.items when it
   might not exist)
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining

   MDN Web Docs: Spread syntax (...) (unpacks the service.work array into
   separate arguments for workLink)
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
   ============================================================================= */

// ---------------------------------- END OF FILE ---------------------------------- //