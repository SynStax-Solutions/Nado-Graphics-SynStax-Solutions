import Button from '../ui/Button'
import './CTA.css'

export default function CTA({
  label = 'Start a project',
  heading = 'Got a brand that deserves better?',
  quiet = "Let's make something warm and loud.",
  email = 'enquiries@nadographics.com',
}) {
  return (
    <section className="section contact-section snap" id="contact">
      <div className="wrap">
        <div className="statement">
          <p className="label">{label}</p>
          <div>
            <h2 className="contact-title">
              {heading} <span className="quiet">{quiet}</span>
            </h2>
            <p className="contact-email">
              Write to <a href={`mailto:${email}`}>{email}</a>
            </p>
          </div>
          <Button href={`mailto:${email}`} variant="primary" arrow>
            Email us
          </Button>
        </div>
      </div>
    </section>
  )
}