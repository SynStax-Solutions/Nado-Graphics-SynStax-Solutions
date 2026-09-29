import Reveal from '../ui/Reveal'
import './Team.css'

const STATS = [
  { value: '3+', label: 'Universities & higher ed institutions' },
  { value: '40+', label: 'Brands shipped since 2000' },
  { value: 'Nationwide', label: 'Large-scale, multi-campus rollouts' },
]

// Placeholders for clients logos
const CLIENTS = [
  { name: 'University of the Western Cape', category: 'Higher Education' },
  { name: 'University of Cape Town', category: 'Higher Education' },
  { name: 'University of Pretoria', category: 'Higher Education' },
  { name: 'University of Stellenbosch', category: 'Higher Education' },
  { name: 'Melomed Hospital', category: 'Healthcare & Medical' },
  { name: 'CancerCare', category: 'Healthcare & Medical' },
]

export default function Team({ showHead = true }) {
  return (
    <section className="nd-team" id="clients">
      <div className="wrap">
        {/* The heading is hidden on the Clients page, which has its own intro */}
        {showHead && (
          <>
            <Reveal className="nd-eyebrow">Trusted by</Reveal>

            <Reveal as="h2" className="nd-heading nd-team-title" delay={80}>
              Big clients we&rsquo;ve worked with.
            </Reveal>

            <Reveal as="p" className="nd-lead nd-team-lead" delay={140}>
              From university campuses to national corporates, we&rsquo;ve delivered
              branding, print and signage at a scale most studios our size never see.
            </Reveal>
          </>
        )}

        <div className="nd-figures nd-team-stats">
          {STATS.map((s, i) => (
            <Reveal key={s.label} className="nd-figure" delay={180 + i * 80}>
              <span className="nd-figure-value">{s.value}</span>
              <p>{s.label}</p>
            </Reveal>
          ))}
        </div>

        <ul className="nd-client-list">
          {CLIENTS.map((client, i) => (
            <Reveal as="li" key={client.name} className="nd-client" delay={200 + i * 50}>
              <h3>{client.name}</h3>
              <span>{client.category}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}