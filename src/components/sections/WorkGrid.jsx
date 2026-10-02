import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SectionHead from '../ui/SectionHead'
import Button from '../ui/Button'
import { getWork } from '../../data/projects'
import './WorkGrid.css'

/*
  The project cards on the Home page.

  Fields
  - work:     the file's path inside src/assets/work
  - category: the big line under the card
  - title:    the small grey line above it
  - note:     optional smaller line under the category
  - alt:      short description of the photo or video, for screen readers

  Local images are loaded from src/assets/work.
  YouTube videos are loaded using their YouTube video ID.

  The first card is extra wide, so a wide photo suits that spot.
*/

const CARDS = [

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
    work: 'Design & Print/Publications/47.jpg',
    category: 'Publications',
    title: 'Institutional operating plan 2026–2030',
    note: 'Cover design, layout and print for a multi-year strategy document.',
    alt: 'Printed operating plan, showing the cover and an open spread',
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
    work: 'Design & Print/Stationary/Stationary Mockup 13.jpg',
    category: 'Lanyards',
    title: 'Branded lanyards & stationery',
    note: 'Lanyards and stationery that carry your brand everywhere they go.',
    alt: 'Branded lanyards and stationery',
  },

]

const DEFAULT_PROJECTS = CARDS.map((card) => {

  const found = getWork(card.work)

  return {
    ...card,
    image: found?.src,
    type: found?.type,
    youtubeId: found?.youtubeId,
    to: found?.link ?? '/portfolio',
  }

})

// ---------- YouTube video ----------

function CardVideo({ videoId, label }) {

  if (!videoId) return null

  return (
    <iframe
      className="work-video"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0`}
      title={label}
      loading="lazy"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  )

}

// ---------- Project card ----------

function ProjectCard({ project }) {

  const Tag = project.to ? Link : 'div'

  return (

    <Tag
      className="work-card"
      {...(project.to ? { to: project.to } : {})}
    >

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

        {!project.image && !project.youtubeId && (
          <span className="work-client">
            {project.client}
          </span>
        )}

        {project.to && (
          <span
            className="work-arrow"
            aria-hidden="true"
          >
            &#8599;
          </span>
        )}

      </div>

      <div className="work-meta">

        {/* Small grey line on top, the category big underneath */}

        <p className="work-tag">
          {project.title}
        </p>

        <h3>
          {project.category}
        </h3>

        {project.note && (
          <p className="work-note">
            {project.note}
          </p>
        )}

      </div>

    </Tag>

  )

}

// ---------- Work section ----------

export default function WorkGrid({

  heading = 'Some of our proudest work',

  description = 'A few recent pieces, from publications to apparel. There’s plenty more on our work page.',

  projects = DEFAULT_PROJECTS,

  showAllButton = true,

}) {

  return (

    <section
      className="section work-section snap"
      id="work"
    >

      <div className="wrap">

        {/* Small label so it's clear a new section starts here */}

        <div className="work-top">

          <p className="label work-label">
            Selected work
          </p>

        </div>

        <SectionHead
          heading={heading}
          description={description}
        />

        <div className="work-grid">

          {projects.map((project) => (

            <ProjectCard
              project={project}
              key={`${project.category}-${project.title}`}
            />

          ))}

        </div>

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

// ------------------ END OF FILE ------------------ //