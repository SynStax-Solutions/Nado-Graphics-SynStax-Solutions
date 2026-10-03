/* =============================================================================
   SECTION HEAD COMPONENT (SectionHead.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Creates the heading area used at the top of website sections.

   What this component does:
   - Displays the main section heading.
   - Displays an optional description below or beside the heading.
   - Keeps the existing "voice" prop for compatibility with older code.

   Props:
   - heading: The main heading displayed in the section.
   - description: Optional supporting text displayed alongside the heading.
   - voice: Kept for compatibility with older code. It is not currently used.

   Note:
   The layout and styling for this component are handled by SectionHead.css.
   ============================================================================= */

import './SectionHead.css'

// -----------------------------------------------------------------------------
// Section heading component
// -----------------------------------------------------------------------------
export default function SectionHead({ heading, description, voice = false }) {
  return (
    <div className="section-head">
      {/* Main section heading */}
      <h2>{heading}</h2>

      {/* Supporting description, shown only when one is provided */}
      {description && <p>{description}</p>}
    </div>
  )
}

/* ---------------------------------- END OF FILE ---------------------------------- */