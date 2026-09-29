import './SectionHead.css'

// voice is kept for compatibility with older code
export default function SectionHead({ heading, description, voice = false }) {
  return (
    <div className="section-head">
      <h2>{heading}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}