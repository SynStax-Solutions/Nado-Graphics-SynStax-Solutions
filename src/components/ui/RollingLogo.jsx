import { useLayoutEffect, useRef } from 'react'
import Logo from '../../assets/Logo.svg'
import './RollingLogo.css'


/* =============================================================================
   ROLLING LOGO COMPONENT (RollingLogo.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Displays the Nado Graphics logo with a rolling entrance animation.

   What this component does:
   - Loads the Nado Graphics logo SVG.
   - Calculates the logo's actual size on the screen.
   - Starts the logo just outside the left side of the screen.
   - Rolls the logo across the screen while rotating it.
   - Uses the logo's diameter to calculate realistic rolling rotation.
   - Adds a small overshoot and correction before the logo settles.
   - Respects the visitor's reduced-motion accessibility preference.
   - Calls onLanded when the animation finishes.

   Props:
   - delay     : Delay before the rolling animation starts, in milliseconds.
                 Defaults to 300ms.
   - duration  : Length of the rolling animation, in milliseconds.
                 Defaults to 1400ms.
   - onLanded  : Optional function called when the logo finishes rolling.
   - className : Optional additional CSS class names.

   Logo measurements:
   - FILE_W       : Original width of the logo SVG.
   - FILE_H       : Original height of the logo SVG.
   - CIRCLE       : Diameter of the circular part of the logo.
   - CIRCLE_LEFT  : Horizontal position of the circular part inside the SVG.

   Note: the animation uses the Web Animations API and calculates the
   rotation based on the circumference of the logo so that the logo rolls
   rather than simply spinning in place.
   ============================================================================= */


/* Original dimensions of the Logo.svg file */
const FILE_W = 240.94
const FILE_H = 141.73

/* Diameter of the circular logo mark inside the SVG */
const CIRCLE = 138.84

/* Horizontal position of the circular logo mark inside the SVG */
const CIRCLE_LEFT = 51.05


/* Reusable rolling logo component */
export default function RollingLogo({
  delay = 300,
  duration = 1400,
  onLanded,
  className = ''
}) {
  /* Stores a reference to the logo image element */
  const ref = useRef(null)


  /* ---------------------------------------------------------------------------
     ROLLING LOGO ANIMATION
     --------------------------------------------------------------------------- */

  /* useLayoutEffect runs after the DOM has been laid out, allowing the
     animation to use the logo's actual size and position */
  useLayoutEffect(() => {
    /* Gets the logo element from the ref */
    const el = ref.current

    /* Stops if the logo element is not available */
    if (!el) return


    /* Checks whether the visitor has enabled reduced motion in their
       operating system or browser accessibility settings */
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches


    /* If reduced motion is enabled, skip the animation and immediately
       notify the parent component that the logo has landed */
    if (reduceMotion) {
      onLanded?.()
      return
    }


    /* Gets the logo's current position and dimensions on the screen */
    const rect = el.getBoundingClientRect()


    /* Calculates the scale between the original SVG height and its
       current displayed height */
    const scale = rect.height / FILE_H


    /* Calculates the displayed diameter of the circular logo mark */
    const diameter = CIRCLE * scale


    /* Calculates the screen position of the left edge of the circular
       part of the logo */
    const circleLeft = rect.left + CIRCLE_LEFT * scale


    /* -------------------------------------------------------------------------
       Starting and overshoot positions
       ------------------------------------------------------------------------- */

    /* Calculates how far the logo needs to travel so that the entire
       circular logo starts outside the left edge of the screen */
    const distance = circleLeft + diameter * 1.1


    /* Adds a small overshoot so the logo rolls slightly past its final
       position before settling */
    const overshoot = diameter * 0.08


    /* -------------------------------------------------------------------------
       Rolling rotation calculation
       ------------------------------------------------------------------------- */

    /* Calculates the rotation required for a given travel distance.
       One complete rotation is equal to one circumference of the circle,
       creating a rolling-without-slipping effect */
    const spinFor = (px) => (
      (px / (Math.PI * diameter)) * 360
    )


    /* Creates the rolling animation using the Web Animations API */
    const animation = el.animate(
      [
        /* Initial position: the logo begins outside the left edge of the
           screen while rotated according to the distance travelled */
        {
          transform: `translateX(${-distance}px) rotate(${-spinFor(distance)}deg)`
        },

        /* First stage: the logo rolls slightly past its final position */
        {
          transform: `translateX(${overshoot}px) rotate(${spinFor(overshoot)}deg)`,
          offset: 0.82
        },

        /* Second stage: the logo rolls back slightly toward its final
           position to create a natural settling effect */
        {
          transform: `translateX(${-overshoot * 0.3}px) rotate(${-spinFor(overshoot * 0.3)}deg)`,
          offset: 0.92
        },

        /* Final position: the logo is centred at its normal position
           with no rotation */
        {
          transform: 'translateX(0) rotate(0deg)'
        },
      ],
      {
        /* Total length of the animation */
        duration,

        /* Delay before the animation starts */
        delay,

        /* Smooth easing curve used throughout the animation */
        easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',

        /* Keeps the logo at its starting off-screen position while
           waiting for the animation delay */
        fill: 'backwards',
      }
    )


    /* Calls the onLanded callback when the rolling animation finishes */
    animation.onfinish = () => onLanded?.()


    /* Cancels the animation if the component is removed or the effect
       is restarted */
    return () => animation.cancel()

    /* The animation intentionally depends only on delay and duration.
       The lint warning is disabled because the other values are intentionally
       excluded from the effect dependencies. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, duration])


  /* ---------------------------------------------------------------------------
     LOGO OUTPUT
     --------------------------------------------------------------------------- */

  return (
    <img
      /* Connects the image element to the animation ref */
      ref={ref}

      /* Uses the Nado Graphics Logo.svg asset */
      src={Logo}

      /* Empty alt text because this decorative animated logo does not add
         additional information for screen readers */
      alt=""

      /* Applies the base rolling-logo class and any additional class
         supplied through the className prop */
      className={`rolling-logo ${className}`.trim()}

      /* Preserves the original proportions of the Logo.svg file */
      style={{
        aspectRatio: `${FILE_W} / ${FILE_H}`
      }}
    />
  )
}


/* ---------------------------------- END OF FILE ---------------------------------- */