// src/components/sections/AboutHero.jsx

/* =============================================================================
   ABOUT HERO COMPONENT (AboutHero.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the opening (hero) section at the top of the
   About page for the Nado Graphics website. It introduces the agency and
   shows a moving strip of example work underneath.

   What it displays:
   - A small label, a large two-part title and a short lead paragraph.
   - Two buttons: "See the work" (Our Work page) and "Start a project"
     (Contact page).
   - A full-width moving strip of photos from the agency's portfolio. Clicking
     a photo opens that photo's category on the Our Work page.

   How it works:
   - The photos are listed in one array (PHOTOS). Each entry stores the path of
     the image file inside src/assets/work, plus alt text and a caption.
   - Before the component renders, each entry is looked up with getWork().
     If the file can't be found, that photo is dropped from the strip instead
     of showing a broken image.
   - The text and buttons are wrapped in the Reveal component so they animate
     in one after another, using a growing delay on each element.

   Styling is handled in AboutHero.css (and the shared about-intro classes).
   ============================================================================= */

import Reveal from '../ui/Reveal'                  // Wrapper that animates its content in when it appears on screen
import Button from '../ui/Button'                  // Shared button component used across the site
import PhotoStrip from '../ui/PhotoStrip'          // Moving strip of clickable photos
import { getWork } from '../../data/projects'     // Looks up a portfolio image by its file path and returns its source and link
import './AboutHero.css'                           // Hero-specific styles

/*
  Photos in the moving strip. `work` is the file's path inside src/assets/work.
  Clicking a photo opens its tab on the Our Work page.
*/
// Each entry has:
//   work    -> path of the image file inside src/assets/work (used to look it up)
//   alt     -> description of the image for screen readers and if the image fails to load
//   caption -> short label shown for the photo (the type of work it shows)
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
// This runs once when the file loads, not on every render, because it sits outside the component
const STRIP = PHOTOS.map((photo) => {
  // Ask the data file for the real image source and link that match this file path
  const found = getWork(photo.work)
  // If found, copy the original photo details (...photo) and add the src and link from the lookup.
  // If not found, return null as a placeholder.
  return found ? { ...photo, src: found.src, link: found.link } : null
// filter(Boolean) removes every null, because null counts as false. Only photos that were found remain
}).filter(Boolean)

export default function AboutHero() {
  return (
    // id="about-hero" lets other links jump straight to this section
    <section className="nd-about-hero" id="about-hero">
      <div className="wrap">
        <div className="about-intro">
          {/* Reveal animates its content in when it appears. "as" sets which HTML tag it renders
              (here a <p>), and "delay" staggers the timing so each element appears after the last
              (80, 160 and 240 look like milliseconds, but check the Reveal component to confirm) */}
          <Reveal as="p" className="about-intro-label">Design &amp; print agency, est. 2000</Reveal>

          {/* Main heading rendered as an <h1>. The second line sits in a span so it can be a lighter colour in CSS */}
          <Reveal as="h1" className="about-intro-title" delay={80}>
            Design you can see.
            <span className="quiet">Print you can touch.</span>
          </Reveal>

          <Reveal as="p" className="about-intro-lead" delay={160}>
            A design and print agency built from a lifelong passion for the craft.
            From the first idea to the final printed piece, we bring brands to life.
          </Reveal>

          {/* Wrapper for the two buttons. With no "as" prop, Reveal falls back to its default element */}
          <Reveal className="about-intro-ctas" delay={240}>
            {/* variant and arrow are props handled by the shared Button component:
                "primary" is the solid style, "ghost" the outlined style, and arrow adds an arrow icon */}
            <Button to="/portfolio" variant="primary" arrow>See the work</Button>
            <Button to="/contact" variant="ghost">Start a project</Button>
          </Reveal>
        </div>
      </div>

      {/* Runs the full width of the screen, outside the page margins.
          Clicking a photo opens that photo's category on the Our Work page. */}
      {/* photos = the list built above. speed = how fast the strip moves (the unit is
          defined inside PhotoStrip). linkTo is a function that is given a photo and
          returns the page it should open, which here is the link found by getWork() */}
      <PhotoStrip
        photos={STRIP}
        speed={50}
        linkTo={(photo) => photo.link}
      />
    </section>
  )
}

// ---------------------------------- END OF FILE ---------------------------------- //