import PageIntro from '../components/ui/PageIntro'
import Process from '../components/sections/Process'
import './ServicesPage.css'

export default function ServicesPage() {
  return (
    <div className="services-page">
      <div className="wrap">
        <PageIntro
          label="Our services"
          title="Everything under one roof."
          quiet="From a single logo to a campus-wide rollout."
          lead="Design, print, signage, apparel and digital, handled by one team from the first idea to the finished piece."
        />
      </div>

      <Process showHead={false} />
    </div>
  )
}