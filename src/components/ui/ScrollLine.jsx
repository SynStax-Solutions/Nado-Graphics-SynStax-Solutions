import { useEffect, useRef } from 'react'
import './ScrollLine.css'

/*
  A kite on a curving string, drawn as you scroll.
  The string sweeps from the centre (under the button above) down to the
  left, where the next section starts. The kite rides the tip of the string
  and turns to face the way it is flying.
*/
export default function ScrollLine({ className = '' }) {
  const boxRef = useRef(null)
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const kiteRef = useRef(null)

  useEffect(() => {
    const box = boxRef.current
    const svg = svgRef.current
    const path = pathRef.current
    const kite = kiteRef.current
    if (!box || !svg || !path || !kite) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let length = 0
    let raf = 0

    // Build the curve to fit the current width
    const layout = () => {
      const W = box.clientWidth
      const H = box.clientHeight
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      const cx = W / 2
      const endX = 40
      path.setAttribute(
        'd',
        [
          `M ${cx} 0`,
          `C ${cx + W * 0.02} ${H * 0.35}, ${cx + W * 0.16} ${H * 0.55}, ${cx + W * 0.06} ${H * 0.7}`,
          `C ${cx - W * 0.02} ${H * 0.82}, ${cx - W * 0.12} ${H * 0.62}, ${cx - W * 0.2} ${H * 0.6}`,
          `S ${endX + 60} ${H * 0.98}, ${endX} ${H}`,
        ].join(' ')
      )
      length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
      draw()
    }

    const draw = () => {
      raf = 0
      let p = 1
      if (!reduceMotion) {
        const rect = box.getBoundingClientRect()
        const viewH = window.innerHeight
        const start = viewH * 0.9
        const end = viewH * 0.45
        p = Math.max(0, Math.min(1, (start - rect.top) / (rect.height + (start - end))))
      }

      path.style.strokeDashoffset = `${length * (1 - p)}`

      // Put the kite on the tip of the string, facing along it
      const at = Math.max(1, length * p)
      const tip = path.getPointAtLength(at)
      const back = path.getPointAtLength(Math.max(0, at - 2))
      const angle = (Math.atan2(tip.y - back.y, tip.x - back.x) * 180) / Math.PI
      kite.style.transform = `translate(${tip.x}px, ${tip.y}px) rotate(${angle}deg)`
      kite.style.opacity = p > 0.03 ? 1 : 0
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    layout()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', layout)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', layout)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className={`wrap ${className}`.trim()} aria-hidden="true">
      <div ref={boxRef} className="kite-line">
        <svg ref={svgRef} className="kite-line-svg">
          <path ref={pathRef} className="kite-line-string" />
        </svg>

        {/* The kite: points along the string, with a gentle sway */}
        <div ref={kiteRef} className="kite-line-kite">
          <svg className="kite-line-sway" viewBox="-30 -22 60 44" width="96" height="70">
            {/* diamond in two yellows, nose pointing right */}
            <path d="M 26 0 L 0 -16 L -8 0 Z" fill="#fabe3d" />
            <path d="M 26 0 L -8 0 L 0 16 Z" fill="#e3a52a" />
            {/* spars */}
            <path d="M 26 0 L -8 0 M 0 -16 L 0 16" stroke="#000" strokeWidth="1.2" fill="none" />
            {/* little tail bows */}
            <path d="M -8 0 C -14 4, -18 -4, -26 1" stroke="#000" strokeWidth="1" fill="none" />
            <path d="M -15 1 l -3 -3 l 0 6 Z M -22 -1 l -3 -3 l 0 6 Z" fill="#000" />
          </svg>
        </div>
      </div>
    </div>
  )
}