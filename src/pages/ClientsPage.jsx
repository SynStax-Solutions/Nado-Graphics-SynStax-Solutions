/* =============================================================================
   CLIENTS PAGE (ClientsPage.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Displays the Nado Graphics clients page, including an introductory banner
   and a grid of client logos.

   What this component does:
   - Imports the reusable Reveal component for scroll animations.
   - Imports the client logo data.
   - Displays an introductory yellow banner.
   - Displays decorative animated rings inspired by the Nado logo.
   - Generates the client logo grid from the CLIENT_LOGOS data.
   - Adds staggered reveal delays to the client logos.

   Note:
   Client information and logo references are stored in the clients data file.
   The visual styling is handled by ClientsPage.css.
   ============================================================================= */

// ---------- Reusable UI component for scroll reveal animations ----------
import Reveal from '../components/ui/Reveal'

// ---------- Client logo data ----------
import { CLIENT_LOGOS } from '../data/clients'

// ---------- Clients page styles ----------
import './ClientsPage.css'


/* =============================================================================
   CLIENTS PAGE COMPONENT
   ============================================================================= */

export default function ClientsPage() {
  return (
    <div className="clients-page">
      <div className="wrap">

        {/* =============================================================================
           INTRODUCTORY BANNER
           ============================================================================= */}

        <section className="clients-banner">
          <div className="clients-banner-text">

            {/* ---------- Small section label ---------- */}
            <p className="clients-banner-label">Our clients</p>

            {/* ---------- Main page heading ---------- */}
            <h1 className="clients-banner-title">
              Some of our
              <br />
              clients
            </h1>

            {/* ---------- Supporting introduction ---------- */}
            <p className="clients-banner-lead">
              We&rsquo;re proud to share some of the organisations who trust us with their brands. 
              From university campuses to hospitals and international sporting events.
            </p>

          </div>

          {/* =============================================================================
             DECORATIVE RINGS
             -----------------------------------------------------------------------------
             Thin rings echo the Nado logo. A small dot travels around each ring to
             create the rotating effect.
             ============================================================================= */}

          <svg
            className="clients-banner-rings"
            viewBox="0 0 400 400"
            aria-hidden="true"
          >
            {/* ---------- Outer ring ---------- */}
            <g className="ring ring-1">
              <circle cx="260" cy="200" r="180" />
              <circle className="ring-dot" cx="440" cy="200" r="5" />
            </g>

            {/* ---------- Middle ring ---------- */}
            <g className="ring ring-2">
              <circle cx="260" cy="200" r="120" />
              <circle className="ring-dot" cx="380" cy="200" r="5" />
            </g>

            {/* ---------- Inner ring ---------- */}
            <g className="ring ring-3">
              <circle cx="260" cy="200" r="60" />
              <circle className="ring-dot" cx="320" cy="200" r="5" />
            </g>
          </svg>
        </section>


        {/* =============================================================================
           CLIENT LOGO GRID
           ============================================================================= */}

        <ul className="clients-grid" aria-label="Our clients">

          {/* ---------- Generate a grid cell for each client logo ---------- */}
          {CLIENT_LOGOS.map((logo, i) => (
            <Reveal
              as="li"
              key={logo.file}
              className="clients-cell"
              delay={(i % 5) * 60}
            >
              {/* ---------- Client logo ---------- */}
              <img
                src={logo.src}
                alt={logo.name}
                title={logo.name}
                loading="lazy"
              />
            </Reveal>
          ))}

        </ul>

      </div>
    </div>
  )
}

/* ---------------------------------- END OF FILE ---------------------------------- */