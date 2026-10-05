/* =============================================================================
   CONTACT PAGE (ContactPage.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Provides the Contact page where visitors can submit an enquiry or use
   Nado Graphics' direct contact details.

   What this component does:
   - Displays the Contact page introduction
   - Provides an enquiry form
   - Validates required form fields
   - Provides service options
   - Includes a hidden spam-trap field
   - Records POPIA consent (the backend stores the consent timestamp)
   - Sends enquiries to the BMS backend (POST /api/Enquiries)
   - Simulates a successful submission on a laptop if no API URL is set
   - Displays success and error messages
   - Provides direct email, phone, WhatsApp, and location links

   Note:
   The API address comes from VITE_API_URL in .env.development (laptop)
   and .env.production (live site), so no addresses are hardcoded here.
   ============================================================================= */

import { useState } from 'react'

import { Link } from 'react-router-dom'

import Button from '../components/ui/Button'

import './ContactPage.css'


/* ---------- contact details ---------- */

/*
  These values are kept together so the contact information
  can easily be updated in one place.
*/

const EMAIL = 'enquiries@nadographics.com'

const PHONE = '+27 62 151 7981'

const WHATSAPP = '+27 62 151 7981'

const LOCATION = 'Cape Town, South Africa'


/*
  Converts a South African phone number into international format.

  Examples:
  "084 770 4321" becomes "27847704321"
  "+27 62 151 7981" becomes "27621517981"

  The resulting number can be used for telephone and WhatsApp links.
*/

const intl = (num) => {

  const digits = num.replace(/\D/g, '')

  return digits.startsWith('0') ? '27' + digits.slice(1) : digits

}


/* ---------- direct contact links ---------- */

/*
  Contains the contact methods displayed on the right-hand side
  of the Contact page.
*/

