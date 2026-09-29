import { useEffect, useRef } from 'react'
import Reveal from '../ui/Reveal'
import './Story.css'

// The story, as one statement. Each word lights up as you scroll past.
const STORY =
  'Nado Graphics began in the early 2000s with a young designer and a passion for turning ideas into something people could see and remember. Years of hands-on work and mentorship later, every project is still a chance to push the craft a little further.'

const STATS = [
  { value: '20+', text: 'Years of experience turning ideas into visual identities.' },
  { value: '40+', text: 'Brands brought to life across print, digital and motion.' },
  { value: '1', text: 'Passion for design that has never stopped evolving.' },
]

export default function Story() {
  const textRef = useRef(null)
  const words = STORY.split(' ')

  useEffect(() => {
    const block = textRef.current
    if (!block) return
    const spans = Array.from(block.querySelectorAll('.story-word'))

    // No animation for people who turned it off: show every word lit
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.forEach((s) => (s.style.opacity = 1))
      return
    }

    let raf = 0
    const update = () => {
      raf = 0
      const rect = block.getBoundingClientRect()
      const viewH = window.innerHeight
      // Starts when the text reaches 80% down the screen, done when its bottom reaches the middle
      const start = viewH * 0.8
      const end = viewH * 0.5
      const progress = (start - rect.top) / (rect.height + (start - end))
      const lit = Math.max(0, Math.min(1, progress)) * spans.length

      spans.forEach((span, i) => {
        // Each word fades from faint to full as the "lit" point passes it
        const amount = Math.max(0, Math.min(1, lit - i))
        span.style.opacity = 0.15 + amount * 0.85
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="nd-story" id="philosophy">
      <div className="wrap">
        <Reveal as="p" className="nd-eyebrow">Our philosophy</Reveal>

        <p ref={textRef} className="story-lit">
          {words.map((word, i) => (
            <span key={i} className="story-word">
              {word}{' '}
            </span>
          ))}
        </p>

        <div className="nd-figures nd-story-stats">
          {STATS.map((stat, i) => (
            <Reveal className="nd-figure" key={stat.value + stat.text} delay={120 + i * 80}>
              <span className="nd-figure-value">{stat.value}</span>
              <p>{stat.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}