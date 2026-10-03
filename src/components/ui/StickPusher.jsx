/* =============================================================================
   STICK PUSHER COMPONENT (StickPusher.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Creates the animated stick man and Nado logo sequence used over the hero
   section.

   What this component does:
   - Animates a stick man walking in from the right.
   - Drops the Nado logo in from the top right.
   - Animates the logo bouncing before settling in front of the man.
   - Shows a lightbulb moment above the man's head.
   - Animates the man pushing the logo towards the end of the headline.
   - Triggers the arrival callback when the logo reaches the headline.
   - Animates the man walking away after the scene is complete.
   - Recalculates positions based on the current page dimensions.
   - Respects the user's reduced-motion preference.

   Props:
   - sectionRef: Reference to the hero section covered by the animation.
   - anchorRef: Reference to the point after "Create." in the headline.
   - onArrive: Callback triggered when the logo reaches the headline.
   - onDone: Callback triggered when the animation is finished.
   - delay: Delay before the animation starts, in milliseconds.

   Note:
   The animation is drawn entirely using SVG elements and is positioned
   relative to the hero section. The logo measurements are based on Logo.svg.
   ============================================================================= */

import { useEffect, useRef } from 'react'
import Logo from '../../assets/Logo.svg'
import './StickPusher.css'

/*
  StickPusher animation sequence:
  1. A black stick man walks in from the right and stops in the middle.
  2. The Nado logo drops in from the top right and swings over his head.
  3. The logo lands in front of him with a couple of bounces.
  4. The man has a lightbulb moment.
  5. He pushes the logo to the end of the headline.
  6. The slogan lights up and the man walks away.

  Positioning is measured from the page so the animation can adapt to
  different screen sizes.

  References:
  - anchorRef marks the position after "Create." and its text baseline.
  - sectionRef identifies the hero section covered by the SVG.

  Callbacks:
  - onArrive: Called when the logo reaches "Create."
  - onDone: Called when the full animation has finished.
*/

// -----------------------------------------------------------------------------
// Logo measurements
// -----------------------------------------------------------------------------
// Measurements from Logo.svg. The circle is centred inside a wider file.
const FILE_W = 240.94
const FILE_H = 141.73
const CIRCLE = 138.84

// -----------------------------------------------------------------------------
// Animation helper functions
// -----------------------------------------------------------------------------
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = (t) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t, 0, 1))
const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3)
const easeOutQuad = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 2)

const easeOutBack = (t) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  const x = clamp(t, 0, 1) - 1

  return 1 + c3 * x * x * x + c1 * x * x
}

// Interpolate between two points.
const mixPoint = (p, q, t) => ({
  x: lerp(p.x, q.x, t),
  y: lerp(p.y, q.y, t),
})

// -----------------------------------------------------------------------------
// Lightbulb ray positions
// -----------------------------------------------------------------------------
// Angles are measured in degrees.
// 0 degrees points right and -90 degrees points straight up.
const RAYS = [-170, -135, -90, -45, -10].map((deg) => {
  const a = (deg * Math.PI) / 180

  return {
    deg,
    x1: Math.cos(a) * 14,
    y1: Math.sin(a) * 14,
    x2: Math.cos(a) * 21,
    y2: Math.sin(a) * 21,
  }
})

// -----------------------------------------------------------------------------
// Arm positioning
// -----------------------------------------------------------------------------
// Works out where the elbow should be so the hand can reach the target.
// "prefer" chooses which of the two possible elbow positions looks natural.
function solveArm(sh, hand, upper, fore, dir, prefer) {
  let dx = hand.x - sh.x
  let dy = hand.y - sh.y
  let d = Math.hypot(dx, dy) || 0.0001

  const reach = upper + fore - 0.001

  // Prevent the target from being further away than the arm can reach.
  if (d > reach) {
    dx = (dx / d) * reach
    dy = (dy / d) * reach
    d = reach
  }

  const base = Math.atan2(dy, dx)

  const bend = Math.acos(
    clamp(
      (upper * upper + d * d - fore * fore) / (2 * upper * d),
      -1,
      1
    )
  )

  const options = [base + bend, base - bend].map((a) => ({
    x: sh.x + upper * Math.cos(a),
    y: sh.y + upper * Math.sin(a),
  }))

  const score = (e) =>
    prefer.x * dir * (e.x - sh.x) + prefer.y * (e.y - sh.y)

  const elbow =
    score(options[0]) >= score(options[1]) ? options[0] : options[1]

  return {
    elbow,
    hand: {
      x: sh.x + dx,
      y: sh.y + dy,
    },
  }
}

