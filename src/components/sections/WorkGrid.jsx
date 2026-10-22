/* =============================================================================
   WORK GRID COMPONENT (WorkGrid.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the "Selected work" section on the
   Nado Graphics home page: a grid of project cards showing a sample of the
   agency's work, with a button to the full portfolio.

   What it displays:
   - A small "Selected work" label, a heading and a short description.
   - A grid of project cards. Each card shows either a photo or an autoplaying
     YouTube video, with the category and an optional note above it. Each
     card links to that project's page in the portfolio.
   - A "See all our work" button (optional).

   How it works:
   - The cards are defined in one array (CARDS). Each entry only stores a file
     path and some text. Before rendering, each entry is looked up with
     getWork(), which returns the real image source, the type (image or video),
     the YouTube ID and the portfolio link. Those are merged into the final
     list (DEFAULT_PROJECTS).
   - Two small helper components keep the code organised:
       CardVideo   -> renders a muted, looping YouTube video
       ProjectCard -> renders one card
   - WorkGrid itself loops through the projects and renders a ProjectCard for
     each one. The heading, description, project list and button can all be
     changed through props.

   Styling is handled in WorkGrid.css, plus shared classes (section, snap,
   wrap, label) that are defined elsewhere in the project.
   ============================================================================= */

import { useEffect, useRef } from 'react'     // Note: neither of these is used in this file, so the import could be removed
import { Link } from 'react-router-dom'       // Page navigation without a full reload
import SectionHead from '../ui/SectionHead'   // Shared heading and description block used across the site
import Button from '../ui/Button'             // Shared button component used across the site
import { getWork } from '../../data/projects' // Looks up a portfolio item by its file path and returns its source, type and link
import './WorkGrid.css'                       // Work grid styles

/*
  The project cards on the Home page.

  Fields
  - work:     the file's path inside src/assets/work
  - category: the big line above the picture
  - title:    a short name for the project (not shown on the card; used for the key)
  - note:     optional smaller line under the category
  - alt:      short description of the photo or video, for screen readers

  Local images are loaded from src/assets/work.
  YouTube videos are loaded using their YouTube video ID.

  The first card is extra wide, so a wide photo suits that spot.
*/
// (The note above says the first card is extra wide, but WorkGrid.css uses three equal columns
// with no rule that widens the first card, so check whether this note is still accurate.)

// The cards shown by default. Only text and a file path are stored here; the real image
// or video details are added from the data file in DEFAULT_PROJECTS below.
const CARDS = [

    {
    work: 'Design & Print/Publications/47.jpg',
    category: 'Publications',
    title: 'Institutional operating plan 2026–2030',
    note: 'Cover design, layout and print for a multi-year strategy document.',
    alt: 'Printed operating plan, showing the cover and an open spread',
  },
  
  {
    work: 'Lapel badges/lapel_6.jpg',
    category: 'Lapel badges',
    title: 'Custom lapel badges',
    note: 'Small, sharp and made to be worn.',
    alt: 'Custom lapel badges',
  },

  {
    work: 'Video Animation/01 Medical Bioscience',
    category: 'Video Animation',
    title: 'Medical Bioscience explainer',
    note: 'Animated videos that bring your message to life on screen.',
    alt: 'Animated explainer video for the Medical Bioscience degree',
  },



  {
    work: 'Merchandise/Apparel/Tshirt Mockup 3.jpg',
    category: 'Apparel',
    title: 'Branded hoodies',
    note: 'Custom apparel for teams, staff and events.',
    alt: 'Branded hoodies',
  },

  {
    work: 'Design & Print/Signage & Banners/Pull banner mockup 3.jpg',
    category: 'Pull-up banners',
    title: 'Portable display banners',
    note: 'Easy to set up for events, expos and receptions.',
    alt: 'Pull-up banner',
  },

  {
    work: 'Design & Print/Stationary/3 Stationary Mockup 13.jpg',
    category: 'Lanyards',
    title: 'Branded lanyards & stationery',
    note: 'Lanyards and stationery that carry your brand everywhere they go.',
    alt: 'Branded lanyards and stationery',
  },

]

// Turn each card into a full project by looking up its real details.
// This runs once when the file loads, not on every render, because it sits outside the component.
const DEFAULT_PROJECTS = CARDS.map((card) => {

  // Ask the data file for the item that matches this file path
  const found = getWork(card.work)

  return {
    ...card,                              // Copy everything from the original card (text, alt and so on)
    image: found?.src,                    // Image source. ?. gives undefined instead of an error if nothing was found
    type: found?.type,                    // Whether the item is an image or a video
    youtubeId: found?.youtubeId,          // YouTube video ID (only for videos)
    to: found?.link ?? '/portfolio',      // Link to the project. ?? falls back to the portfolio page only if the link is
                                          // null or undefined (unlike ||, it keeps other values such as an empty string)
  }

})

// ---------- YouTube video ----------

