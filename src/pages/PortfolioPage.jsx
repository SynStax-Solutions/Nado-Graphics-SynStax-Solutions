/* =============================================================================
   PORTFOLIO PAGE (PortfolioPage.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Displays Nado Graphics' portfolio and allows visitors to filter projects
   by category and sub-category.

   What this component does:
   - Displays the portfolio introduction
   - Provides the main project category filters
   - Provides sub-category filters where available
   - Keeps the selected filters in the web address
   - Displays the matching portfolio projects
   - Opens projects in the Lightbox for a larger view
   - Supports both image and video projects
   - Provides a fallback thumbnail when a video thumbnail cannot be loaded

   Note:
   The project information and category structure are stored in the
   projects data file. The selected category and sub-category are also
   reflected in the URL so filtered portfolio views can be shared.
   ============================================================================= */

import { useCallback, useMemo, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import Lightbox from '../components/ui/Lightbox'

import PageIntro from '../components/ui/PageIntro'

import {
  CATEGORIES,
  SUBCATEGORIES,
  getProjects,
  labelFor,
} from '../data/projects'

import './PortfolioPage.css'


/* =============================================================================
   PORTFOLIO PAGE COMPONENT
   ============================================================================= */

export default function PortfolioPage() {


  /* ---------- URL and lightbox state ---------- */

  /*
    useSearchParams allows the selected category and sub-category
    to be stored in the page URL.

    openIndex stores the position of the currently opened project
    inside the filtered project list.
  */

  const [searchParams, setSearchParams] = useSearchParams()

  const [openIndex, setOpenIndex] = useState(null)


  /* ---------- read selected category from URL ---------- */

  /*
    The selected tab and sub-tab live in the web address.

    If the category in the URL is not a valid category,
    the page falls back to "All".
  */

  const fromUrl = searchParams.get('category')

  const category = CATEGORIES.includes(fromUrl)
    ? fromUrl
    : 'All'


  /* ---------- determine available sub-categories ---------- */

  /*
    "All" does not have sub-categories.

    For other categories, look up the available sub-categories
    from the project data.
  */

  const subs = category === 'All'
    ? []
    : SUBCATEGORIES[category]


  /* ---------- read selected sub-category from URL ---------- */

  /*
    If a sub-category exists in the URL and belongs to the
    selected main category, use it.

    Otherwise, fall back to "All".
  */

  const subFromUrl = searchParams.get('sub')

  const sub = subs.includes(subFromUrl)
    ? subFromUrl
    : 'All'


  /* ---------- change portfolio filters ---------- */

  /*
    Updates the selected category and sub-category.

    The lightbox is also closed whenever the user changes
    the portfolio filter.
  */

  const choose = (c, s) => {

    /* Close any currently open project */

    setOpenIndex(null)


    /*
      Build a new set of URL parameters.

      "All" is not added to the URL because it represents
      the default filter state.
    */

    const params = {}


    if (c !== 'All') {

      params.category = c

    }


    if (s && s !== 'All') {

      params.sub = s

    }


    /*
      Replace the current URL instead of adding another entry
      to the browser history.
    */

    setSearchParams(params, { replace: true })

  }


  /* ---------- filter projects ---------- */

  /*
    Only recalculate the project list when the selected
    category or sub-category changes.
  */

  const shown = useMemo(
    () => getProjects(category, sub),
    [category, sub]
  )


  /* ---------- close lightbox ---------- */

  /*
    useCallback keeps the close function stable between renders.
  */

  const close = useCallback(
    () => setOpenIndex(null),
    []
  )


  /* =============================================================================
     PAGE LAYOUT
     ============================================================================= */

  return (

    <div className="portfolio-page">

      <section className="work-page">

        <div className="wrap">


          {/* ---------- portfolio introduction ---------- */}

          <PageIntro
            label="Our work"
            title="Made by Nado."
            quiet="Design, print, merchandise and motion."
            lead="Pick a category, then narrow it down. Click any piece to see it up close."
          />


          {/* ---------- main category tabs ---------- */}

          <div
            className="work-filters"
            role="group"
            aria-label="Filter projects by category"
          >

            {['All', ...CATEGORIES].map((c) => (

              <button
                key={c}
                type="button"
                className={`work-filter ${category === c ? 'is-active' : ''}`}
                aria-pressed={category === c}
                onClick={() => choose(c)}
              >

                {c === 'All'
                  ? 'All'
                  : labelFor(c)}

              </button>

            ))}

          </div>


          {/* ---------- sub-category tabs ---------- */}

          /*
            Sub-tabs are only displayed when the selected
            main category contains additional categories.
          */

          {subs.length > 0 && (

            <div
              className="work-subfilters"
              role="group"
              aria-label={`Filter ${labelFor(category)}`}
            >

              {['All', ...subs].map((s) => (

                <button
                  key={s}
                  type="button"
                  className={`work-subfilter ${sub === s ? 'is-active' : ''}`}
                  aria-pressed={sub === s}
                  onClick={() => choose(category, s)}
                >

                  {s === 'All'
                    ? `All ${labelFor(category)}`
                    : s}

                </button>

              ))}

            </div>

          )}


          {/* ---------- project grid ---------- */}

          <ul className="work-list">

            {shown.map((project, i) => (

              <li
                key={project.path}
                className="work-item"
              >

                {/* ---------- clickable project card ---------- */}

                <button
                  type="button"
                  className="work-item-button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`View ${project.title} larger`}
                >

                  <span className="work-item-media">


                    {/* ---------- video project ---------- */}

                    {project.type === 'video' ? (

                      <>

                        /*
                          YouTube thumbnail is displayed in the portfolio grid.
                          The actual video is played inside the larger Lightbox view.
                        */

                        <img
                          src={project.thumb}
                          alt={project.alt}
                          loading="lazy"
                          onError={(e) => {

                            /*
                              Some videos may not have an HD thumbnail.

                              If the first thumbnail fails, switch to the
                              standard fallback thumbnail.
                            */

                            e.currentTarget.onerror = null

                            e.currentTarget.src = project.thumbFallback

                          }}
                        />


                        {/* Video play icon */}

                        <span
                          className="work-item-play"
                          aria-hidden="true"
                        >
                          &#9654;
                        </span>

                      </>

                    ) : (


                      /* ---------- image project ---------- */

                      <img
                        src={project.src}
                        alt={project.alt}
                        loading="lazy"
                      />

                    )}


                    {/* ---------- open project indicator ---------- */}

                    <span
                      className="work-item-open"
                      aria-hidden="true"
                    >
                      &#8599;
                    </span>

                  </span>


                  {/* ---------- project information ---------- */}

                  <span className="work-item-meta">

                    <span className="work-item-cat">
                      {labelFor(project.category)}
                    </span>

                    <span className="work-item-title">
                      {project.title}
                    </span>

                  </span>

                </button>

              </li>

            ))}

          </ul>

        </div>

      </section>


      {/* ---------- project lightbox ---------- */}

      /*
        The Lightbox receives the currently filtered projects.

        openIndex determines which project is open.
        onChange allows the Lightbox to move between projects.
        onClose closes the Lightbox.
      */

      <Lightbox
        items={shown}
        index={openIndex}
        onChange={setOpenIndex}
        onClose={close}
      />

    </div>

  )

}


/* ---------------------------------- END OF FILE ---------------------------------- */