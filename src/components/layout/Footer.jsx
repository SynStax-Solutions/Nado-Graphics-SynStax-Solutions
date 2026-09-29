import Button from '../ui/Button'
import './Footer.css'

export default function Footer({
  brand = 'Nado Graphics',
  location = 'Cape Town, ZA',
  email = 'enquiries@nadographics.com',
  studio = 'Cape Town, South Africa',
  phone = '084 770 4321',
  whatsapp = '084 770 4321',
}) {
  // Turns "084 770 4321" into "27847704321" (South African number in international format)
  const intl = (num) => '27' + num.replace(/\D/g, '').replace(/^0/, '')

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
                <a href={`https://wa.me/${intl(whatsapp)}`} target="_blank" rel="noopener noreferrer">
                  {whatsapp}
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
          &copy; {new Date().getFullYear()} {brand} &middot; {location}
        </div>
      </div>
    </footer>
  )
}