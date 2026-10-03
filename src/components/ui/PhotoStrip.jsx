import { Link } from 'react-router-dom'
import './PhotoStrip.css'

/* =============================================================================
   PHOTO STRIP COMPONENT (PhotoStrip.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Provides a reusable horizontal photo strip for showcasing Nado Graphics
   portfolio images.

   What this component supports:
   - Automatically scrolling portfolio images.
   - Repeating the photo list to create a continuous scrolling loop.
   - Customisable animation speed.
   - Optional links that navigate visitors to a project page.
   - Image placeholders when no image source is available.
   - Optional photo captions.
   - Accessibility support for repeated images and reduced-motion users.

   Props:
   - photos : Array containing the photos displayed in the strip.
   - speed  : Controls the duration of the scrolling animation in seconds.
             Defaults to 60 seconds.
   - linkTo : Optional function that returns the destination route for
             a selected photo.

   Each photo can contain:
   - src     : Image source.
   - alt     : Alternative text for accessibility.
   - caption : Optional caption displayed below the image.
   - ratio   : Optional aspect ratio used for placeholder elements.
   ============================================================================= */


/* Reusable horizontal photo strip component */
export default function PhotoStrip({
  photos = [],
  speed = 60,
  linkTo
}) {
  /* The photo list is repeated once so the scrolling animation can
     continuously loop without leaving an empty space */
  const track = [...photos, ...photos]


  return (
    <div
      className="photo-strip"

      /* Passes the animation speed to CSS through a custom property */
      style={{ '--strip-duration': `${speed}s` }}
    >

      <div className="photo-strip-track">

        {/* Creates a photo item for every image in the duplicated list */}
        {track.map((photo, i) => {

          /* Determines whether the current photo belongs to the duplicated
             copy of the original photo list */
          const isCopy = i >= photos.length


          /* Creates either an image or a placeholder depending on whether
             the photo has a source */
          const media = photo.src ? (

            /* Displays the portfolio image */
            <img
              src={photo.src}
              alt={isCopy ? '' : photo.alt || ''}
              loading="lazy"
            />

          ) : (

            /* Displays a placeholder when no image source is available */
            <div
              className="photo-strip-placeholder"
              style={{ aspectRatio: photo.ratio || 4 / 3 }}
            >
              <span>
                Photo {(i % photos.length) + 1}
              </span>
            </div>
          )


          return (
            <figure
              className="photo-strip-item"
              key={i}

              /* Hides duplicated images from screen readers so the same
                 photo is not announced twice */
              aria-hidden={isCopy || undefined}
            >

              {/* When linkTo is provided and the photo has an image source,
                  make the photo clickable and navigate to its project page */}
              {linkTo && photo.src ? (
                <Link
                  to={linkTo(photo)}
                  className="photo-strip-link"

                  /* Prevents keyboard users from tabbing to duplicated
                     copies of the same photo */
                  tabIndex={isCopy ? -1 : undefined}

                  /* Provides an accessible description for the clickable
                     photo */
                  aria-label={
                    isCopy
                      ? undefined
                      : `View ${photo.caption || 'this project'} in Our Work`
                  }
                >
                  {media}
                </Link>
              ) : (

                /* Displays the media without a link when linkTo is not provided */
                media
              )}


              {/* Displays the caption only when the photo contains caption text */}
              {photo.caption && (
                <figcaption>
                  {photo.caption}
                </figcaption>
              )}

            </figure>
          )
        })}

      </div>
    </div>
  )
}


/* ---------------------------------- END OF FILE ---------------------------------- */