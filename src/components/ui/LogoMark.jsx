// The Nado logo (ring with an N) as an inline SVG.
// It uses the same shapes as assets/Logo.svg, but the viewBox is trimmed
// tightly around the circle so it spins around its true centre when it rolls.
// Colour follows the CSS `color` of the parent (currentColor).
export default function LogoMark({ className = '', title = 'Nado Graphics' }) {
  return (
    <svg
      className={className}
      viewBox="51.05 1.45 138.84 138.84"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="25.51"
        strokeMiterlimit="10"
        d="M63.81,70.83c.02-31.3,25.41-56.65,56.7-56.62,31.3.02,56.65,25.41,56.63,56.7-.02,31.3-25.41,56.65-56.71,56.62-31.3-.02-56.65-25.41-56.62-56.7Z"
      />
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2.83"
        strokeMiterlimit="10"
        d="M129.23,79.96c0-.24.03-.47.08-.69v-12.78c.01-6.19-2.89-9.29-8.72-9.29-5.9,0-8.85,3.09-8.86,9.28v20.76s-.02,4.21-.02,4.21c0,1.74-1.42,3.15-3.16,3.15h-11.05c-1.74,0-3.15-1.42-3.15-3.16v-4.21s0-24.26,0-24.26c0-7.14,2.7-12.45,8.09-15.94,4.59-2.91,10.64-4.36,18.14-4.36,7.5,0,13.51,1.47,18.02,4.38,5.32,3.5,7.97,8.82,7.97,15.96v16.63s0,11.840,11.84c0,1.74-1.41,3.15-3.15,3.15h-11.04c-1.74,0-3.16-1.42-3.15-3.16v-11.5Z"
      />
    </svg>
  )
}