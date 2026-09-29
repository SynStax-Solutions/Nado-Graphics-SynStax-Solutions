import { useEffect, useRef } from 'react'
import Logo from '../../assets/Logo.svg'
import './StickPusher.css'

/*
  StickPusher
  A black stick man pushes the Nado logo in from the right, stops halfway
  to wipe his forehead, pushes it the rest of the way to the end of the
  headline, then walks off.

  It draws on an SVG layer laid over the hero section. Everything is
  measured from the page, so it works at any screen size:
  - anchorRef marks the spot right after "Create." (its x) and the text baseline (its y)
  - sectionRef is the hero section the SVG covers

  Callbacks
  - onArrive: the logo has reached "Create." (start the yellow fill)
  - onDone:   the scene is over and the SVG can be removed
*/

// Measurements from Logo.svg: the circle is centred in a wider file
const FILE_W = 240.94
const FILE_H = 141.73
const CIRCLE = 138.84

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = (t) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t, 0, 1))
const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3)
const easeOutQuad = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 2)
const mixPoint = (p, q, t) => ({ x: lerp(p.x, q.x, t), y: lerp(p.y, q.y, t) })

// Two-segment arm: works out where the elbow goes so the hand reaches the target.
// `prefer` picks which of the two possible elbows looks natural.
function solveArm(sh, hand, upper, fore, dir, prefer) {
  let dx = hand.x - sh.x
  let dy = hand.y - sh.y
  let d = Math.hypot(dx, dy) || 0.0001
  const reach = upper + fore - 0.001
  if (d > reach) {
    dx = (dx / d) * reach
    dy = (dy / d) * reach
    d = reach
  }
  const base = Math.atan2(dy, dx)
  const bend = Math.acos(clamp((upper * upper + d * d - fore * fore) / (2 * upper * d), -1, 1))
  const options = [base + bend, base - bend].map((a) => ({
    x: sh.x + upper * Math.cos(a),
    y: sh.y + upper * Math.sin(a),
  }))
  const score = (e) => prefer.x * dir * (e.x - sh.x) + prefer.y * (e.y - sh.y)
  const elbow = score(options[0]) >= score(options[1]) ? options[0] : options[1]
  return { elbow, hand: { x: sh.x + dx, y: sh.y + dy } }
}

