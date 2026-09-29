import { Link } from 'react-router-dom'
import './PhotoStrip.css'

export default function PhotoStrip({ photos = [], speed = 60, linkTo }) {
  // The list is repeated once so the loop runs without a gap
  const track = [...photos, ...photos]

  return (
    <div className="photo-strip" style={{ '--strip-duration': `${speed}s` }}>
      <div className="photo-strip-track">
        {track.map((photo, i) => {
          const isCopy = i >= photos.length

          const media = photo.src ? (
            <img src={photo.src} alt={isCopy ? '' : photo.alt || ''} loading="lazy" />
          ) : (
            <div className="photo-strip-placeholder" style={{ aspectRatio: photo.ratio || 4 / 3 }}>
              <span>Photo {(i % photos.length) + 1}</span>
            </div>
          )

          return (
            <figure className="photo-strip-item" key={i} aria-hidden={isCopy || undefined}>
              {linkTo && photo.src ? (
                <Link
                  to={linkTo(photo)}
                  className="photo-strip-link"
                  tabIndex={isCopy ? -1 : undefined}
                  aria-label={isCopy ? undefined : `View ${photo.caption || 'this project'} in Our Work`}
                >
                  {media}
                </Link>
              ) : (
                media
              )}
              {photo.caption && <figcaption>{photo.caption}</figcaption>}
            </figure>
          )
        })}
      </div>
    </div>
  )
}