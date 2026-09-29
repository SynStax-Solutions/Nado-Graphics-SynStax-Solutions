import PageIntro from '../components/ui/PageIntro'
import Team from '../components/sections/Team'
import './AboutPage.css'
import './ClientsPage.css'

export default function ClientsPage() {
  return (
    <div className="about-page clients-page">
      <div className="wrap">
        <PageIntro
          label="Our clients"
          title="Trusted since 2000."
          quiet="By universities, hospitals and brands."
          lead="From university campuses to national corporates, we've delivered branding, print and signage at a scale most studios our size never see."
        />
      </div>

      <Team showHead={false} />
    </div>
  )
}