// -----------------------------------------------------------------------------
// StickPusher component
// -----------------------------------------------------------------------------
export default function StickPusher({
  sectionRef,
  anchorRef,
  onArrive,
  onDone,
  delay = 150,
}) {
  // References to the SVG and each animated part.
  const svgRef = useRef(null)
  const ballRef = useRef(null)
  const bodyRef = useRef(null)
  const armNearRef = useRef(null)
  const armFarRef = useRef(null)
  const headRef = useRef(null)
  const bulbRef = useRef(null)
  const glowRef = useRef(null)
  const raysRef = useRef(null)

  useEffect(() => {
    let raf = 0
    let timer = 0
    let cancelled = false

    // -------------------------------------------------------------------------
    // Finish the animation
    // -------------------------------------------------------------------------
    const finish = () => {
      onArrive?.()
      onDone?.()
    }

    // Skip the animation when reduced motion is enabled.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }

    // -------------------------------------------------------------------------
    // Start the animation
    // -------------------------------------------------------------------------
    const start = () => {
      if (cancelled) return

      const section = sectionRef.current
      const anchor = anchorRef.current
      const svg = svgRef.current

      if (!section || !anchor || !svg) return finish()

      // -----------------------------------------------------------------------
      // Measure the page
      // -----------------------------------------------------------------------
      const sRect = section.getBoundingClientRect()
      const aRect = anchor.getBoundingClientRect()
      const W = sRect.width
      const Hs = sRect.height
      const textEnd = aRect.left - sRect.left
      const ground = aRect.top - sRect.top

      // Get the font size used by the headline.
      const fontSize =
        parseFloat(getComputedStyle(anchor.parentElement).fontSize) || 80

      // Use the headline size to determine the size of the logo and man.
      const D = fontSize * 1.1
      const H = D * 1.65
      const R = D / 2

      // Finish early if there is not enough space for the animation.
      if (W - textEnd < D * 3) return finish()

      svg.setAttribute('viewBox', `0 0 ${W} ${Hs}`)

      // -----------------------------------------------------------------------
      // Stick man proportions
      // -----------------------------------------------------------------------
      const LEG = 0.49 * H
      const TORSO = 0.31 * H
      const HEAD_R = 0.085 * H
      const UPPER = 0.175 * H
      const FORE = 0.175 * H
      const STRIDE = 0.5 * H
      const stroke = Math.max(3, 0.045 * H)

      ;[bodyRef, armNearRef, armFarRef, headRef].forEach((r) =>
        r.current.setAttribute('stroke-width', stroke)
      )

      headRef.current.setAttribute('r', HEAD_R)

      // -----------------------------------------------------------------------
      // Logo sizing
      // -----------------------------------------------------------------------
      // Size the logo so its circular section has a diameter of D.
      const img = ballRef.current.querySelector('image')
      const imgW = (D * FILE_W) / CIRCLE
      const imgH = (D * FILE_H) / CIRCLE

      img.setAttribute('width', imgW)
      img.setAttribute('height', imgH)
      img.setAttribute('x', -imgW / 2)
      img.setAttribute('y', -imgH / 2)

      // -----------------------------------------------------------------------
      // Logo contact points
      // -----------------------------------------------------------------------
      // Positions where the man's hands touch the logo.
      const nearContact = (bx, by) => ({
        x: bx + R * Math.cos(Math.PI / 4),
        y: by - R * Math.sin(Math.PI / 4),
      })

      const farContact = (bx, by) => ({
        x: bx + R * Math.cos(Math.PI / 6),
        y: by - R * Math.sin(Math.PI / 6),
      })

      const hipFromBall = (bx) => nearContact(bx, 0).x + 0.34 * H

      // -----------------------------------------------------------------------
      // Key animation positions
      // -----------------------------------------------------------------------
      const by = ground - R
      const finalBx = textEnd + 0.12 * D + R
      const midBx = (textEnd + W) / 2
      const hipStand = hipFromBall(midBx)

      const startHip = W + 0.6 * H
      const ballStartX = W + D
      const ballStartY = Math.max(-D, by - Hs * 0.6)

      // -----------------------------------------------------------------------
      // Animation timings
      // -----------------------------------------------------------------------
      const speed = clamp(W * 0.2, 180, 340)

      const T_WALK = ((startHip - hipStand) / (speed * 1.1)) * 1000 * 2.3
      const T_PAUSE = 300
      const T_FALL = 900
      const T_B1 = 380
      const T_B2 = 220
      const T_LOOK = 500
      const T_BULB = 1500
      const T_LEAN = 450
      const T_PUSH = ((midBx - finalBx) / speed) * 1000 * 1.2

      const tFallStart = T_WALK + T_PAUSE
      const tLand = tFallStart + T_FALL
      const tB1End = tLand + T_B1
      const tB2End = tB1End + T_B2
      const tBulbStart = tB2End + T_LOOK
      const tBulbEnd = tBulbStart + T_BULB
      const tArrive = tBulbEnd + T_PUSH
      const tLeave = tArrive + 1500

      let arrived = false
      let leaveStartHip = null
      let t0 = null

      // -----------------------------------------------------------------------
      // Draw the stick man
      // -----------------------------------------------------------------------
      const drawMan = (p) => {
        const { hipX, dir, lean, phase, amp, spread } = p

        // Calculate the leg angles.
        const th1 = p.legBase + amp * Math.sin(phase) + spread
        const th2 = p.legBase - amp * Math.sin(phase) - spread

        const hipY =
          ground - LEG * Math.max(Math.cos(th1), Math.cos(th2))

        const hip = {
          x: hipX,
          y: hipY,
        }

        // Calculate the foot positions.
        const foot = (th) => ({
          x: hipX + dir * LEG * Math.sin(th),
          y: hipY + LEG * Math.cos(th),
        })

        const f1 = foot(th1)
        const f2 = foot(th2)

        // Calculate the upper body direction.
        const up = {
          x: dir * Math.sin(lean),
          y: -Math.cos(lean),
        }

        const sh = {
          x: hip.x + up.x * TORSO,
          y: hip.y + up.y * TORSO,
        }

        const head = {
          x:
            hip.x +
            up.x * (TORSO + 0.04 * H + HEAD_R),
          y:
            hip.y +
            up.y * (TORSO + 0.04 * H + HEAD_R),
        }

        // Draw the legs and torso.
        bodyRef.current.setAttribute(
          'd',
          `M${f1.x},${f1.y} L${hip.x},${hip.y} L${f2.x},${f2.y} M${hip.x},${hip.y} L${sh.x},${sh.y}`
        )

        // Position the head.
        headRef.current.setAttribute('cx', head.x)
        headRef.current.setAttribute('cy', head.y)

        // Calculate and draw both arms.
        const arms = p.arms({
          hip,
          sh,
          head,
          dir,
        })

        ;[
          [armNearRef, arms.near],
          [armFarRef, arms.far],
        ].forEach(([ref, a]) => {
          const s = solveArm(
            sh,
            a.hand,
            UPPER,
            FORE,
            dir,
            a.prefer
          )

          ref.current.setAttribute(
            'd',
            `M${sh.x},${sh.y} L${s.elbow.x},${s.elbow.y} L${s.hand.x},${s.hand.y}`
          )
        })

        return { head }
      }

      // -----------------------------------------------------------------------
      // Hand positions for different poses
      // -----------------------------------------------------------------------
      const pushArms = (bx) => () => ({
        near: {
          hand: nearContact(bx, by),
          prefer: { x: 0, y: 1 },
        },
        far: {
          hand: farContact(bx, by),
          prefer: { x: 0, y: 1 },
        },
      })

      const hangHand = (sh, dir, swing) => ({
        x:
          sh.x +
          dir * (UPPER + FORE) * 0.95 * Math.sin(swing),
        y:
          sh.y +
          (UPPER + FORE) * 0.95 * Math.cos(swing),
      })

      const onHip = (hip, dir) => ({
        x: hip.x - dir * 0.03 * H,
        y: hip.y - 0.02 * H,
      })

      // Both arms hanging naturally by his sides.
      const hangArms = ({ sh, dir }) => ({
        near: {
          hand: hangHand(sh, dir, 0),
          prefer: { x: 0, y: 1 },
        },
        far: {
          hand: hangHand(sh, dir, 0),
          prefer: { x: 0, y: 1 },
        },
      })

      // Standing still and facing left towards the logo.
      const standPose = (lean, arms = hangArms) => ({
        hipX: hipStand,
        dir: -1,
        lean,
        phase: 0,
        amp: 0,
        spread: 0.08,
        legBase: 0,
        arms,
      })

      // -----------------------------------------------------------------------
      // Draw the logo
      // -----------------------------------------------------------------------
      const drawBall = (
        bx,
        scale = 1,
        opacity = 1,
        y = by
      ) => {
        const rot =
          ((bx - finalBx) / (Math.PI * D)) * 360

        ballRef.current.setAttribute(
          'transform',
          `translate(${bx},${y}) rotate(${rot}) scale(${scale})`
        )

        ballRef.current.setAttribute('opacity', opacity)
      }

      // -----------------------------------------------------------------------
      // Draw the lightbulb
      // -----------------------------------------------------------------------
      const drawBulb = (head, s) => {
        // s represents the time since the lightbulb moment began.
        let sc = 0

        if (s >= 0 && s < 350) {
          sc = easeOutBack(s / 350)
        } else if (s >= 350 && s < 1150) {
          sc = 1
        } else if (s >= 1150) {
          sc = 1 - easeInOut((s - 1150) / 300)
        }

        // Hide the bulb when it is too small to be visible.
        if (sc <= 0.001) {
          bulbRef.current.setAttribute('opacity', 0)
          return
        }

        const k = H / 100
        const x = head.x
        const y = head.y - HEAD_R - 0.17 * H

        bulbRef.current.setAttribute(
          'transform',
          `translate(${x},${y}) scale(${k * sc})`
        )

        bulbRef.current.setAttribute('opacity', 1)

        // Flicker the glow slightly and reveal the rays after the bulb appears.
        glowRef.current.setAttribute(
          'opacity',
          0.3 + 0.22 * Math.sin(s / 90)
        )

        raysRef.current.setAttribute(
          'opacity',
          clamp((s - 150) / 200, 0, 1)
        )
      }

      // -----------------------------------------------------------------------
      // Pushing pose
      // -----------------------------------------------------------------------
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

      // -----------------------------------------------------------------------
      // Main animation loop
      // -----------------------------------------------------------------------
      const tick = (now) => {
        // Stop if the page changed or the animation has been removed.
        if (
          cancelled ||
          !bodyRef.current ||
          !ballRef.current
        ) {
          return
        }

        if (t0 === null) t0 = now

        const t = now - t0

        // The lightbulb is only visible during its own animation phase.
        bulbRef.current.setAttribute('opacity', 0)

        // ---------------------------------------------------------------------
        // 1. Walk into the scene
        // ---------------------------------------------------------------------
        if (t < T_WALK) {
          ballRef.current.setAttribute('opacity', 0)

          const u = t / T_WALK
          const hipX = lerp(
            startHip,
            hipStand,
            easeOutQuad(u)
          )

          const walked = startHip - hipX
          const f = clamp((1 - u) * 5, 0, 1)
          const phase = (walked / STRIDE) * Math.PI

          drawMan({
            hipX,
            dir: -1,
            lean: lerp(0.04, 0.08, f),
            phase,
            amp: 0.36 * f,
            spread: 0.08 * (1 - f),
            legBase: 0,
            arms: ({ sh, dir }) => ({
              near: {
                hand: hangHand(
                  sh,
                  dir,
                  0.45 * f * Math.sin(phase)
                ),
                prefer: { x: 0, y: 1 },
              },
              far: {
                hand: hangHand(
                  sh,
                  dir,
                  -0.45 * f * Math.sin(phase)
                ),
                prefer: { x: 0, y: 1 },
              },
            }),
          })
        }

        // ---------------------------------------------------------------------
        // 1b. Pause after arriving
        // ---------------------------------------------------------------------
        else if (t < tFallStart) {
          ballRef.current.setAttribute('opacity', 0)
          drawMan(standPose(0.04))
        }

        // ---------------------------------------------------------------------
        // 2a. Logo drops in from the top right
        // ---------------------------------------------------------------------
        else if (t < tLand) {
          const u = (t - tFallStart) / T_FALL

          const bx = lerp(
            ballStartX,
            midBx,
            easeOut(u)
          )

          const y = lerp(
            ballStartY,
            by,
            u * u
          )

          drawBall(bx, 1, 1, y)

          // Make the man react as the logo passes overhead.
          const react = Math.sin(
            Math.PI * clamp((u - 0.1) / 0.8, 0, 1)
          )

          drawMan(
            standPose(0.04 - 0.12 * react)
          )
        }

        // ---------------------------------------------------------------------
        // 2b. Logo bounces twice and settles
        // ---------------------------------------------------------------------
        else if (t < tBulbStart) {
          let y = by

          if (t < tB1End) {
            const v = (t - tLand) / T_B1
            y = by - 0.45 * D * 4 * v * (1 - v)
          } else if (t < tB2End) {
            const v = (t - tB1End) / T_B2
            y = by - 0.12 * D * 4 * v * (1 - v)
          }

          drawBall(midBx, 1, 1, y)

          // The man leans towards the logo as he looks at it.
          drawMan(
            standPose(
              lerp(
                0.04,
                0.14,
                easeInOut((t - tLand) / 450)
              )
            )
          )
        }

        // ---------------------------------------------------------------------
        // 3. Lightbulb moment
        // ---------------------------------------------------------------------
        else if (t < tBulbEnd) {
          const s = t - tBulbStart

          drawBall(midBx)

          // Animate the man's raised arm.
          const kArm =
            s < 350
              ? easeOut(s / 350)
              : s < 1100
                ? 1
                : 1 - easeInOut((s - 1100) / 350)

          const { head } = drawMan(
            standPose(
              lerp(
                0.14,
                0.02,
                easeInOut(s / 300)
              ),
              ({ sh, head, dir }) => {
                const raised = {
                  x: head.x - dir * 0.1 * H,
                  y: head.y - 0.19 * H,
                }

                return {
                  near: {
                    hand: mixPoint(
                      hangHand(sh, dir, 0),
                      raised,
                      kArm
                    ),
                    prefer: { x: -0.5, y: 1 },
                  },
                  far: {
                    hand: hangHand(sh, dir, 0),
                    prefer: { x: 0, y: 1 },
                  },
                }
              }
            )
          )

          drawBulb(head, s)
        }

        // ---------------------------------------------------------------------
        // 4. Lean forward and push the logo
        // ---------------------------------------------------------------------
        else if (t < tArrive) {
          const s = t - tBulbEnd

          const k = easeInOut(s / T_LEAN)

          const bx = lerp(
            midBx,
            finalBx,
            easeInOut(s / T_PUSH)
          )

          drawBall(bx)

          const push = pushPose(
            bx,
            midBx - bx
          )

          drawMan({
            ...push,
            lean: lerp(0.02, 0.42, k),
            amp: lerp(0, 0.34, k),
            spread: lerp(0.08, 0, k),
            legBase: lerp(0, -0.12, k),
            arms: ({ sh, dir }) => {
              const p = push.arms()

              return {
                near: {
                  hand: mixPoint(
                    hangHand(sh, dir, 0),
                    p.near.hand,
                    k
                  ),
                  prefer: { x: 0, y: 1 },
                },
                far: {
                  hand: mixPoint(
                    hangHand(sh, dir, 0),
                    p.far.hand,
                    k
                  ),
                  prefer: { x: 0, y: 1 },
                },
              }
            },
          })
        }

        // ---------------------------------------------------------------------
        // 5. Logo arrives and the man returns to a standing pose
        // ---------------------------------------------------------------------
        else if (t < tLeave) {
          if (!arrived) {
            arrived = true
            onArrive?.()
          }

          const s = t - tArrive
          const g = easeOut(s / 450)

          // Shrink and fade out the logo.
          drawBall(
            finalBx - g * 0.1 * D,
            1 - g,
            1 - g
          )

          const k = easeInOut(s / 500)
          const push = pushPose(
            finalBx,
            midBx - finalBx
          )

          drawMan({
            ...push,
            lean: lerp(0.42, 0.03, k),
            amp: lerp(0.34, 0, k),
            spread: lerp(0, 0.08, k),
            legBase: lerp(-0.12, 0, k),
            arms: ({ hip, dir }) => {
              const p = push.arms()

              return {
                near: {
                  hand: mixPoint(
                    p.near.hand,
                    onHip(hip, dir),
                    k
                  ),
                  prefer: {
                    x: k > 0.5 ? -1 : 0,
                    y: 0.4,
                  },
                },
                far: {
                  hand: mixPoint(
                    p.far.hand,
                    onHip(hip, dir),
                    k
                  ),
                  prefer: {
                    x: k > 0.5 ? -1 : 0,
                    y: 0.4,
                  },
                },
              }
            },
          })
        }

        // ---------------------------------------------------------------------
        // 6. Walk off to the right
        // ---------------------------------------------------------------------
        else {
          const s = t - tLeave

          if (leaveStartHip === null) {
            leaveStartHip = hipFromBall(finalBx)
          }

          const walkSpeed = speed * 1.5
          const ramp = Math.min(s, 400)

          const dist =
            (walkSpeed / 1000) *
            (s - ramp / 2) *
            (s < 400 ? s / 400 : 1)

          const hipX =
            leaveStartHip + Math.max(0, dist)

          const phase =
            (Math.max(0, dist) / STRIDE) * Math.PI

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
              near: {
                hand: hangHand(
                  sh,
                  dir,
                  0.45 * a * Math.sin(phase)
                ),
                prefer: { x: 0, y: 1 },
              },
              far: {
                hand: hangHand(
                  sh,
                  dir,
                  -0.45 * a * Math.sin(phase)
                ),
                prefer: { x: 0, y: 1 },
              },
            }),
          })

          // Remove the animation once the man has completely left the screen.
          if (hipX - H > W) {
            onDone?.()
            return
          }
        }

        // Continue the animation loop.
        raf = requestAnimationFrame(tick)
      }

      raf = requestAnimationFrame(tick)
    }

    // -------------------------------------------------------------------------
    // Wait for the page font before measuring "Create."
    // -------------------------------------------------------------------------
    const fontsReady =
      document.fonts?.ready ?? Promise.resolve()

    fontsReady.then(() => {
      if (!cancelled) {
        timer = window.setTimeout(start, delay)
      }
    })

    // -------------------------------------------------------------------------
    // Clean up the animation
    // -------------------------------------------------------------------------
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }

    // Props are intentionally captured when the animation is created.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg
      ref={svgRef}
      className="stick-pusher"
      aria-hidden="true"
      focusable="false"
    >
      {/* ---------------------------------------------------------------------
          Nado logo
          --------------------------------------------------------------------- */}
      <g ref={ballRef} opacity="0">
        <image href={Logo} />
      </g>

      {/* ---------------------------------------------------------------------
          Stick man
          --------------------------------------------------------------------- */}
      <g
        className="stick-man"
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path ref={armFarRef} />
        <path ref={bodyRef} />
        <path ref={armNearRef} />
        <circle ref={headRef} fill="#fff" />
      </g>

      {/* ---------------------------------------------------------------------
          Lightbulb
          Drawn in a 100-unit space and scaled to match the man's height.
          --------------------------------------------------------------------- */}
      <g
        ref={bulbRef}
        className="stick-bulb"
        opacity="0"
      >
        <circle
          ref={glowRef}
          className="stick-bulb-glow"
          r="26"
        />

        <g
          ref={raysRef}
          className="stick-bulb-rays"
        >
          {RAYS.map((r) => (
            <line
              key={r.deg}
              x1={r.x1}
              y1={r.y1}
              x2={r.x2}
              y2={r.y2}
            />
          ))}
        </g>

        <circle
          className="stick-bulb-glass"
          r="9"
        />

        <rect
          className="stick-bulb-base"
          x="-4"
          y="8"
          width="8"
          height="5"
          rx="1.5"
        />
      </g>
    </svg>
  )
}

/* ---------------------------------- END OF FILE ---------------------------------- */