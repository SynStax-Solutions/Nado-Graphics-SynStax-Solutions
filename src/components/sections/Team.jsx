/* =============================================================================
   TEAM COMPONENT (Team.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the "Trusted by" clients section of the
   Nado Graphics website. It shows the kinds of organisations the agency has
   worked with, to build trust with new visitors.

   Note on the name: despite being called Team, this component displays
   clients, not team members. The name is probably left over from an earlier
   version of the site.

   What it displays:
   - An optional intro: an eyebrow label, a heading and a lead paragraph.
   - Three headline figures (for example "40+" brands shipped).
   - A list of named clients, each with its category on the right.

   How it works:
   - The figures and the clients are stored in two arrays (STATS and CLIENTS)
     and turned into elements with .map(), so adding a client only requires
     adding one line to the array.
   - Each piece of content is wrapped in the Reveal component, which animates
     it in when it appears on screen. The delay grows with each item's position,
     so the items appear one after another.
   - The showHead prop turns the intro on or off, so the same component can
     be reused on a page that already has its own heading.

   Styling is handled in Team.css, plus shared classes (nd-eyebrow, nd-heading,
   nd-lead, nd-figures, nd-figure, nd-figure-value) that are defined elsewhere
   in the project.
   ============================================================================= */

import Reveal from '../ui/Reveal'      // Wrapper that animates its content in when it appears on screen
import './Team.css'                    // Styles for this section

// The three headline figures. Each has a big value and a short description.
const STATS = [
  { value: '3+', label: 'Universities & higher ed institutions' },
  { value: '40+', label: 'Brands shipped since 2000' },
  { value: 'Nationwide', label: 'Large-scale, multi-campus rollouts' },
]

// Placeholders for clients logos
// Each client has a name and a category. The category is shown on the right of the row.
const CLIENTS = [
  { name: 'University of the Western Cape', category: 'Higher Education' },
  { name: 'University of Cape Town', category: 'Higher Education' },
  { name: 'University of Pretoria', category: 'Higher Education' },
  { name: 'University of Stellenbosch', category: 'Higher Education' },
  { name: 'Melomed Hospital', category: 'Healthcare & Medical' },
  { name: 'CancerCare', category: 'Healthcare & Medical' },
]

// showHead has a default value of true, so the intro is shown unless it is turned off
export default function Team({ showHead = true }) {
  return (
    // id="clients" lets other links jump straight to this section
    <section className="nd-team" id="clients">
      <div className="wrap">
        {/* The heading is hidden on the Clients page, which has its own intro */}
        {/* && only renders what comes after it when showHead is true.
            <> ... </> is a fragment: it groups several elements without adding an extra <div> to the page */}
        {showHead && (
          <>
            {/* Small label above the heading. With no "as" prop, Reveal falls back to its default element */}
            <Reveal className="nd-eyebrow">Trusted by</Reveal>

            {/* "as" sets which HTML tag Reveal renders (here an <h2>), and "delay" staggers the timing
                so this appears after the label. The delay unit is set inside Reveal (probably milliseconds).
                &rsquo; is the HTML code for a curly apostrophe */}
            <Reveal as="h2" className="nd-heading nd-team-title" delay={80}>
              Big clients we&rsquo;ve worked with.
            </Reveal>

            {/* nd-lead is a shared style, and nd-team-lead (in Team.css) adds the space above it */}
            <Reveal as="p" className="nd-lead nd-team-lead" delay={140}>
              From university campuses to national corporates, we&rsquo;ve delivered
              branding, print and signage at a scale most studios our size never see.
            </Reveal>
          </>
        )}

        {/* Row of three figures. nd-team-stats (in Team.css) adds the space above and below it */}
        <div className="nd-figures nd-team-stats">
          {/* One figure for each entry in STATS. The label is unique, so it is used as the key.
              The delay starts at 180 and each figure adds 80, so they appear one after another */}
          {STATS.map((s, i) => (
            <Reveal key={s.label} className="nd-figure" delay={180 + i * 80}>
              <span className="nd-figure-value">{s.value}</span>
              <p>{s.label}</p>
            </Reveal>
          ))}
        </div>

        {/* The list of clients is a <ul>, and each client below is a <li> */}
        <ul className="nd-client-list">
          {/* One row for each client. as="li" makes Reveal render a <li>, so the markup is a valid list.
              The name is used as the key because every client name is unique.
              The delay starts at 200 and each row adds 50, so the rows appear in a quick cascade */}
          {CLIENTS.map((client, i) => (
            <Reveal as="li" key={client.name} className="nd-client" delay={200 + i * 50}>
              {/* Name on the left and category on the right (laid out by .nd-client in Team.css) */}
              <h3>{client.name}</h3>
              <span>{client.category}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ---------------------------------- END OF FILE ---------------------------------- //