import { useEffect, useRef } from 'react'
import './Lightbox.css'

/* =============================================================================
   LIGHTBOX COMPONENT (Lightbox.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Displays a selected Nado Graphics portfolio project in a full-screen
   lightbox, allowing visitors to view images or YouTube videos without
   leaving the current page.

   What this component supports:
   - Full-screen image and video viewing.
   - Previous and next project navigation.
   - Closing the lightbox with the close button.
   - Closing the lightbox by clicking the background.
   - Keyboard navigation using Escape and the arrow keys.
   - Prevents the page from scrolling while the lightbox is open.
   - Restores focus to the element that was focused before the lightbox opened.

   Props:
   - items    : Array containing the portfolio items displayed in the lightbox.
   - index    : Index of the currently selected portfolio item.
   - onChange : Function used to change the selected portfolio item.
   - onClose  : Function used to close the lightbox.

   The component supports both image items and YouTube video items.
   ============================================================================= */


/* Reusable lightbox component for viewing portfolio items */
export default function Lightbox({ items, index, onChange, onClose }) {
  /* Stores a reference to the close button so focus can be moved to it
     when the lightbox opens */
  const closeRef = useRef(null)

  /* Determines whether the lightbox should currently be displayed.
     The lightbox is open when an index exists and a matching item is found */
  const open = index !== null && items[index]


  /* ---------------------------------------------------------------------------
     Keyboard controls, page scrolling and focus management
     --------------------------------------------------------------------------- */

  /* Runs whenever the lightbox opens or the selected item changes */
  useEffect(() => {
    if (!open) return

    /* Stores the element that had focus before the lightbox opened so focus
       can be returned to it when the lightbox closes */
    const previouslyFocused = document.activeElement

    /* Moves keyboard focus to the close button when the lightbox opens */
    closeRef.current?.focus()


    /* Handles keyboard controls while the lightbox is open */
    const onKey = (e) => {
      /* Escape closes the lightbox */
      if (e.key === 'Escape') onClose()

      /* Right arrow moves to the next portfolio item */
      if (e.key === 'ArrowRight') {
        onChange((index + 1) % items.length)
      }

      /* Left arrow moves to the previous portfolio item */
      if (e.key === 'ArrowLeft') {
        onChange((index - 1 + items.length) % items.length)
      }
    }


    /* Adds the keyboard event listener while the lightbox is open */
    document.addEventListener('keydown', onKey)

    /* Prevents the page behind the lightbox from scrolling */
    document.documentElement.style.overflow = 'hidden'


    /* Cleanup function: removes the keyboard listener, restores page
       scrolling and returns focus to the previously focused element */
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open, index, items.length, onChange, onClose])


  /* Do not render anything when the lightbox is closed */
  if (!open) return null


  /* Gets the currently selected portfolio item */
  const item = items[index]


  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      data-lenis-prevent

      /* Closes the lightbox when the user clicks the empty overlay area.
         Clicking directly on the content does not close it */
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >

      {/* Close button: closes the lightbox when clicked */}
      <button
        ref={closeRef}
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>


      {/* Previous button: only displayed when there is more than one
          portfolio item available */}
      {items.length > 1 && (
        <button
          type="button"
          className="lightbox-arrow lightbox-prev"
          onClick={() => onChange((index - 1 + items.length) % items.length)}
          aria-label="Previous project"
        >
          &#8592;
        </button>
      )}


      {/* Figure containing the selected portfolio media and its caption */}
      <figure className="lightbox-figure">

        {/* Displays a YouTube video when the selected item is a video.
            The video is embedded directly into the lightbox so the visitor
            remains on the Nado Graphics website */}
        {item.type === 'video' ? (

          /* key= forces the iframe to reload when the user moves to a
             different video */
          <iframe
            key={item.youtubeId}
            className="lightbox-video"
            src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={item.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />

        ) : (

          /* Displays the selected portfolio image */
          <img
            src={item.src}
            alt={item.alt || item.title}
          />
        )}


        {/* Caption containing the project category, title and position
            within the portfolio collection */}
        <figcaption>
          <span className="lightbox-cat">
            {item.sub ? `${item.category} · ${item.sub}` : item.category}
          </span>

          <span className="lightbox-title">
            {item.title}
          </span>

          <span className="lightbox-count">
            {index + 1} / {items.length}
          </span>
        </figcaption>

      </figure>


      {/* Next button: only displayed when there is more than one
          portfolio item available */}
      {items.length > 1 && (
        <button
          type="button"
          className="lightbox-arrow lightbox-next"
          onClick={() => onChange((index + 1) % items.length)}
          aria-label="Next project"
        >
          &#8594;
        </button>
      )}

    </div>
  )
}


/* ---------------------------------- END OF FILE ---------------------------------- */