import './Button.css'
import { Link } from 'react-router-dom'

/* =============================================================================
   REUSABLE BUTTON COMPONENT (Button.jsx)
   -----------------------------------------------------------------------------
   Purpose:
   Provides a reusable button component for the Nado Graphics website.

   What this component supports:
   - Normal buttons using the <button> element.
   - Internal navigation using React Router's <Link> component.
   - External links using the standard <a> element.
   - Different button variants such as primary, ghost and light.
   - An optional arrow displayed inside the button.
   - Additional HTML properties through the ...rest parameter.

   Props:
   - children   : The text or content displayed inside the button.
   - to         : The internal route the button should navigate to.
   - href       : The URL the button should link to.
   - variant    : Controls the button style. Defaults to "primary".
   - arrow      : Determines whether an arrow is displayed.
   - onClick    : Function that runs when a normal button is clicked.
   - className  : Allows additional CSS classes to be added.
   - ...rest    : Passes any additional properties to the rendered element.
   ============================================================================= */


/* Reusable Button component with support for links and normal buttons */
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
  /* Builds the CSS class names using the selected button variant and any
     additional class supplied to the component */
  const classes = `btn btn-${variant} ${className}`.trim()

  /* Defines the content shared by all three button types.
     The arrow is only displayed when the arrow prop is set to true */
  const content = (
    <>
      {children}
      {arrow && (
        <span className="btn-arrow" aria-hidden="true">
          &#8599;
        </span>
      )}
    </>
  )

  /* If a "to" prop is provided, use React Router's Link component for
     navigation between pages within the website */
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  /* If an "href" prop is provided, use a standard anchor element for
     linking to an external URL or another web address */
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  /* If neither "to" nor "href" is provided, render a standard button.
     The onClick function is used for button click actions */
  return (
    <button className={classes} onClick={onClick} {...rest}>
      {content}
    </button>
  )
}


/* ---------------------------------- END OF FILE ---------------------------------- */