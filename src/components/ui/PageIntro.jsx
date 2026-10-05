import './PageIntro.css'

/* =============================================================================
   PAGE INTRO COMPONENT (PageIntro.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Provides a reusable page introduction layout for pages throughout the
   Nado Graphics website.

   What this component contains:
   - An optional page label.
   - A main page heading.
   - An optional quieter secondary part of the heading.
   - An optional supporting paragraph.

   Props:
   - label : Small text displayed above the page heading.
   - title : Main page heading text.
   - quiet : Optional secondary heading text displayed on a new line.
   - lead  : Optional supporting paragraph displayed below the heading.

   Note: the component only renders the quiet text and lead paragraph when
   values are provided.
   ============================================================================= */


/* Reusable page introduction component */
export default function PageIntro({
  label,
  title,
  quiet,
  lead
}) {
  return (
    <div className="page-intro">

      {/* Small label displayed above the main page heading */}
      <p className="page-intro-label">
        {label}
      </p>

      {/* Main page heading containing the title and optional quiet text */}
      <h1 className="page-intro-title">
        {title}

        {/* Displays the secondary heading text on a new line when provided */}
        {quiet && (
          <span className="quiet">
            {quiet}
          </span>
        )}
      </h1>

      {/* Supporting paragraph is only rendered when lead text is provided */}
      {lead && (
        <p className="page-intro-lead">
          {lead}
        </p>
      )}

    </div>
  )
}


/* ---------------------------------- END OF FILE ---------------------------------- */