import './PageIntro.css'

export default function PageIntro({ label, title, quiet, lead }) {
  return (
    <div className="page-intro">
      <p className="page-intro-label">{label}</p>
      <h1 className="page-intro-title">
        {title}
        {quiet && <span className="quiet">{quiet}</span>}
      </h1>
      {lead && <p className="page-intro-lead">{lead}</p>}
    </div>
  )
}