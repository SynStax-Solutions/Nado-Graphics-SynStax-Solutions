/* =============================================================================
   CTA COMPONENT (CTA.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A React component that renders the call-to-action (CTA) section of the
   Nado Graphics website. It encourages visitors to start a project by
   emailing the agency.

   What it displays:
   - A small label, a heading with a lighter second part, and a line
     containing the email address as a clickable link.
   - An "Email us" button that opens the visitor's email app.

   How it works:
   - All the text and the email address are passed in as props with default
     values, so the section works with no props but can be reused with
     different wording.
   - Both the link and the button use a mailto: address built from the
     email prop, so changing the email in one place updates both.

   Styling is handled in CTA.css, plus shared classes (section, snap,
   statement, label, quiet) that are defined elsewhere in the project.
   ============================================================================= */

import Button from '../ui/Button'    // Shared button component used across the site
import './CTA.css'                   // CTA-specific styles

// Props with default values: the section works without any props being passed in
export default function CTA({
  label = 'Start a project',                          // Small label above the heading
  heading = 'Got a brand that deserves better?',      // First part of the heading
  quiet = "Let's make something warm and loud.",      // Second part of the heading (shown in a lighter colour)
  email = 'enquiries@nadographics.com',               // Email address used for the link and the button
}) {
  return (
    // id="contact" lets other links jump straight to this section.
    // "section" and "snap" are shared classes defined elsewhere in the project.
    <section className="section contact-section snap" id="contact">
      <div className="wrap">
        {/* Layout block for the section's content (the .statement styles are defined elsewhere) */}
        <div className="statement">
          <p className="label">{label}</p>
          <div>
            <h2 className="contact-title">
              {/* The span holds the second part of the heading so CSS can show it in a lighter colour */}
              {heading} <span className="quiet">{quiet}</span>
            </h2>
            <p className="contact-email">
              {/* mailto: opens the visitor's default email app, addressed to this email */}
              Write to <a href={`mailto:${email}`}>{email}</a>
            </p>
          </div>
          {/* variant and arrow are props handled by the shared Button component:
              "primary" is the solid style and arrow adds an arrow icon.
              href with mailto: makes the button open an email instead of going to another page */}
          <Button href={`mailto:${email}`} variant="primary" arrow>
            Email us
          </Button>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------- END OF FILE ---------------------------------- //