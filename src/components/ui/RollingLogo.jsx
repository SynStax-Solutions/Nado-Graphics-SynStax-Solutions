import { useLayoutEffect, useRef } from 'react'
import Logo from '../../assets/Logo.svg'
import './RollingLogo.css'


const FILE_W = 240.94
const FILE_H = 141.73
const CIRCLE = 138.84
const CIRCLE_LEFT = 51.05

export default function RollingLogo({ delay = 300, duration = 1400, onLanded, className = '' }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      onLanded?.()
      return
    }

    const rect = el.getBoundingClientRect()
    const scale = rect.height / FILE_H
    const diameter = CIRCLE * scale
    const circleLeft = rect.left + CIRCLE_LEFT * scale

    // Start with the whole circle just off the left edge of the screen
    const distance = circleLeft + diameter * 1.1
    const overshoot = diameter * 0.08

    // Rolling without slipping: one full turn per circumference travelled
    const spinFor = (px) => (px / (Math.PI * diameter)) * 360

    const animation = el.animate(
      [
        { transform: `translateX(${-distance}px) rotate(${-spinFor(distance)}deg)` },
        { transform: `translateX(${overshoot}px) rotate(${spinFor(overshoot)}deg)`, offset: 0.82 },
        { transform: `translateX(${-overshoot * 0.3}px) rotate(${-spinFor(overshoot * 0.3)}deg)`, offset: 0.92 },
        { transform: 'translateX(0) rotate(0deg)' },
      ],
      {
        duration,
        delay,
        easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        fill: 'backwards', // holds the off-screen start position during the delay
      }
    )

    animation.onfinish = () => onLanded?.()
    return () => animation.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, duration])

  return (
    <img
      ref={ref}
      src={Logo}
      alt=""
      className={`rolling-logo ${className}`.trim()}
      style={{ aspectRatio: `${FILE_W} / ${FILE_H}` }}
    />
  )
}