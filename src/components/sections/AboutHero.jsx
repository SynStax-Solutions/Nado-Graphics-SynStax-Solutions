// src/components/sections/AboutHero.jsx
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import PhotoStrip from '../ui/PhotoStrip'
import { getWork } from '../../data/projects'
import './AboutHero.css'

/*
  Photos in the moving strip. `work` is the file's path inside src/assets/work.
  Clicking a photo opens its tab on the Our Work page.
*/
const PHOTOS = [
  { work: 'Design & Print/Signage & Banners/Signage mockup 1.jpg', alt: 'Signage design shown on a wall', caption: 'Signage' },
  { work: 'Merchandise/Apparel/Tshirt Mockup 5.jpg', alt: 'Branded apparel', caption: 'Apparel' },
  { work: 'Design & Print/Brochures/Brochure mockup 10 (1).jpg', alt: 'Printed brochure', caption: 'Brochures' },
  { work: 'Design & Print/Brochures/Brochure mockup 8.jpg', alt: 'Printed brochure', caption: 'Annual Reports' },
  { work: 'Lapel badges/lapel_2.jpg', alt: 'Custom lapel badges', caption: 'Lapel badges' },
  { work: 'Design & Print/Signage & Banners/Pull banner mockup 5.jpg', alt: 'Pull-up banner', caption: 'Pull-up banners' },
  { work: 'Design & Print/Stationary/Stationary Mockup 2.jpg', alt: 'Branded stationery set', caption: 'Corporate Identities' },
  { work: 'Design & Print/Stationary/mockup 1 (1).jpg', alt: 'Branded mockup', caption: 'Branding' },   { work: 'Design & Print/Table Cloths/Table cloth mockup 3.jpg', alt: 'Branded table cloth', caption: 'Table cloths' },
  { work: 'Design & Print/Signage & Banners/Vertical Banner 1.jpg', alt: 'Vertical printed banner', caption: 'Signage' },
  { work: 'Design & Print/Flyers/41.jpg', alt: 'Tri-fold brochure opened to show the inside panels', caption: 'Tri-fold brochures' },
  { work: 'Merchandise/Apparel/Tshirt Mockup 9.jpg', alt: 'Branded T-shirt', caption: 'Apparel' },
  { work: 'Design & Print/Stationary/Stationary Mockup 10.jpg', alt: 'Branded stationery', caption: 'Stationery' },  { work: 'Design & Print/Posters/1.jpg', alt: 'Printed poster', caption: 'Posters' },
]

// Look up each photo; any file that can't be found is left out instead of showing broken
const STRIP = PHOTOS.map((photo) => {
  const found = getWork(photo.work)
  return found ? { ...photo, src: found.src, link: found.link } : null
}).filter(Boolean)

export default function AboutHero() {
  return (
    <section className="nd-about-hero" id="about-hero">
      <div className="wrap">
        <div className="about-intro">
          <Reveal as="p" className="about-intro-label">Design &amp; print agency, est. 2000</Reveal>

          <Reveal as="h1" className="about-intro-title" delay={80}>
            Design you can see.
            <span className="quiet">Print you can touch.</span>
          </Reveal>

          <Reveal as="p" className="about-intro-lead" delay={160}>
            A design and print agency built from a lifelong passion for the craft.
            From the first idea to the final printed piece, we bring brands to life.
          </Reveal>

          <Reveal className="about-intro-ctas" delay={240}>
            <Button to="/portfolio" variant="primary" arrow>See the work</Button>
            <Button to="/contact" variant="ghost">Start a project</Button>
          </Reveal>
        </div>
      </div>

      {/* Runs the full width of the screen, outside the page margins.
          Clicking a photo opens that photo's category on the Our Work page. */}
      <PhotoStrip
        photos={STRIP}
        speed={50}
        linkTo={(photo) => photo.link}
      />
    </section>
  )
}