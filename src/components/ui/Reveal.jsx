// src/components/ui/Reveal.jsx

import { useEffect, useRef, useState } from 'react'

/* =============================================================================
   REVEAL HOOK AND COMPONENT (Reveal.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Provides a reusable scroll-reveal animation component for the Nado Graphics
   website.

   What this component does:
   - Detects when an element enters the visitor's viewport.
   - Adds the "is-visible" class when the element becomes visible.
   - Uses IntersectionObserver so the browser can efficiently detect
     when an element enters the viewport.
   - Stops observing an element after it has been revealed.
   - Supports custom animation delays.
   - Allows different HTML elements to be rendered through the "as" prop.
   - Passes additional HTML properties to the rendered element.

   Main parts:
   - useReveal() : Custom hook that detects when an element enters the viewport.
   - Reveal     : Reusable component that applies the reveal classes and delay.

   Props:
   - as        : HTML element to render. Defaults to <div>.
   - className : Optional additional CSS class names.
   - delay     : Animation delay in milliseconds. Defaults to 0.
   - children  : Content displayed inside the element.
   - ...props  : Additional properties passed to the rendered HTML element.
   ============================================================================= */


/* ---------------------------------------------------------------------------
   REVEAL HOOK
   ---------------------------------------------------------------------------
   Tracks whether an element has entered the visitor's viewport.
   --------------------------------------------------------------------------- */

function useReveal(options = {}) {
  /* Stores a reference to the DOM element being observed */
  const ref = useRef(null)

  /* Tracks whether the element has become visible */
  const [visible, setVisible] = useState(false)


  /* Creates the IntersectionObserver when the component is mounted */
  useEffect(() => {
    /* Gets the current DOM element from the ref */
    const node = ref.current

    /* Stops if there is no element available to observe */
    if (!node) return


    /* Creates an IntersectionObserver to detect when the element
       enters the visitor's viewport */
    const observer = new IntersectionObserver(
      ([entry]) => {

        /* When the element becomes visible, update the state and stop
           observing it because the reveal only needs to happen once */
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(node)
        }
      },

      /* Default observer settings:
         - threshold: reveals when approximately 20% of the element is visible.
         - rootMargin: starts detecting the element slightly before it reaches
           the visible viewport.
         - options: allows custom observer settings to override the defaults. */
      {
        threshold: 0.2,
        rootMargin: '0px 0px -80px 0px',
        ...options
      }
    )


    /* Starts observing the element */
    observer.observe(node)


    /* Cleanup: disconnects the observer when the component is removed */
    return () => observer.disconnect()
  }, [])


  /* Returns the element reference and its current visibility state */
  return [ref, visible]
}


/* ---------------------------------------------------------------------------
   REVEAL COMPONENT
   ---------------------------------------------------------------------------
   Applies the reveal animation classes to the selected HTML element.
   --------------------------------------------------------------------------- */


/* Reusable scroll-reveal component */
export default function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  children,
  ...props
}) {
  /* Gets the DOM reference and visibility state from the custom hook */
  const [ref, visible] = useReveal()


  return (
    <Tag
      /* Connects the DOM element to the IntersectionObserver */
      ref={ref}

      /* Applies the base "reveal" class and adds "is-visible" once the
         element enters the viewport */
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}

      /* Allows each element to have its own animation delay */
      style={{ transitionDelay: `${delay}ms` }}

      /* Passes any additional HTML properties to the rendered element */
      {...props}
    >
      {children}
    </Tag>
  )
}


/* ---------------------------------- END OF FILE ---------------------------------- */