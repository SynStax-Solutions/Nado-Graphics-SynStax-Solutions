/* =============================================================================
   USE REVEAL HOOK (useReveal.js)
   -----------------------------------------------------------------------------
   Purpose:
   Detects when an element enters the user's view so that it can be revealed
   with an animation or other visual effect.

   What this hook does:
   - Tracks whether the element has become visible.
   - Uses IntersectionObserver to detect when the element enters the viewport.
   - Stops observing the element after it becomes visible.
   - Cleans up the observer when the component is unmounted.

   Options:
   - options: Optional IntersectionObserver settings that can override the
     default threshold and rootMargin values.

   Returns:
   - ref: A React ref that should be attached to the element being revealed.
   - visible: A boolean that becomes true when the element enters the viewport.

   Note:
   The hook only controls visibility state. The actual reveal animation or
   styling should be handled by the component using this hook.
   ============================================================================= */

import { useEffect, useRef, useState } from 'react'

export default function useReveal(options = {}) {
  // ---------- Create a ref for the element being observed ----------
  const ref = useRef(null)

  // ---------- Track whether the element has entered the viewport ----------
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // ---------- Get the current DOM element from the ref ----------
    const node = ref.current
    if (!node) return

    // ---------- Create an observer to detect when the element becomes visible ----------
    const observer = new IntersectionObserver(
      ([entry]) => {
        // ---------- Reveal the element when it enters the viewport ----------
        if (entry.isIntersecting) {
          setVisible(true)

          // Stop observing once the reveal has happened
          observer.unobserve(node)
        }
      },

      // ---------- Default observer settings ----------
      {
        threshold: 0.2,
        rootMargin: '0px 0px -80px 0px',
        ...options,
      }
    )

    // ---------- Start observing the element ----------
    observer.observe(node)

    // ---------- Clean up the observer when the component is unmounted ----------
    return () => observer.disconnect()
  }, [])

  // ---------- Return the element ref and current visibility state ----------
  return [ref, visible]
}

/* ---------------------------------- END OF FILE ---------------------------------- */