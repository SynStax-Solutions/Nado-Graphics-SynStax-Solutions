/* =============================================================================
   ABOUT PAGE (AboutPage.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Defines the main About page and combines its individual sections into one
   page layout.

   What this component does:
   - Imports the individual About page sections.
   - Loads the About page stylesheet.
   - Places the sections in their intended order.
   - Wraps all About page content in a shared about-page container.

   Sections:
   - AboutHero: Introduces the About page.
   - Story: Provides information about the company's story.
   - Values: Presents the company's values.
   - Approach: Explains the company's approach to its work.

   Note:
   The styling for the overall About page is handled by AboutPage.css.
   Individual sections can have their own component-specific stylesheets.
   ============================================================================= */

// ---------- React import ----------
import React from 'react';

// ---------- About page sections ----------
import AboutHero from '../components/sections/AboutHero';
import Story from '../components/sections/Story';
import Values from '../components/sections/Values';
import Approach from '../components/sections/Approach';

// ---------- About page styles ----------
import './AboutPage.css';


/* =============================================================================
   ABOUT PAGE COMPONENT
   ============================================================================= */

export default function AboutPage() {
  return (
    <div className="about-page">

      {/* ---------- About page introduction ---------- */}
      <AboutHero />

      {/* ---------- Company story section ---------- */}
      <Story />

      {/* ---------- Company values section ---------- */}
      <Values />

      {/* ---------- Company approach section ---------- */}
      <Approach />

    </div>
  );
}

/* ---------------------------------- END OF FILE ---------------------------------- */