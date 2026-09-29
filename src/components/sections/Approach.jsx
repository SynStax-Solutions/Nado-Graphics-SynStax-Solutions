import Reveal from '../ui/Reveal'
import './Approach.css'

// The full services list now lives on the Home page (Process.jsx).
export default function Approach() {
  return (
    <section className="nd-approach" id="approach">
      <div className="wrap">
        <Reveal className="nd-eyebrow">What we actually do</Reveal>

        <Reveal as="h2" className="nd-heading nd-approach-title" delay={80}>
          Concept, design, print and web.
          <span className="quiet">One agency, one point of contact.</span>
        </Reveal>

        <Reveal as="p" className="nd-lead nd-approach-lead" delay={140}>
          We cover everything from a single logo to a full campus-wide rollout: identity, print,
          promotional goods, signage, digital and motion, all under one roof.
        </Reveal>

        <Reveal className="nd-approach-scale" delay={200}>
          <p className="nd-scale-badge">Large-scale delivery</p>
          <h3>Extensive experience with universities and higher education institutions.</h3>
          <p>
            We&rsquo;ve delivered branding, print and signage across higher education,
            from multi-campus rollouts and faculty-wide print runs to the demands of orientation week.
            We&rsquo;ve also worked with large corporate clients over many years.
            When something needs to reach thousands of people at once, we know how to make it happen.
          </p>
        </Reveal>
      </div>
    </section>
  )
}