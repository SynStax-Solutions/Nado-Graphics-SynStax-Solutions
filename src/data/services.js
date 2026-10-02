/*
  The services shown on the Our Services page.
  - icon:  a Font Awesome icon (see https://fontawesome.com/search?ic=free&o=r for more)
  - items: what's included, shown as a small line under the description
  - work:  which Our Work tab "See examples" opens ([main tab, sub-tab])
*/
import { faPenNib, faPrint, faBookOpen, faSignHanging, faGift, faPlay } from '@fortawesome/free-solid-svg-icons'

export const SERVICES = [
  {
    title: 'Brand & Identity',
    icon: faPenNib,
    description:
      'Logos, colours and type that make your brand instantly recognisable, with the guidelines to keep it consistent wherever it appears.',
    items: ['Branding', 'Logo Design Packages', 'Concept & Design', 'Stationery'],
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