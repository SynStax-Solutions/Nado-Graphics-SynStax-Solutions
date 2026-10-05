/* =============================================================================
   PRIVACY PAGE (PrivacyPage.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   - Displays Nado Graphics' privacy policy and POPIA information.

   What this component does:
   - Shows the privacy policy introduction and last updated date.
   - Explains what personal information Nado Graphics collects.
   - Explains why the information is collected and how it is used.
   - Explains how information is stored, protected and retained.
   - Outlines the user's rights under POPIA.
   - Provides contact details for privacy-related enquiries.
   - Links users to the Contact page when they need to get in touch.

   Note:
   - The privacy policy content is currently a draft and should be reviewed
     by Nado Graphics before being treated as the final policy.
   ============================================================================= */

import { Link } from 'react-router-dom'
import PageIntro from '../components/ui/PageIntro'
import './PrivacyPage.css'

// -----------------------------------------------------------------------------
// Privacy policy contact details and update date.
// -----------------------------------------------------------------------------

const EMAIL = 'enquiries@nadographics.com'
const PHONE = '+27 62 151 7981'
const UPDATED = '1 October 2026'

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <div className="wrap">

        {/* ---------------------------------------------------------------------
            Page introduction
            ---------------------------------------------------------------------
            Displays the privacy policy title, supporting text and the date
            the policy was last updated.
        --------------------------------------------------------------------- */}

        <PageIntro
          label="Privacy Policy"
          title="Your information, handled with care."
          quiet="What we collect, why, and your rights."
          lead={`Last updated: ${UPDATED}`}
        />

        {/* ---------------------------------------------------------------------
            Privacy policy content
            ---------------------------------------------------------------------
            Each section covers a different part of Nado Graphics' privacy
            policy and how personal information is handled.
        --------------------------------------------------------------------- */}

        <div className="privacy-body">

          {/* -------------------------------------------------------------------
              Section 1: Who we are
              ------------------------------------------------------------------- */}

          <section>
            <h2>1. Who we are</h2>

            <p>
              Nado Graphics is a design and print agency based in Cape Town, South Africa. When you contact us,
              we are responsible for the personal information you give us, in line with the Protection of
              Personal Information Act 4 of 2013 (POPIA).
            </p>

            <p>
              You can reach us about anything in this policy at{' '}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or on {PHONE}.
            </p>
          </section>

          {/* -------------------------------------------------------------------
              Section 2: What we collect
              -------------------------------------------------------------------
              Lists the information that may be collected through the contact
              form and other communication channels.
          ------------------------------------------------------------------- */}

          <section>
            <h2>2. What we collect</h2>

            <p>
              When you send an enquiry through our contact form, we collect:
            </p>

            <ul>
              <li>your name</li>
              <li>your email address</li>
              <li>your phone number, if you choose to give it</li>
              <li>the service you are interested in, if you choose one</li>
              <li>your message</li>
            </ul>

            <p>
              If you contact us by email, phone or WhatsApp instead, we keep the details and messages you send us
              in the same way.
            </p>

            <p>
              Our website does not use cookies, analytics or advertising trackers, and we do not collect
              information about you while you browse.
            </p>
          </section>

          {/* -------------------------------------------------------------------
              Section 3: Why we collect it
              -------------------------------------------------------------------
              Explains the purposes for which collected information is used.
          ------------------------------------------------------------------- */}

          <section>
            <h2>3. Why we collect it</h2>

            <p>We use your information only to:</p>

            <ul>
              <li>reply to your enquiry and give you a quote</li>
              <li>plan, design, print and deliver the work you ask us to do</li>
              <li>keep a record of our projects and correspondence with you</li>
            </ul>

            <p>
              We will not send you marketing or newsletters unless you have asked us to, and you can ask us to stop
              at any time.
            </p>
          </section>

          {/* -------------------------------------------------------------------
              Section 4: Is it voluntary?
              -------------------------------------------------------------------
              Explains which information is necessary for an enquiry and which
              information is optional.
          ------------------------------------------------------------------- */}

          <section>
            <h2>4. Is it voluntary?</h2>

            <p>
              Yes. You choose what to share with us. We do need your name, email address and a short message to be
              able to reply to your enquiry. Your phone number and service choice are optional.
            </p>
          </section>

          {/* -------------------------------------------------------------------
              Section 5: Storage and access
              -------------------------------------------------------------------
              Explains where enquiries are stored and who is permitted to
              access them.
          ------------------------------------------------------------------- */}

          <section>
            <h2>5. Where it is stored and who can see it</h2>

            <p>
              Enquiries are stored in our internal business management system. Only Nado Graphics staff who handle
              enquiries and projects can see them, and they need a personal login to do so.
            </p>

            <p>
              We use trusted service providers to run our website and email, and they process information only on
              our behalf. We never sell, rent or trade your personal information.
            </p>
          </section>

          {/* -------------------------------------------------------------------
              Section 6: How long we keep it
              -------------------------------------------------------------------
              Explains the intended retention period for personal information.

              CHECK:
              Confirm the two-year retention period with Nado Graphics before
              publishing the final privacy policy.
          ------------------------------------------------------------------- */}

          <section>
            <h2>6. How long we keep it</h2>

            {/* CHECK: Confirm this retention period with Nado Graphics. */}
            <p>
              We keep your information for as long as we need it to respond to you and complete any work, and then
              for up to two years for our business records, unless the law requires us to keep it longer. After that
              it is deleted.
            </p>
          </section>

          {/* -------------------------------------------------------------------
              Section 7: How we protect it
              -------------------------------------------------------------------
              Describes the security measures used to protect personal
              information.
          ------------------------------------------------------------------- */}

          <section>
            <h2>7. How we protect it</h2>

            <p>
              We take reasonable steps to keep your information safe, including password-protected accounts, limiting
              who can see it, and storing passwords securely. No system is completely secure, but we will tell you and
              the Information Regulator if your information is ever accessed by someone who should not have it.
            </p>
          </section>

          {/* -------------------------------------------------------------------
              Section 8: Your rights
              -------------------------------------------------------------------
              Lists the rights users can exercise regarding their personal
              information under POPIA.
          ------------------------------------------------------------------- */}

          <section>
            <h2>8. Your rights</h2>

            <p>Under POPIA, you have the right to:</p>

            <ul>
              <li>ask what personal information we hold about you</li>
              <li>ask us to correct information that is wrong or out of date</li>
              <li>ask us to delete your information</li>
              <li>object to us using your information</li>
            </ul>

            <p>
              To do any of these, email us at{' '}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We may need to confirm who you
              are before we act on the request.
            </p>
          </section>

          {/* -------------------------------------------------------------------
              Section 9: Changes to the policy
              -------------------------------------------------------------------
              Explains that the policy may be updated and provides a link to
              the Contact page for further questions.
          ------------------------------------------------------------------- */}

          <section>
            <h2>9. Changes to this policy</h2>

            <p>
              We may update this policy from time to time. The date at the top shows when it last changed. If you have
              any questions, <Link to="/contact">get in touch</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- END OF FILE ---------------------------------- */