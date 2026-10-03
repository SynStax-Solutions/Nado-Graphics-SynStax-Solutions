/* =============================================================================
   SERVICES DATA MODULE (services.js)
   -----------------------------------------------------------------------------
   Purpose:
   Holds the list of services shown on the Our Services page of the
   Nado Graphics website. The content lives here, separate from the layout, so
   a service can be added, removed or reworded without touching any component.

   What it exports:
   - SERVICES: an array of objects, one per service. Each object has:
       title       -> the service name, shown as the card heading
       icon        -> the Font Awesome icon shown in the round badge
       description -> a short paragraph explaining the service
       items       -> a list of what is included, shown as one line of small text
       work        -> which Our Work tab the "See examples" link opens,
                      written as [main tab, sub-tab]

   Used by: ServiceGrid.jsx, which loops through this array and renders one
   card for each service.

   How the "work" field connects to the rest of the site:
   - ServiceGrid passes the work array to workLink() in projects.js, which
     builds a link such as /portfolio?category=Design%20%26%20Print&sub=Brochures.
   - The names in work must match the folder names inside src/assets/work
     exactly (including spelling and capital letters). If they don't, the link
     still opens the portfolio but shows no matching tab.
   - A service with only a main tab, such as ['Merchandise'], has no sub-tab, so
     its link opens the whole main tab.
   ============================================================================= */

/*
  The services shown on the Our Services page.
  - icon:  a Font Awesome icon (see https://fontawesome.com/search?ic=free&o=r for more)
  - items: what's included, shown as a small line under the description
  - work:  which Our Work tab "See examples" opens ([main tab, sub-tab])
*/
// Each icon is imported by name from the Font Awesome "free solid" package. Importing only the icons
// that are used (instead of the whole library) keeps the website's file size small.
import { faPenNib, faPrint, faBookOpen, faSignHanging, faGift, faPlay } from '@fortawesome/free-solid-svg-icons'

// The list of services. The order here is the order the cards appear on the page.
export const SERVICES = [
  {
    title: 'Brand & Identity',
    icon: faPenNib,   // The icon object itself, not a string. ServiceGrid gives it to <FontAwesomeIcon icon={...} />
    description:
      'Logos, colours and type that make your brand instantly recognisable, with the guidelines to keep it consistent wherever it appears.',
    items: ['Branding', 'Logo Design Packages', 'Concept & Design', 'Stationery'],
    // 'Stationary' is spelled this way because it has to match the folder name in src/assets/work
    work: ['Design & Print', 'Stationary'],
  },
  {
    title: 'Print Collateral',
    icon: faPrint,
    description:
      'Business cards, brochures, flyers and posters, designed with care and printed to a high standard using litho and digital printing.',
    items: ['Business Cards', 'Brochures', 'Flyers', 'Posters', 'Folders', 'Calendars', 'Canvas Printing'],
    work: ['Design & Print', 'Brochures'],
  },
  {
    title: 'Publications',
    icon: faBookOpen,
    description:
      'Annual reports and publications laid out to be read, not just filed, from the cover through to the final page.',
    items: ['Publication Design', 'Annual Report Design'],
    work: ['Design & Print', 'Publications'],
  },
  {
    title: 'Signage & Large Format',
    icon: faSignHanging,
    description:
      'Banners, pull-ups, flags, gazebos and signage that get noticed from across a campus, an expo floor or a busy street.',
    items: ['Signage', 'Pull-up Banners', 'Flag Banners', 'Gazebos', 'Table Cloths'],
    work: ['Design & Print', 'Signage & Banners'],
  },
  {
    title: 'Promo & Corporate Gifting',
    icon: faGift,
    description:
      'Branded apparel, lapel badges and corporate gifts that people actually keep and use, long after the event is over.',
    items: ['Apparel', 'Lapel Badges', 'Caps', 'Branded USBs', 'Gift Bags', 'Corporate Invites'],
    // Only a main tab, so the link opens the whole Merchandise tab (there is no sub-tab to pick)
    work: ['Merchandise'],
  },
  {
    title: 'Digital & Motion',
    icon: faPlay,
    description:
      'Animated explainer videos and social media animations that bring your message to life on screen and keep people watching.',
    items: ['Animated Explainer Videos', 'Social Media Animated Posts'],
    work: ['Video Animation'],
  },
]

/* =============================================================================
   REFERENCES
   -----------------------------------------------------------------------------
   Font Awesome Docs: Using Font Awesome with React (how icons are imported by
   name and passed to the FontAwesomeIcon component)
   https://docs.fontawesome.com/web/use-with/react/
   ============================================================================= */

// ---------------------------------- END OF FILE ---------------------------------- //