// Renders a YouTube video that plays silently on a loop, filling its card
function CardVideo({ videoId, label }) {

  // If there is no video ID, render nothing
  if (!videoId) return null

  return (
    <iframe
      className="work-video"
      // The embed address and its settings, written as a query string:
      //   autoplay=1  -> starts playing automatically
      //   mute=1      -> starts muted (browsers only allow autoplay if the video is muted)
      //   loop=1      -> repeats when it ends
      //   playlist=ID -> required for loop to work on a single video, so it is set to the same video's ID
      //   controls=0  -> hides the player controls
      //   rel=0       -> limits the "related videos" shown at the end to the same channel
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0`}
      title={label}                       // Describes the video to screen readers
      loading="lazy"                      // Delays loading the video until it is close to the screen
      allow="autoplay; encrypted-media; picture-in-picture"  // Permissions the embedded player needs
      allowFullScreen
    />
  )

}

// ---------- Project card ----------

// Renders one project card
function ProjectCard({ project }) {

  // Choose the element type at runtime: a router Link if the card has a destination,
  // otherwise a plain <div>. The variable name starts with a capital letter because
  // React treats capitalised names in JSX as components. (In this file every card gets a
  // "to" value, because DEFAULT_PROJECTS falls back to '/portfolio', so it is always a Link.)
  const Tag = project.to ? Link : 'div'

  return (

    <Tag
      className="work-card"
      // Spread in the "to" prop only when it exists, because a plain <div> shouldn't receive it
      {...(project.to ? { to: project.to } : {})}
    >

      {/* Category and note, shown above the picture or video */}
      <div className="work-meta">

        <h3>
          {project.category}
        </h3>

        {/* Optional note, shown only if the project has one */}
        {project.note && (
          <p className="work-note">
            {project.note}
          </p>
        )}

      </div>

      {/* tone-ink is the default fallback background if the project has no tone.
          If the project has a local image (and isn't a video), it is shown as a CSS
          background that fills the area. Otherwise no inline style is added. */}
      <div
        className={`work-media tone-${project.tone || 'ink'}`}
        style={
          project.image && project.type !== 'video'
            ? {
                backgroundImage: `url("${project.image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
        // A background image has no alt text, so role="img" and aria-label describe it to screen readers
        role={
          project.image && project.type !== 'video'
            ? 'img'
            : undefined
        }
        aria-label={
          project.image && project.type !== 'video'
            ? project.alt
            : undefined
        }
      >

        {/* YouTube videos */}

        {project.type === 'video' && (
          <CardVideo
            videoId={project.youtubeId}
            label={project.alt}
          />
        )}

        {/* If there is neither an image nor a video, show the client name as text instead */}
        {!project.image && !project.youtubeId && (
          <span className="work-client">
            {project.client}
          </span>
        )}

        {/* Arrow in the corner, shown only if the card links somewhere.
            &#8599; is the HTML code for an up-right arrow. aria-hidden hides it from
            screen readers because it is decoration */}
        {project.to && (
          <span
            className="work-arrow"
            aria-hidden="true"
          >
            &#8599;
          </span>
        )}

      </div>

    </Tag>

  )

}

// ---------- Work section ----------

// Props with default values: the section works without any props being passed in
export default function WorkGrid({

  heading = 'Some of our proudest work',      // Section heading

  description = 'A few recent pieces, from publications to apparel. There’s plenty more on our work page.',  // Text under the heading

  projects = DEFAULT_PROJECTS,                // The cards to show

  showAllButton = true,                       // Set to false to hide the "See all our work" button

}) {

  return (

    // id="work" lets other links jump straight to this section.
    // "section" and "snap" are shared classes defined elsewhere in the project.
    <section
      className="section work-section snap"
      id="work"
    >

      <div className="wrap">

        {/* Small label so it's clear a new section starts here */}


        {/* Shared component that renders the heading and description */}
        <SectionHead
          heading={heading}
          description={description}
        />

        <div className="work-grid">

          {/* Loop through the projects and render one card for each.
              The key must be unique, so the category and title are combined */}
          {projects.map((project) => (

            <ProjectCard
              project={project}
              key={`${project.category}-${project.title}`}
            />

          ))}

        </div>

        {/* && only renders the button when showAllButton is true */}
        {showAllButton && (

          <div className="work-all">

            <Button
              to="/portfolio"
              variant="primary"
              arrow
            >
              See all our work
            </Button>

          </div>

        )}

      </div>

    </section>

  )

}

/* =============================================================================
   REFERENCES
   -----------------------------------------------------------------------------
   YouTube IFrame Player API: player parameters (autoplay, mute, loop,
   playlist, controls and rel, used in the embed address)
   https://developers.google.com/youtube/player_parameters

   MDN Web Docs: Nullish coalescing operator (??) (falls back to '/portfolio'
   only when the link is null or undefined)
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
   ============================================================================= */

// ---------------------------------- END OF FILE ---------------------------------- //