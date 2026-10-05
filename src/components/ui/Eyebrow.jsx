/* =============================================================================
   EYEBROW COMPONENT (Eyebrow.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Provides a reusable component for displaying small introductory text above
   headings or other page content.

   What this component does:
   - Imports the Eyebrow.css stylesheet.
   - Wraps the supplied content in a styled div.
   - Allows any content to be passed through the children prop.

   Props:
   - children: The text or content displayed inside the eyebrow element.

   Note:
   This component only handles the structure. The appearance is controlled
   by Eyebrow.css.
   ============================================================================= */

import './Eyebrow.css'

export default function Eyebrow({ children }) {
  // ---------- Render the eyebrow text ----------
  return <div className="eyebrow">{children}</div>
}

/* ---------------------------------- END OF FILE ---------------------------------- */