export default function StickPusher({ sectionRef, anchorRef, onArrive, onDone, delay = 150 }) {
  const svgRef = useRef(null)
  const ballRef = useRef(null)
  const bodyRef = useRef(null)
  const armNearRef = useRef(null)
  const armFarRef = useRef(null)
  const headRef = useRef(null)
  const drop1Ref = useRef(null)
  const drop2Ref = useRef(null)

  useEffect(() => {
    let raf = 0
    let timer = 0
    let cancelled = false

    const finish = () => {
      onArrive?.()
      onDone?.()
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }

    const start = () => {
      if (cancelled) return
      const section = sectionRef.current
      const anchor = anchorRef.current
      const svg = svgRef.current
      if (!section || !anchor || !svg) return finish()

      // ---------- measure the page ----------
      const sRect = section.getBoundingClientRect()
      const aRect = anchor.getBoundingClientRect()
      const W = sRect.width
      const Hs = sRect.height
      const textEnd = aRect.left - sRect.left
      const ground = aRect.top - sRect.top // text baseline
      const fontSize = parseFloat(getComputedStyle(anchor.parentElement).fontSize) || 80

      const D = fontSize * 1.1 // logo diameter (bigger number = bigger logo and man)
      const H = D * 1.65 // stick man height
      const R = D / 2

      if (W - textEnd < D * 3) return finish()

      svg.setAttribute('viewBox', `0 0 ${W} ${Hs}`)

      // Figure proportions
      const LEG = 0.49 * H
      const TORSO = 0.31 * H
      const HEAD_R = 0.085 * H
      const UPPER = 0.175 * H
      const FORE = 0.175 * H
      const STRIDE = 0.5 * H
      const stroke = Math.max(3, 0.045 * H)
      ;[bodyRef, armNearRef, armFarRef, headRef].forEach((r) => r.current.setAttribute('stroke-width', stroke))
      headRef.current.setAttribute('r', HEAD_R)
      ;[drop1Ref, drop2Ref].forEach((r) => r.current.setAttribute('r', Math.max(2, 0.022 * H)))

      // Logo image (sized so the circle part is D across)
      const img = ballRef.current.querySelector('image')
      const imgW = (D * FILE_W) / CIRCLE
      const imgH = (D * FILE_H) / CIRCLE
      img.setAttribute('width', imgW)
      img.setAttribute('height', imgH)
      img.setAttribute('x', -imgW / 2)
      img.setAttribute('y', -imgH / 2)

      // Where the hands touch the logo (upper right of the circle)
      const nearContact = (bx, by) => ({ x: bx + R * Math.cos(Math.PI / 4), y: by - R * Math.sin(Math.PI / 4) })
      const farContact = (bx, by) => ({ x: bx + R * Math.cos(Math.PI / 6), y: by - R * Math.sin(Math.PI / 6) })
      const hipFromBall = (bx) => nearContact(bx, 0).x + 0.34 * H

      // Key positions (logo centre x)
      const by = ground - R
      const finalBx = textEnd + 0.12 * D + R
      const midBx = (textEnd + W) / 2
      const startBx = W + 1.35 * D // just off-screen, so he appears straight away

      // Timing
      const speed = clamp(W * 0.2, 180, 340) // px per second
      const T1 = ((startBx - midBx) / speed) * 1000 * 1.4
      const TB = 2700 // the break
      const T2 = ((midBx - finalBx) / speed) * 1000 * 1.2
      const tBreak = T1
      const tPush2 = T1 + TB
      const tArrive = tPush2 + T2
      const tLeave = tArrive + 1500

      let arrived = false
      let leaveStartHip = null
      let t0 = null

      const drawMan = (p) => {
        const { hipX, dir, lean, phase, amp, spread } = p
        // legs (angles from vertical, positive = foot forward)
        const th1 = p.legBase + amp * Math.sin(phase) + spread
        const th2 = p.legBase - amp * Math.sin(phase) - spread
        const hipY = ground - LEG * Math.max(Math.cos(th1), Math.cos(th2))
        const hip = { x: hipX, y: hipY }
        const foot = (th) => ({ x: hipX + dir * LEG * Math.sin(th), y: hipY + LEG * Math.cos(th) })
        const f1 = foot(th1)
        const f2 = foot(th2)
        const up = { x: dir * Math.sin(lean), y: -Math.cos(lean) }
        const sh = { x: hip.x + up.x * TORSO, y: hip.y + up.y * TORSO }
        const head = { x: hip.x + up.x * (TORSO + 0.04 * H + HEAD_R), y: hip.y + up.y * (TORSO + 0.04 * H + HEAD_R) }

        bodyRef.current.setAttribute(
          'd',
          `M${f1.x},${f1.y} L${hip.x},${hip.y} L${f2.x},${f2.y} M${hip.x},${hip.y} L${sh.x},${sh.y}`
        )
        headRef.current.setAttribute('cx', head.x)
        headRef.current.setAttribute('cy', head.y)

        const arms = p.arms({ hip, sh, head, dir })
        ;[
          [armNearRef, arms.near],
          [armFarRef, arms.far],
        ].forEach(([ref, a]) => {
          const s = solveArm(sh, a.hand, UPPER, FORE, dir, a.prefer)
          ref.current.setAttribute('d', `M${sh.x},${sh.y} L${s.elbow.x},${s.elbow.y} L${s.hand.x},${s.hand.y}`)
        })
        return { head }
      }

      // Hand positions for each pose
      const pushArms = (bx) => () => ({
        near: { hand: nearContact(bx, by), prefer: { x: 0, y: 1 } },
        far: { hand: farContact(bx, by), prefer: { x: 0, y: 1 } },
      })
      const hangHand = (sh, dir, swing) => ({
        x: sh.x + dir * (UPPER + FORE) * 0.95 * Math.sin(swing),
        y: sh.y + (UPPER + FORE) * 0.95 * Math.cos(swing),
      })
      const onHip = (hip, dir) => ({ x: hip.x - dir * 0.03 * H, y: hip.y - 0.02 * H })

      const drawBall = (bx, scale = 1, opacity = 1) => {
        const rot = ((bx - finalBx) / (Math.PI * D)) * 360
        ballRef.current.setAttribute('transform', `translate(${bx},${by}) rotate(${rot}) scale(${scale})`)
        ballRef.current.setAttribute('opacity', opacity)
      }

      const drawDrop = (ref, head, dir, s, t0d) => {
        const k = (s - t0d) / 700
        if (k < 0 || k > 1) {
          ref.current.setAttribute('opacity', 0)
          return
        }
        ref.current.setAttribute('opacity', 1 - k)
        ref.current.setAttribute('cx', head.x - dir * (HEAD_R * 1.1 + k * 0.12 * H))
        ref.current.setAttribute('cy', head.y - HEAD_R * 0.3 + k * k * 0.35 * H)
      }

      const pushPose = (bx, walked) => ({
        hipX: hipFromBall(bx),
        dir: -1,
        lean: 0.42,
        phase: (walked / STRIDE) * Math.PI,
        amp: 0.34,
        spread: 0,
        legBase: -0.12,
        arms: pushArms(bx),
      })

           const tick = (now) => {
        // Stop if the page changed and the drawing has already been removed
        if (cancelled || !bodyRef.current || !ballRef.current) return
        if (t0 === null) t0 = now
        const t = now - t0

        if (t < tBreak) {
          // ---------- first push ----------
          // Enters already moving, then slows to a stop for the break
          const bx = lerp(startBx, midBx, easeOutQuad(t / T1))
          drawBall(bx)
          drawMan(pushPose(bx, startBx - bx))
          drop1Ref.current.setAttribute('opacity', 0)
          drop2Ref.current.setAttribute('opacity', 0)
        } else if (t < tPush2) {
          // ---------- the break: stand up, wipe forehead, lean back in ----------
          const s = t - tBreak
          const k = s < 2200 ? easeInOut(s / 450) : 1 - easeInOut((s - 2200) / 500)
          const walked = startBx - midBx
          const wipe = s > 450 && s < 2200 ? Math.sin(((s - 450) / 1750) * Math.PI * 4) : 0
          drawBall(midBx)
          const push = pushPose(midBx, walked)
          const { head } = drawMan({
            ...push,
            lean: lerp(0.42, 0.04, k),
            amp: lerp(0.34, 0, k),
            spread: lerp(0, 0.08, k),
            legBase: lerp(-0.12, 0, k),
            arms: ({ hip, sh, head, dir }) => {
              const p = push.arms()
              const forehead = {
                x: head.x + dir * (HEAD_R * 0.55 + HEAD_R * 0.75 * wipe),
                y: head.y - HEAD_R * 0.35,
              }
              return {
                near: { hand: mixPoint(p.near.hand, forehead, k), prefer: { x: 1, y: 1 } },
                far: { hand: mixPoint(p.far.hand, onHip(hip, dir), k), prefer: { x: k > 0.5 ? -1 : 0, y: 0.4 } },
              }
            },
          })
          drawDrop(drop1Ref, head, -1, s, 700)
          drawDrop(drop2Ref, head, -1, s, 1500)
        } else if (t < tArrive) {
          // ---------- second push ----------
          const bx = lerp(midBx, finalBx, easeInOut((t - tPush2) / T2))
          drawBall(bx)
          drawMan(pushPose(bx, startBx - bx))
        } else if (t < tLeave) {
          // ---------- arrive: logo disappears, text fills, hands on hips ----------
          if (!arrived) {
            arrived = true
            onArrive?.()
          }
          const s = t - tArrive
          const g = easeOut(s / 450)
          drawBall(finalBx - g * 0.1 * D, 1 - g, 1 - g)
          const k = easeInOut(s / 500)
          const push = pushPose(finalBx, startBx - finalBx)
          drawMan({
            ...push,
            lean: lerp(0.42, 0.03, k),
            amp: lerp(0.34, 0, k),
            spread: lerp(0, 0.08, k),
            legBase: lerp(-0.12, 0, k),
            arms: ({ hip, dir }) => {
              const p = push.arms()
              return {
                near: { hand: mixPoint(p.near.hand, onHip(hip, dir), k), prefer: { x: k > 0.5 ? -1 : 0, y: 0.4 } },
                far: { hand: mixPoint(p.far.hand, onHip(hip, dir), k), prefer: { x: k > 0.5 ? -1 : 0, y: 0.4 } },
              }
            },
          })
        } else {
          // ---------- walk off to the right ----------
          const s = t - tLeave
          if (leaveStartHip === null) leaveStartHip = hipFromBall(finalBx)
          const walkSpeed = speed * 1.5
          const ramp = Math.min(s, 400)
          const dist = (walkSpeed / 1000) * (s - ramp / 2) * (s < 400 ? s / 400 : 1)
          const hipX = leaveStartHip + Math.max(0, dist)
          const phase = (Math.max(0, dist) / STRIDE) * Math.PI
          const a = Math.min(1, s / 300)
          drawMan({
            hipX,
            dir: 1,
            lean: 0.08,
            phase,
            amp: 0.36 * a,
            spread: 0.08 * (1 - a),
            legBase: 0,
            arms: ({ sh, dir }) => ({
              near: { hand: hangHand(sh, dir, 0.45 * a * Math.sin(phase)), prefer: { x: 0, y: 1 } },
              far: { hand: hangHand(sh, dir, -0.45 * a * Math.sin(phase)), prefer: { x: 0, y: 1 } },
            }),
          })
          if (hipX - H > W) {
            onDone?.()
            return
          }
        }
        raf = requestAnimationFrame(tick)
      }

      raf = requestAnimationFrame(tick)
    }

    // Wait for the font so "Create." is measured in the right place
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    fontsReady.then(() => {
      if (!cancelled) timer = window.setTimeout(start, delay)
    })

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={svgRef} className="stick-pusher" aria-hidden="true" focusable="false">
      <g ref={ballRef} opacity="0">
        <image href={Logo} />
      </g>
      <g className="stick-man" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round">
        <path ref={armFarRef} />
        <path ref={bodyRef} />
        <path ref={armNearRef} />
        <circle ref={headRef} fill="#fff" />
      </g>
      <circle ref={drop1Ref} className="stick-drop" opacity="0" />
      <circle ref={drop2Ref} className="stick-drop" opacity="0" />
    </svg>
  )
}