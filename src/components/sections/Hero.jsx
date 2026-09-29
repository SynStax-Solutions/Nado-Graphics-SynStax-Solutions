import { useRef, useState } from 'react'
import Button from '../ui/Button'
import StickPusher from '../ui/StickPusher'
import './Hero.css'

export default function Hero({
  heading = 'Nado Graphics.',
  lead = 'Communicate. Collaborate. Create.',
}) {
  const sectionRef = useRef(null)
  const anchorRef = useRef(null)
  const [filled, setFilled] = useState(false)
  const [sceneDone, setSceneDone] = useState(false)

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      <div className="wrap hero-inner">
        <h1 className="two-tone hero-title">
          {heading}
          {/* Second line: starts grey, fills with yellow when the logo reaches "Create." */}
          <span className="hero-line">
            <span className={`hero-fill ${filled ? 'is-filled' : ''}`}>
              {lead}
              {/* Invisible marker: where the text ends and where its baseline is */}
              <span ref={anchorRef} className="hero-anchor" aria-hidden="true" />
            </span>
          </span>
        </h1>

        <div className="hero-ctas">
          <Button to="/portfolio" variant="primary" arrow>
            Explore our work
          </Button>
        </div>
      </div>

      {!sceneDone && (
        <StickPusher
          sectionRef={sectionRef}
          anchorRef={anchorRef}
          onArrive={() => setFilled(true)}
          onDone={() => setSceneDone(true)}
        />
      )}
    </section>
  )
}