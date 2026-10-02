import Button from '../ui/Button'
import './Footer.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

export default function Footer({
  brand = 'Nado Graphics',
  location = 'Cape Town, ZA',
  email = 'enquiries@nadographics.com',
  studio = 'Cape Town, South Africa',
  phone = '+27 62 151 7981',
  whatsapp = '+27 62 151 7981',
}) {
    // Turns a number like "+27 62 151 7981" or "062 151 7981" into "27621517981" for call and WhatsApp links
  const intl = (num) => {
    const digits = num.replace(/\D/g, '')
    return digits.startsWith('0') ? '27' + digits.slice(1) : digits
  }

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <p className="footer-label">Contact</p>
            <p className="footer-headline">Ready when you are.</p>
            <Button href={`mailto:${email}`} variant="light" arrow>
              Let&rsquo;s talk
            </Button>
          </div>

          {/* Contact details on the right */}
          <dl className="footer-details">
            <div>
              <dt>Email</dt>
              <dd><a href={`mailto:${email}`}>{email}</a></dd>
            </div>
            <div>
              <dt>Cellphone</dt>
              <dd><a href={`tel:+${intl(phone)}`}>{phone}</a></dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>
                {/* WhatsApp icon instead of the number; opens a chat the same way */}
                <a
                  href={`https://wa.me/${intl(whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-whatsapp"
                  aria-label={`Chat on WhatsApp (${whatsapp})`}
                  title="Chat on WhatsApp"
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

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} {brand} &middot; {location}</span>
          <Link to="/privacy" className="footer-privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}