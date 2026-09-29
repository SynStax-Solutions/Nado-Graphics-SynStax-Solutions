import { useState } from 'react'
import Button from '../components/ui/Button'
import './ContactPage.css'

/* ---------- contact details (change them here) ---------- */
const EMAIL = 'enquiries@nadographics.com'
const PHONE = '084 770 4321'
const WHATSAPP = '084 770 4321'
const LOCATION = 'Cape Town, South Africa'

// Turns "084 770 4321" into "27847704321" (South African number in international format)
const intl = (num) => '27' + num.replace(/\D/g, '').replace(/^0/, '')

const DETAILS = [
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}?subject=${encodeURIComponent('Project enquiry')}` },
  { label: 'Call', value: PHONE, href: `tel:+${intl(PHONE)}` },
  {
    label: 'WhatsApp',
    value: WHATSAPP,
    href: `https://wa.me/${intl(WHATSAPP)}?text=${encodeURIComponent("Hi Nado Graphics, I'd like to chat about a project.")}`,
    external: true,
  },
  {
    label: 'Based in',
    value: LOCATION,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(LOCATION)}`,
    external: true,
  },
]

const SERVICES = [
  'Branding & identity',
  'Print',
  'Publications',
  'Signage & banners',
  'Apparel',
  'Corporate gifts & promo items',
  'Web & digital',
  'Something else',
]

/*
  NOTE TO JADE: when the BMS has an enquiries endpoint, put its address here,
  e.g. 'https://your-bms-api.com/api/enquiries'. Until then the form only
  pretends to send, so the page can be designed and tested.
*/

const ENQUIRY_API_URL = null

const EMPTY = { name: '', email: '', phone: '', service: '', message: '', website: '' }

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Enter your name'
  if (!values.email.trim()) errors.email = 'Enter your email address'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address'
  if (!values.message.trim()) errors.message = 'Tell us a little about your project'
  return errors
}

export default function ContactPage() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return

    // Hidden "website" field: people never fill it in, spam bots usually do
    if (values.website) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const enquiry = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        service: values.service,
        message: values.message.trim(),
      }

      if (ENQUIRY_API_URL) {
        const res = await fetch(ENQUIRY_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enquiry),
        })
        if (!res.ok) throw new Error('Request failed')
      } else {
        // No backend yet: pretend it sent
        console.info('Enquiry (not sent, no backend yet):', enquiry)
        await new Promise((r) => setTimeout(r, 700))
      }

      setStatus('sent')
      setValues(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="contact-page">
      <section className="contact-main">
        <div className="wrap">
          <div className="contact-intro">
            <p className="contact-intro-label">Contact us</p>
            <h1 className="contact-intro-title">
              Let&rsquo;s work together.
              <span className="quiet">We&rsquo;d love to hear from you.</span>
            </h1>
          </div>

          <div className="contact-layout">
            {/* ---------- enquiry form ---------- */}
            <div className="contact-form-wrap">
              {status === 'sent' ? (
                <div className="contact-sent" role="status">
                  <h2>Thanks, your enquiry is on its way.</h2>
                  <p>We&rsquo;ll be in touch soon. If it&rsquo;s urgent, WhatsApp or call us on {PHONE}.</p>
                  <button type="button" className="contact-again" onClick={() => setStatus('idle')}>
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="field-row">
                    <Field label="Name" error={errors.name}>
                      <input type="text" autoComplete="name" value={values.name} onChange={update('name')} />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input type="email" autoComplete="email" value={values.email} onChange={update('email')} />
                    </Field>
                  </div>

                  <div className="field-row">
                    <Field label="Phone" optional>
                      <input type="tel" autoComplete="tel" value={values.phone} onChange={update('phone')} />
                    </Field>
                    <Field label="What do you need?" optional>
                      <select value={values.service} onChange={update('service')}>
                        <option value="">Choose a service</option>
                        {SERVICES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Message" error={errors.message}>
                    <textarea rows={5} value={values.message} onChange={update('message')} />
                  </Field>

                  {/* Spam trap: hidden from people */}
                  <div className="contact-trap" aria-hidden="true">
                    <label>
                      Website
                      <input type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={update('website')} />
                    </label>
                  </div>

                  {status === 'error' && (
                    <p className="contact-error" role="alert">
                      Something went wrong sending your enquiry. Please try again, or email us at {EMAIL}.
                    </p>
                  )}

                  <Button type="submit" variant="primary" arrow disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send enquiry'}
                  </Button>
                </form>
              )}
            </div>

            {/* ---------- contact details ---------- */}
            <aside className="contact-details" aria-label="Other ways to reach us">
              <p className="contact-details-heading">Or reach us directly</p>
              <ul>
                {DETAILS.map((d) => (
                  <li key={d.label}>
                    <a href={d.href} {...(d.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      <span className="contact-detail-label">{d.label}</span>
                      <span className="contact-detail-value">
                        {d.value}
                        <span className="contact-detail-arrow" aria-hidden="true">&#8599;</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}

/* One form field: label, the input, and an error message if there is one */
function Field({ label, optional, error, children }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span className="field-label">
        {label}
        {optional && <span className="field-optional"> (optional)</span>}
      </span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}