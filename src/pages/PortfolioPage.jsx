import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Lightbox from '../components/ui/Lightbox'
import PageIntro from '../components/ui/PageIntro'
import { CATEGORIES, SUBCATEGORIES, getProjects, labelFor } from '../data/projects'
import './PortfolioPage.css'

export default function PortfolioPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [openIndex, setOpenIndex] = useState(null)

  // The selected tab and sub-tab live in the web address,
  const fromUrl = searchParams.get('category')
  const category = CATEGORIES.includes(fromUrl) ? fromUrl : 'All'
  const subs = category === 'All' ? [] : SUBCATEGORIES[category]
  const subFromUrl = searchParams.get('sub')
  const sub = subs.includes(subFromUrl) ? subFromUrl : 'All'

  const choose = (c, s) => {
    setOpenIndex(null)
    const params = {}
    if (c !== 'All') params.category = c
    if (s && s !== 'All') params.sub = s
    setSearchParams(params, { replace: true })
  }

  const shown = useMemo(() => getProjects(category, sub), [category, sub])
  const countFor = (c, s = 'All') => getProjects(c, s).length

  const close = useCallback(() => setOpenIndex(null), [])

  return (
    <div className="portfolio-page">
      <section className="work-page">
        <div className="wrap">
          {/* Intro */}
          <PageIntro
            label="Our work"
            title="Made by Nado."
            quiet="Design, print, merchandise and motion."
            lead="Pick a category, then narrow it down. Click any piece to see it up close."
          />

          {/* Main tabs */}
          <div className="work-filters" role="group" aria-label="Filter projects by category">
            {['All', ...CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                className={`work-filter ${category === c ? 'is-active' : ''}`}
                aria-pressed={category === c}
                onClick={() => choose(c)}
              >
                {c === 'All' ? 'All' : labelFor(c)}
                <span className="work-filter-count">{countFor(c)}</span>
              </button>
            ))}
          </div>

          {/* Sub-tabs: only for a main tab that has folders inside it */}
          {subs.length > 0 && (
            <div className="work-subfilters" role="group" aria-label={`Filter ${labelFor(category)}`}>
              {['All', ...subs].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`work-subfilter ${sub === s ? 'is-active' : ''}`}
                  aria-pressed={sub === s}
                  onClick={() => choose(category, s)}
                >
                  {s === 'All' ? `All ${labelFor(category)}` : s}
                  <span className="work-filter-count">{countFor(category, s)}</span>
                </button>
              ))}
            </div>
          )}

          {/* Project grid */}
          <ul className="work-list">
            {shown.map((project, i) => (
              <li key={project.path} className="work-item">
                <button
                  type="button"
                  className="work-item-button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`View ${project.title} larger`}
                >
                  <span className="work-item-media">
                    {project.type === 'video' ? (
                      <>
                        {/* Shows the first frame; plays in the big view */}
                        <video src={`${project.src}#t=0.5`} muted playsInline preload="metadata" />
                        <span className="work-item-play" aria-hidden="true">&#9654;</span>
                      </>
                    ) : (
                      <img src={project.src} alt={project.alt} loading="lazy" />
                    )}
                    <span className="work-item-open" aria-hidden="true">&#8599;</span>
                  </span>
                  <span className="work-item-meta">
                    <span className="work-item-cat">{labelFor(project.category)}</span>
                    <span className="work-item-title">{project.title}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Lightbox items={shown} index={openIndex} onChange={setOpenIndex} onClose={close} />
    </div>
  )
}