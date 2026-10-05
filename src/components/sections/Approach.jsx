/* =============================================================================
   APPROACH COMPONENT (Approach.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the "Approach" section of the Nado Graphics
   website. It explains what the agency does and highlights its experience
   with large-scale projects for universities and higher education.

   What it displays:
   - A small eyebrow label ("What we actually do").
   - A two-part heading: the services offered, then a lighter line about
     having one agency and one point of contact.
   - A lead paragraph summarising the range of work.
   - A dark highlighted panel about large-scale delivery, with a badge,
     a heading and a supporting paragraph.

   How it works:
   - The component has no props, state or logic. It only displays fixed content.
   - Each piece of content is wrapped in the Reveal component, which animates
     it in when it appears on screen. The delay values increase down the page
     so the elements appear one after another.

   Styling is handled in Approach.css, plus shared classes (nd-eyebrow,
   nd-heading, nd-lead) that are defined elsewhere in the project.
   ============================================================================= */

import Reveal from '../ui/Reveal'      // Wrapper that animates its content in when it appears on screen
import './Approach.css'                // Approach-specific styles

// The full services list now lives on the Home page (Process.jsx).
export default function Approach() {
  return (
    // id="approach" lets other links jump straight to this section
    <section className="nd-approach" id="approach">
      <div className="wrap">
        {/* Small label above the heading. With no "as" prop, Reveal falls back to its default element */}
        <Reveal className="nd-eyebrow">What we actually do</Reveal>

        {/* "as" sets which HTML tag Reveal renders (here an <h2>), and "delay" staggers the
            timing so this appears after the label. The delay unit is set inside Reveal,
            so check that component to confirm it (it is probably milliseconds).
            The span holds the second line of the heading so CSS can show it in a lighter colour */}
        <Reveal as="h2" className="nd-heading nd-approach-title" delay={80}>
          Concept, design, print and web.
          <span className="quiet">One agency, one point of contact.</span>
        </Reveal>

        {/* Lead paragraph summarising everything the agency covers.
            Uses a shared class (nd-lead) plus a section-specific one (nd-approach-lead) for the extra spacing */}
        <Reveal as="p" className="nd-lead nd-approach-lead" delay={140}>
          We cover everything from a single logo to a full campus-wide rollout: identity, print,
          promotional goods, signage, digital and motion, all under one roof.
        </Reveal>

        {/* Dark highlighted panel about large-scale work (styled in Approach.css).
            The three elements inside are, in order: badge, heading, paragraph.
            The CSS relies on this order: p:last-child targets the final paragraph,
            so the paragraph must stay the last element in the panel */}
        <Reveal className="nd-approach-scale" delay={200}>
          <p className="nd-scale-badge">Large-scale delivery</p>
          <h3>Extensive experience with universities and higher education institutions.</h3>
          {/* &rsquo; is the HTML code for a curly apostrophe */}
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

// ---------------------------------- END OF FILE ---------------------------------- //