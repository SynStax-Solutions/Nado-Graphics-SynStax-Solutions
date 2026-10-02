import Reveal from '../components/ui/Reveal'
import { CLIENT_LOGOS } from '../data/clients'
import './ClientsPage.css'

export default function ClientsPage() {
  return (
    <div className="clients-page">
      <div className="wrap">
        {/* Yellow banner */}
        <section className="clients-banner">
          <div className="clients-banner-text">
            <p className="clients-banner-label">Our clients</p>
            <h1 className="clients-banner-title">
              Some of our
              <br />
              clients
            </h1>
            <p className="clients-banner-lead">
              We&rsquo;re proud to share some of the organisations who trust us with their brands. 
              From university campuses to hospitals and international sporting events.
            </p>
          </div>

          {/* Decorative thin rings, echoing the Nado logo. A small dot on each ring shows it turning. */}
          <svg className="clients-banner-rings" viewBox="0 0 400 400" aria-hidden="true">
            <g className="ring ring-1">
              <circle cx="260" cy="200" r="180" />
              <circle className="ring-dot" cx="440" cy="200" r="5" />
            </g>
            <g className="ring ring-2">
              <circle cx="260" cy="200" r="120" />
              <circle className="ring-dot" cx="380" cy="200" r="5" />
            </g>
            <g className="ring ring-3">
              <circle cx="260" cy="200" r="60" />
              <circle className="ring-dot" cx="320" cy="200" r="5" />
            </g>
          </svg>
        </section>

        {/* Logo grid */}
        <ul className="clients-grid" aria-label="Our clients">
          {CLIENT_LOGOS.map((logo, i) => (
            <Reveal as="li" key={logo.file} className="clients-cell" delay={(i % 5) * 60}>
              <img src={logo.src} alt={logo.name} title={logo.name} loading="lazy" />
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  )
}
