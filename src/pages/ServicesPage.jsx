/* =============================================================================
   SERVICES PAGE (ServicesPage.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   - Displays the services offered by Nado Graphics.

   What this component does:
   - Displays the page introduction for the services section.
   - Provides supporting information about the range of services.
   - Displays the ServiceGrid containing the individual services.

   Note:
   - The service details themselves are handled by the ServiceGrid component.
   ============================================================================= */

import PageIntro from '../components/ui/PageIntro'
import ServiceGrid from '../components/sections/ServiceGrid'

export default function ServicesPage() {
  return (
    <div className="services-page">

      {/* -----------------------------------------------------------------------
          Page introduction
          -----------------------------------------------------------------------
          Introduces the services offered by Nado Graphics and gives visitors
          a short overview of what the team provides.
      ----------------------------------------------------------------------- */}

      <div className="wrap">
        <PageIntro
          label="Our services"
          title="Everything under one roof."
          quiet="From a single logo to a campus-wide rollout."
          lead="Design, print, signage, merchandise and motion, handled by one team from the first idea to the finished piece."
        />
      </div>

      {/* -----------------------------------------------------------------------
          Services grid
          -----------------------------------------------------------------------
          Displays the individual services available from Nado Graphics.
      ----------------------------------------------------------------------- */}

      <ServiceGrid />
    </div>
  )
}

/* ---------------------------------- END OF FILE ---------------------------------- */