/* =============================================================================
   FOOTER COMPONENT (Footer.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   A reusable React component that renders the site-wide footer for the
   Nado Graphics website.

   What it displays:
   - A "Contact" call-to-action: label, headline and a "Let's talk" button
     that opens the visitor's email app.
   - A list of contact details: email, cellphone, WhatsApp chat button and
     the studio location.
   - A bottom bar with the current year's copyright and a Privacy Policy link.

   How it works:
   - Every piece of text is passed in as a prop with a default value, so the
     footer works with no props but can be customised if needed.
   - A helper function (intl) converts phone numbers into the international
     format that tel: and WhatsApp links require.

   Styling is handled in Footer.css.
   ============================================================================= */

import Button from '../ui/Button'                           // Shared button component used across the site
import './Footer.css'                                       // Footer-specific styles
import { Link } from 'react-router-dom'                     // Client-side navigation (no full page reload)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'  // Renders Font Awesome icons in React
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'   // The WhatsApp logo icon

// Props with default values: the footer works without any props being passed in
export default function Footer({
  brand = 'Nado Graphics',               // Company name shown in the copyright line
  location = 'Cape Town, ZA',            // Short location shown in the copyright line
  email = 'enquiries@nadographics.com',  // Contact email address
  studio = 'Cape Town, South Africa',    // Full location shown under "Based"
  phone = '+27 62 151 7981',             // Phone number for the call link
  whatsapp = '+27 62 151 7981',          // Number used for the WhatsApp chat link
}) {
  // Turns a number like "+27 62 151 7981" or "062 151 7981" into "27621517981" for call and WhatsApp links
  const intl = (num) => {
    // Remove everything that isn't a digit (spaces, plus signs, dashes, brackets)
    const digits = num.replace(/\D/g, '')
    // A leading 0 is the local South African format, so swap it for the country code 27.
    // Numbers already in international format are returned as they are.
    return digits.startsWith('0') ? '27' + digits.slice(1) : digits
  }

  return (
    <footer className="site-footer">
      <div className="wrap">
        {/* Top section: call-to-action on the left, contact details on the right */}
        <div className="footer-top">
          <div>
            <p className="footer-label">Contact</p>
            <p className="footer-headline">Ready when you are.</p>
            {/* Opens the visitor's default email app, addressed to our email.
                &rsquo; is the HTML code for a curly apostrophe */}
            <Button href={`mailto:${email}`} variant="light" arrow>
              Let&rsquo;s talk
            </Button>
          </div>

          {/* Contact details on the right */}
          {/* <dl> is a description list: each <dt> is a label and each <dd> its value */}
          <dl className="footer-details">
            <div>
              <dt>Email</dt>
              {/* mailto: opens the visitor's email app */}
              <dd><a href={`mailto:${email}`}>{email}</a></dd>
            </div>
            <div>
              <dt>Cellphone</dt>
              {/* tel: lets mobile users tap to call. The + and intl() ensure the number is international */}
              <dd><a href={`tel:+${intl(phone)}`}>{phone}</a></dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>
                {/* WhatsApp icon instead of the number; opens a chat the same way */}
                <a
                  href={`https://wa.me/${intl(whatsapp)}`}
                  target="_blank"              // Opens WhatsApp in a new tab
                  rel="noopener noreferrer"    // Security: stops the new tab from accessing this page
                  className="footer-whatsapp"
                  aria-label={`Chat on WhatsApp (${whatsapp})`}  // Screen readers need text since the link is only an icon
                  title="Chat on WhatsApp"     // Tooltip shown when hovering
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
              </dd>
            </div>
            <div>
              <dt>Based</dt>
              <dd>{studio}</dd>
            </div>
          </dl>
        </div>

        {/* Bottom bar: copyright and privacy link */}
        <div className="footer-bottom">
          {/* new Date().getFullYear() keeps the copyright year up to date automatically.
              &copy; is the © symbol and &middot; is the dot separator */}
          <span>&copy; {new Date().getFullYear()} {brand} &middot; {location}</span>
          {/* Link (from react-router) navigates to the privacy page without reloading the site */}
          <Link to="/privacy" className="footer-privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}

// ---------------------------------- END OF FILE ---------------------------------- //