import './Button.css'
import { Link } from 'react-router-dom'

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  arrow = false,
  onClick,
  className = '',
  ...rest
}) {
  const classes = `btn btn-${variant} ${className}`.trim()
  const content = (
    <>
      {children}
      {arrow && <span className="btn-arrow" aria-hidden="true">&#8599;</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button className={classes} onClick={onClick} {...rest}>
      {content}
    </button>
  )
}