const DETAILS = [

  {
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}?subject=${encodeURIComponent('Project enquiry')}`,
  },

  {
    label: 'Call',
    value: PHONE,
    href: `tel:+${intl(PHONE)}`,
  },

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


/* ---------- available services ---------- */

/*
  These options are displayed in the "What do you need?" dropdown.
*/

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


/* ---------- enquiry API ---------- */

/*
  The BMS backend address comes from the environment files:
  - .env.development  -> VITE_API_URL=http://localhost:5295
  - .env.production   -> VITE_API_URL=https://nadographicsapi.runasp.net

  The enquiry endpoint is POST /api/Enquiries (EnquiriesController).
*/

const API_BASE = import.meta.env.VITE_API_URL

const ENQUIRY_API_URL = API_BASE ? `${API_BASE}/api/Enquiries` : null


/* ---------- field limits ---------- */

/*
  These match the backend's EnquiryRequest rules, so visitors can't type
  more than the backend accepts (which would otherwise reject the enquiry).
*/

const LIMITS = {

  name: 100,

  email: 100,

  phone: 20,

  message: 2000,

}


/* ---------- empty form values ---------- */

/*
  Default values used when the form is first loaded
  and when it is reset after a successful submission.
*/

const EMPTY = {

  name: '',

  email: '',

  phone: '',

  service: '',

  message: '',

  website: '',

  consent: false,

}


/* ---------- form validation ---------- */

/*
  Checks the form values and returns an object containing
  any validation errors.
*/

function validate(values) {

  const errors = {}


  /* Name is required */

  if (!values.name.trim()) {

    errors.name = 'Enter your name'

  }


  /* Email is required and must have a valid format */

  if (!values.email.trim()) {

    errors.email = 'Enter your email address'

  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {

    errors.email = 'Enter a valid email address'

  }


  /* Message is required */

  if (!values.message.trim()) {

    errors.message = 'Tell us a little about your project'

  }


  /* POPIA consent is required before the enquiry can be sent */

  if (!values.consent) {

    errors.consent = 'Please tick the box so we can store your details and reply'

  }


  return errors

}


/* =============================================================================
   CONTACT PAGE COMPONENT
   ============================================================================= */

export default function ContactPage() {

  /* ---------- form state ---------- */

  /*
    Stores all values entered into the contact form.
  */

  const [values, setValues] = useState(EMPTY)


  /*
    Stores validation errors for individual form fields.
  */

  const [errors, setErrors] = useState({})


  /*
    Tracks the current form submission state.

    Possible values:
    - idle
    - sending
    - sent
    - error
  */

  const [status, setStatus] = useState('idle')


  /* ---------- field update handler ---------- */

  /*
    Creates an update function for a specific form field.

    Checkbox fields use the checked value.
    Other fields use the input value.
  */

  const update = (field) => (e) => {

    const value = e.target.type === 'checkbox'
      ? e.target.checked
      : e.target.value


    /* Update the selected field while keeping the other values */

    setValues((v) => ({ ...v, [field]: value }))


    /*
      Remove the error for this field as soon as the user
      starts correcting it.
    */

    if (errors[field]) {

      setErrors((err) => ({ ...err, [field]: undefined }))

    }

  }


  /* ---------- form submission ---------- */

  const handleSubmit = async (e) => {

    e.preventDefault()


    /* Validate the form before attempting to submit */

    const found = validate(values)

    setErrors(found)


    /*
      Stop here if any validation errors were found.
    */

    if (Object.keys(found).length) return


    /* ---------- spam trap ---------- */

    /*
      The hidden "website" field should never be completed by a real visitor.

      If it contains a value, it is treated as a spam submission.
      The submission is silently marked as successful.
    */

    if (values.website) {

      setStatus('sent')

      return

    }


    /* ---------- begin submission ---------- */

    setStatus('sending')


    try {

      /*
        Prepare the enquiry data that will be sent to the backend.

        The field names match the backend's EnquiryRequest model.
        The backend records the consent time itself (ConsentGivenAt).
      */

      const enquiry = {

        name: values.name.trim(),

        email: values.email.trim(),

        phone: values.phone.trim() || null,

        service: values.service || null,

        message: values.message.trim(),

        // POPIA: consent is required; the backend records when it was given

        consentGiven: true,

        // Spam trap: always empty for real visitors, also checked by the backend

        website: values.website,

      }


      /* ---------- send to backend ---------- */

      if (ENQUIRY_API_URL) {

        const res = await fetch(ENQUIRY_API_URL, {

          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(enquiry),

        })


        /*
          Treat any non-successful HTTP response as a failed request.
        */

        if (!res.ok) {

          throw new Error('Request failed')

        }

      } else {

        /*
          On the live site, never pretend the enquiry was sent.
          Show the error message instead, which tells the visitor to email us.
        */

        if (import.meta.env.PROD) {

          throw new Error('Enquiry API URL is not configured')

        }


        /*
          On a laptop with no backend configured, the enquiry is logged
          to the browser console and a short delay simulates a submission.
        */

        console.info('Enquiry (not sent, no backend configured):', enquiry)

        await new Promise((r) => setTimeout(r, 700))

      }


      /* ---------- successful submission ---------- */

      setStatus('sent')

      setValues(EMPTY)


    } catch {

      /*
        Display the error state if the backend request fails.
      */

      setStatus('error')

    }

  }


  /* ---------- page layout ---------- */

  return (

    <div className="contact-page">

      <section className="contact-main">

        <div className="wrap">


          {/* ---------- page introduction ---------- */}

          <div className="contact-intro">

            <p className="contact-intro-label">
              Contact us
            </p>

            <h1 className="contact-intro-title">

              Let&rsquo;s work together.

              <span className="quiet">
                We&rsquo;d love to hear from you.
              </span>

            </h1>

          </div>


          {/* ---------- main contact layout ---------- */}

          <div className="contact-layout">


            {/* ---------- enquiry form ---------- */}

            <div className="contact-form-wrap">

              {/*
                Once the enquiry has been successfully submitted,
                the form is replaced with the thank-you message.
              */}

              {status === 'sent' ? (

                <div className="contact-sent" role="status">

                  <h2>
                    Thanks, your enquiry is on its way.
                  </h2>

                  <p>
                    We&rsquo;ll be in touch soon. If it&rsquo;s urgent,
                    WhatsApp or call us on {PHONE}.
                  </p>

                  <button
                    type="button"
                    className="contact-again"
                    onClick={() => setStatus('idle')}
                  >
                    Send another enquiry
                  </button>

                </div>

              ) : (

                /* ---------- enquiry form ---------- */

                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                >


                  {/* ---------- name and email ---------- */}

                  <div className="field-row">

                    <Field
                      label="Name"
                      error={errors.name}
                    >

                      <input
                        type="text"
                        autoComplete="name"
                        maxLength={LIMITS.name}
                        value={values.name}
                        onChange={update('name')}
                      />

                    </Field>


                    <Field
                      label="Email"
                      error={errors.email}
                    >

                      <input
                        type="email"
                        autoComplete="email"
                        maxLength={LIMITS.email}
                        value={values.email}
                        onChange={update('email')}
                      />

                    </Field>

                  </div>


                  {/* ---------- phone and service ---------- */}

                  <div className="field-row">

                    <Field
                      label="Phone"
                      optional
                    >

                      <input
                        type="tel"
                        autoComplete="tel"
                        maxLength={LIMITS.phone}
                        value={values.phone}
                        onChange={update('phone')}
                      />

                    </Field>


                    <Field
                      label="What do you need?"
                      optional
                    >

                      <select
                        value={values.service}
                        onChange={update('service')}
                      >

                        <option value="">
                          Choose a service
                        </option>

                        {SERVICES.map((s) => (

                          <option
                            key={s}
                            value={s}
                          >
                            {s}
                          </option>

                        ))}

                      </select>

                    </Field>

                  </div>


                  {/* ---------- message ---------- */}

                  <Field
                    label="Message"
                    error={errors.message}
                  >

                    <textarea
                      rows={5}
                      maxLength={LIMITS.message}
                      value={values.message}
                      onChange={update('message')}
                    />

                  </Field>


                  {/* ---------- hidden spam trap ---------- */}

                  {/*
                    This field is hidden from normal visitors.

                    Spam bots may automatically fill it in, allowing
                    the form to identify likely spam submissions.
                  */}

                  <div
                    className="contact-trap"
                    aria-hidden="true"
                  >

                    <label>

                      Website

                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={values.website}
                        onChange={update('website')}
                      />

                    </label>

                  </div>


                  {/* ---------- POPIA consent ---------- */}

                  {/*
                    The user must agree to the storage of their details
                    before the enquiry can be submitted.
                  */}

                  <div
                    className={`consent ${errors.consent ? 'has-error' : ''}`}
                  >

                    <label className="consent-label">

                      <input
                        type="checkbox"
                        checked={values.consent}
                        onChange={update('consent')}
                      />

                      <span>

                        I agree to Nado Graphics storing my details
                        to respond to my enquiry.

                        {' '}

                        See our <Link to="/privacy">Privacy Policy</Link>.

                      </span>

                    </label>


                    {/* Display the consent validation message */}

                    {errors.consent && (

                      <span className="field-error">
                        {errors.consent}
                      </span>

                    )}

                  </div>


                  {/* ---------- submission error ---------- */}

                  {status === 'error' && (

                    <p
                      className="contact-error"
                      role="alert"
                    >
                      Something went wrong sending your enquiry.
                      Please try again, or email us at {EMAIL}.
                    </p>

                  )}


                  {/* ---------- submit button ---------- */}

                  <Button
                    type="submit"
                    variant="primary"
                    arrow
                    disabled={status === 'sending'}
                  >

                    {status === 'sending'
                      ? 'Sending…'
                      : 'Send enquiry'}

                  </Button>

                </form>

              )}

            </div>


            {/* ---------- contact details ---------- */}

            <aside
              className="contact-details"
              aria-label="Other ways to reach us"
            >

              <p className="contact-details-heading">
                Or reach us directly
              </p>


              {/* ---------- contact detail list ---------- */}

              <ul>

                {DETAILS.map((d) => (

                  <li key={d.label}>

                    <a
                      href={d.href}
                      {...(
                        d.external
                          ? {
                              target: '_blank',
                              rel: 'noopener noreferrer',
                            }
                          : {}
                      )}
                    >

                      <span className="contact-detail-label">
                        {d.label}
                      </span>

                      <span className="contact-detail-value">

                        {d.value}

                        {/* Arrow shown for each contact detail */}

                        <span
                          className="contact-detail-arrow"
                          aria-hidden="true"
                        >
                          &#8599;
                        </span>

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


/* =============================================================================
   FIELD COMPONENT
   -----------------------------------------------------------------------------
   Purpose:
   Provides a reusable wrapper for individual contact form fields.

   What this component does:
   - Displays the field label
   - Shows "(optional)" when required
   - Renders the supplied input, select, or textarea
   - Displays a validation error when one exists

   Props:
   - label    The label displayed above the field
   - optional Whether the field should display "(optional)"
   - error    Validation error message, if any
   - children The actual form input element

   Note:
   Keeping the field structure in one reusable component ensures
   all form fields follow the same layout and validation pattern.
   ============================================================================= */

function Field({ label, optional, error, children }) {

  return (

    <label className={`field ${error ? 'has-error' : ''}`}>

      {/* ---------- field label ---------- */}

      <span className="field-label">

        {label}

        {optional && (

          <span className="field-optional">
            {' '} (optional)
          </span>

        )}

      </span>


      {/* ---------- form control ---------- */}

      {children}


      {/* ---------- validation error ---------- */}

      {error && (

        <span className="field-error">
          {error}
        </span>

      )}

    </label>

  )

}


/* ---------------------------------- END OF FILE ---------------------------------- */
