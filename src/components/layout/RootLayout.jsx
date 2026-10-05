/* =============================================================================
   ROOT LAYOUT COMPONENT (RootLayout.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   The top-level layout wrapper for the Nado Graphics website. Every page is
   rendered inside it, so the page content, the footer and the smooth-scrolling
   behaviour only need to be set up once instead of on every page.

   What it does:
   - Renders the current page (via <Outlet />) followed by the shared Footer.
   - Replaces the browser's default scrolling with smooth, eased scrolling
     using the Lenis library.
   - Keeps Lenis and GSAP's ScrollTrigger plugin (scroll-based animations)
     in sync, so animations tied to scroll position stay accurate.
   - Scrolls back to the top whenever the visitor navigates to a new page.

   How it works:
   - Lenis normally runs its own animation loop. Here that loop is turned off
     (autoRaf: false) and Lenis is updated from GSAP's ticker instead. This
     gives both libraries one shared heartbeat, which prevents them drifting
     out of sync and causing jittery animations.
   - Two useEffect hooks handle the setup:
       1. Runs once on load: creates Lenis, connects it to GSAP, and removes
          everything again when the component is removed (cleanup).
       2. Runs on every route change: resets the scroll position.
   ============================================================================= */

import React, { useEffect } from 'react';                  // useEffect runs code after the component renders
import { Outlet, useLocation } from 'react-router-dom';    // Outlet = where the current page appears, useLocation = current URL
import gsap from 'gsap';                                   // GSAP animation library (provides the ticker used below)
import { ScrollTrigger } from 'gsap/ScrollTrigger';        // GSAP plugin that triggers animations based on scroll position
import Lenis from 'lenis';                                 // Smooth-scroll library

import Footer from './Footer';                             // Shared footer shown under every page

// GSAP plugins must be registered once before use so GSAP knows they exist.
// This sits outside the component so it only runs once, not on every render.
gsap.registerPlugin(ScrollTrigger);

export default function RootLayout() {
  // Current URL path (e.g. '/about'). Changes whenever the visitor goes to a new page.
  const { pathname } = useLocation();

  // Smooth scrolling setup. The empty dependency array [] at the bottom means
  // this runs only once, when the layout first loads.
  useEffect(() => {
    // Instantiate Lenis smooth scroller
    const lenis = new Lenis({
      lerp: 0.07,            // How quickly the scroll "catches up" to the target. Lower = smoother and slower, higher = snappier (0 to 1)
      duration: 1.2,         // Length of the scroll animation in seconds (ignored by Lenis while lerp is set)
      smoothWheel: true,     // Smooths mouse wheel scrolling
      wheelMultiplier: 1.0,  // Mouse wheel sensitivity (1 = normal speed)
      touchMultiplier: 1.5,  // Touch scrolling sensitivity (higher = faster on phones)
      autoRaf: false,        // Turns off Lenis' own animation loop because GSAP's ticker drives it below
    });

    // Notify ScrollTrigger on Lenis scroll
    // Lenis moves the page itself, so ScrollTrigger has to be told every time
    // the scroll position changes. Without this, scroll animations would lag behind.
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Advance Lenis on every GSAP frame
    // GSAP's ticker gives the time in seconds but Lenis expects milliseconds, so multiply by 1000
    const updateGSAP = (time) => {
      lenis.raf(time * 1000);
    };

    // Register the function so GSAP calls it on every animation frame
    gsap.ticker.add(updateGSAP);
    // Lag smoothing normally makes GSAP skip ahead after a slow frame. Setting it
    // to 0 turns that off so Lenis' scroll position never jumps after a lag spike.
    gsap.ticker.lagSmoothing(0);

    // Cleanup: runs when the layout is removed from the page.
    // Stops the loop and destroys Lenis so nothing keeps running in the background.
    return () => {
      gsap.ticker.remove(updateGSAP);
      lenis.destroy();
    };
  }, []);

  // Reset scroll position to top on page navigation
  // Runs every time pathname changes, because React Router keeps the old scroll position by default
  useEffect(() => {
    window.scrollTo(0, 0);
    // Recalculate ScrollTrigger's start and end points, since the new page has different content and height
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    // Wrapper elements around the whole site. These ids are hooks for styling or scripting
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <main>
          {/* The current page's component is rendered here by React Router */}
          <Outlet />
        </main>
        {/* Footer is outside <Outlet /> so it appears on every page */}
        <Footer />
      </div>
    </div>
  );
}

/* =============================================================================
   REFERENCES
   -----------------------------------------------------------------------------
   Lenis (GitHub): smooth-scroll library and its options (lerp, duration,
   autoRaf, wheelMultiplier, touchMultiplier), plus the GSAP integration
   https://github.com/darkroomengineering/lenis

   GSAP Docs: ScrollTrigger plugin (scroll-based animations, update() and
   refresh() used above)
   https://gsap.com/docs/v3/Plugins/ScrollTrigger/

   GSAP Docs: gsap.ticker (GSAP's animation loop, and the add() and remove()
   methods used to attach Lenis to it)
   https://gsap.com/docs/v3/GSAP/gsap.ticker/

   GSAP Docs: gsap.ticker.lagSmoothing() (why lag smoothing is switched off).
   It is a section on the same page as the ticker docs above.
   https://gsap.com/docs/v3/GSAP/gsap.ticker/
   ============================================================================= */

// ---------------------------------- END OF FILE ---------------------------------- //