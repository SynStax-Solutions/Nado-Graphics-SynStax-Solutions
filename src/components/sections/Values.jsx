import { useEffect, useRef } from 'react'
import Reveal from '../ui/Reveal'
import './Values.css'

const VALUES = [
  {
    num: '01',
    title: 'Communicate',
    desc: 'Every project starts with a conversation. We listen, ask questions and get to the heart of what you are trying to achieve.',
    tone: 'ink',
  },
  {
    num: '02',
    title: 'Collaborate',
    desc: 'We work alongside you throughout the process, sharing ideas, refining directions and making decisions together.',
    tone: 'yellow',
  },
  {
    num: '03',
    title: 'Create',
    desc: 'Once the direction is right, we bring it to life through thoughtful design and quality print.',
    tone: 'soft',
  },
]

export default function Values() {
  const listRef = useRef(null)

  // As each new card slides over, the card underneath shrinks back slightly
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = Array.from(list.querySelectorAll('.step-card'))
    let raf = 0

    const update = () => {
      raf = 0
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        const cardTop = card.getBoundingClientRect().top
        const nextTop = next.getBoundingClientRect().top
        const h = card.offsetHeight
        // 0 while the next card is a full card-height away, 1 once it has fully covered this one
        const covered = Math.max(0, Math.min(1, 1 - (nextTop - cardTop) / h))
        card.style.transform = `scale(${1 - covered * 0.04})`
        card.style.opacity = `${1 - covered * 0.35}`
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
    <section className="nd-values" id="values">
      <div className="wrap">
        <Reveal className="nd-eyebrow">The process</Reveal>

        <Reveal as="h2" className="nd-heading nd-values-title" delay={80}>
          How we work.
        </Reveal>

        {/* Cards stick near the top and stack on each other as you scroll */}
        <ol ref={listRef} className="step-stack">
          {VALUES.map((v, i) => (
            <li
              key={v.num}
              className={`step-card tone-${v.tone}`}
              style={{ '--i': i }}
            >
              <span className="step-num">{v.num}</span>
              <h3 className="step-title">{v.title}</h3>
              <p className="step-desc">{v.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}