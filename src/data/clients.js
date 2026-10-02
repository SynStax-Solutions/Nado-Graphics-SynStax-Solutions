/*
  Client logos for the Our Clients page, loaded automatically from src/assets/Logos/.
  To add a client: drop their logo into that folder (png, jpg, svg, webp or avif).
*/
 
// These appear first, in this order. Each entry matches the start of a file name (not case-sensitive).
const FIRST = ['UWC', 'UCT Logo', 'UCT Sport', 'UP ', 'Stellenbosch_University', 'MatiesSport', 'Melomed', 'CCLogo']
 
// Files to leave out (extra versions of the same logo)
const SKIP = [
  /vertical/i,
  // The white-text version of the FISU logo: it disappears on a white background.
  // (If it is the other file that is white, change this to /final 3\.png$/i)
  /logos-final\.png$/i,
]
 
// Names for screen readers and hover text. Matched against the start of the file name.
// The FIRST match wins, so put the more specific names (like 'UCT Sport') above the general ones ('UCT').
const NAMES = [
  ['UWC', 'University of the Western Cape'],
  ['UCT Sport', 'UCT Sport'],
  ['UCT', 'University of Cape Town'],
  ['UP ', 'University of Pretoria'],
  ['Melomed', 'Melomed Hospitals'],
  ['CCLogo', 'CancerCare'],
  ['AGC', 'AGC'],
  ['Casa', 'CASAS'],
  ['CEPSA', 'CEPSA'],
  ['DSI-NRF', 'DSI-NRF Centre of Excellence in Food Security'],
  ['MatiesSport', 'Maties Sport'],
  ['sanord', 'SANORD'],
  ['Sevens-FISU', 'FISU World University Rugby Sevens, Stellenbosch 2026'],
  ['Stellenbosch_University', 'Stellenbosch University'],
  ['SU-EMS', 'Stellenbosch University EMS'],
  ['University Sport Company', 'University Sport Company'],
]
 
const files = import.meta.glob('../assets/Logos/*.{png,jpg,jpeg,svg,webp,avif,PNG,JPG,JPEG,SVG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
})
 
const startsWith = (file, key) => file.toLowerCase().startsWith(key.toLowerCase())
 
const nameFor = (file) => {
  const match = NAMES.find(([key]) => startsWith(file, key))
  if (match) return match[1]
  // Fallback: tidy the file name, e.g. "Some-Client_logo.png" -> "Some Client"
  return file.replace(/\.[^.]+$/, '').replace(/logo/gi, '').replace(/[_-]+/g, ' ').trim()
}
 
const seen = new Set()
 
export const CLIENT_LOGOS = Object.entries(files)
  .map(([path, src]) => {
    const file = path.split('/').pop()
    return { file, src, name: nameFor(file) }
  })
  .filter((logo) => !SKIP.some((rule) => rule.test(logo.file)))
  // Only one logo per client
  .filter((logo) => {
    if (seen.has(logo.name)) return false
    seen.add(logo.name)
    return true
  })
  .sort((a, b) => {
    const rank = (logo) => {
      const i = FIRST.findIndex((key) => startsWith(logo.file, key))
      return i === -1 ? FIRST.length : i
    }
    return rank(a) - rank(b) || a.name.localeCompare(b.name)
  })