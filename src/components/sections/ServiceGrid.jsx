import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Reveal from '../ui/Reveal'
import { SERVICES } from '../../data/services'
import { workLink } from '../../data/projects'
import './ServiceGrid.css'

// Grid of services: round icon, title, description, what's included, link to examples
export default function ServiceGrid({ services = SERVICES }) {
  return (
    <section className="service-grid-section">
      <div className="wrap">
        <ul className="service-grid">
          {services.map((service, i) => (
            <Reveal as="li" key={service.title} className="service-card" delay={(i % 3) * 90}>
              <span className={`service-icon-circle ${i % 2 ? 'is-dark' : ''}`} aria-hidden="true">
                <FontAwesomeIcon icon={service.icon} />
              </span>

              <h2 className="service-card-title">{service.title}</h2>
              <p className="service-card-desc">{service.description}</p>

              {service.items?.length > 0 && (
                <p className="service-card-items">{service.items.join(' · ')}</p>
              )}

              {service.work && (
                <Link to={workLink(...service.work)} className="service-card-link">
                  See examples <span aria-hidden="true">&#8599;</span>
                </Link>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}