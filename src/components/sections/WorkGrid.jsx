import { Link } from 'react-router-dom'
import SectionHead from '../ui/SectionHead'
import Button from '../ui/Button'
import { getWork } from '../../data/projects'
import './WorkGrid.css'

const CARDS = [
  {
    work: 'Lapel badges/lapel_6.jpg',
    category: 'Lapel badges',
    title: 'Custom lapel badges',
    note: 'Small, sharp and made to be worn.',
    alt: 'Custom lapel badges',
  },
  {
    work: 'Merchandise/Apparel/Tshirt Mockup 3.jpg',
    category: 'Apparel',
    title: 'Branded hoodies',
    note: 'Custom apparel for teams, staff and events.',
    alt: 'Branded hoodies',
  },
  {
    work: 'Design & Print/Publications/47.jpg',
    category: 'Publications',
    title: 'Institutional operating plan 2026–2030',
    note: 'Cover design, layout and print for a multi-year strategy document.',
    alt: 'Printed operating plan, showing the cover and an open spread',
  },
  {
    work: 'Design & Print/Signage & Banners/Horizontal Banner 1.jpg',
    category: 'Banners',
    title: 'Large-format banners',
    note: 'Printed and finished for indoor and outdoor use.',
    alt: 'Large horizontal banner on a building wall',
  },
  {
    work: 'Design & Print/Signage & Banners/Pull banner mockup 3.jpg',
    category: 'Pull-up banners',
    title: 'Portable display banners',
    note: 'Easy to set up for events, expos and receptions.',
    alt: 'Pull-up banner',
  },
]

const DEFAULT_PROJECTS = CARDS.map((card) => {
  const found = getWork(card.work)
  return { ...card, image: found?.src, to: found?.link ?? '/portfolio' }
})

function ProjectCard({ project }) {
  const Tag = project.to ? Link : 'div'
  return (
    <Tag className="work-card" {...(project.to ? { to: project.to } : {})}>
      <div
        className={`work-media tone-${project.tone || 'ink'}`}
        style={project.image ? { backgroundImage: `url("${project.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        role={project.image ? 'img' : undefined}
        aria-label={project.image ? project.alt : undefined}
      >
        {!project.image && <span className="work-client">{project.client}</span>}
        {project.to && <span className="work-arrow" aria-hidden="true">&#8599;</span>}
      </div>
      <div className="work-meta">
       {/* Small grey line on top, the category big underneath */}
        <p className="work-tag">{project.title}</p>
        <h3>{project.category}</h3>
        {project.note && <p className="work-note">{project.note}</p>}
      </div>
    </Tag>
  )
}

export default function WorkGrid({
  heading = 'Work we’re proud of.',
  description = 'A few recent pieces, from publications to apparel. There’s plenty more on our work page.',
  projects = DEFAULT_PROJECTS,
  showAllButton = true,
}) {
  return (
    <section className="section work-section snap" id="work">
      <div className="wrap">
                {/* Thin line and label so it's clear a new section starts here */}
        <div className="work-top">
          <p className="label work-label">Selected work</p>
        </div>
        <SectionHead heading={heading} description={description} />
        <div className="work-grid">
          {projects.map((project) => (
            <ProjectCard project={project} key={`${project.category}-${project.title}`} />
          ))}
        </div>
        {showAllButton && (
          <div className="work-all">
            <Button to="/portfolio" variant="primary" arrow>See all our work</Button>
          </div>
        )}
      </div>
    </section>
  )
}