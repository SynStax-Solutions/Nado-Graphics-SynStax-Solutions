import { useEffect, useRef } from 'react'
import './Lightbox.css'

export default function Lightbox({ items, index, onChange, onClose }) {
  const closeRef = useRef(null)
  const open = index !== null && items[index]

  // Keyboard controls, stop the page scrolling behind, and move focus in/out
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    closeRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onChange((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open, index, items.length, onChange, onClose])

  if (!open) return null
  const item = items[index]

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button ref={closeRef} type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
        &times;
      </button>

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

      <figure className="lightbox-figure">
                {item.type === 'video' ? (
          <video key={item.src} src={item.src} controls autoPlay playsInline />
        ) : (
          <img src={item.src} alt={item.alt || item.title} />
        )}
        <figcaption>
                   <span className="lightbox-cat">{item.sub ? `${item.category} · ${item.sub}` : item.category}</span>
          <span className="lightbox-title">{item.title}</span>
          <span className="lightbox-count">{index + 1} / {items.length}</span>
        </figcaption>
      </figure>

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