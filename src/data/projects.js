/*
  Our Work: everything is loaded automatically from src/assets/work/.

  Folder structure = tabs on the Our Work page:
    src/assets/work/
      Design & Print/          <- main tab
        Brochures/             <- sub-tab inside Design & Print
          any-image.jpg
      Lapel badges/            <- main tab with no sub-tabs (images straight inside)
        lapel_1.jpg
      Video Animation/         <- .mp4 files show as videos

  To add work: drop files into a folder. A new folder = a new tab.
*/

// Order of the main tabs. Folders not listed here are added after these, A to Z.
const MAIN_ORDER = ['Design & Print', 'Merchandise', 'Video Animation', 'Lapel badges']

const LABELS = {
  'Lapel badges': 'Lapel Badges',
}

export const labelFor = (name) => LABELS[name] || name

const files = import.meta.glob(
  '../assets/work/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP,mp4,MP4,webm,WEBM}',
  { eager: true, import: 'default' }
)

const VIDEO = /\.(mp4|webm)$/i

// Build one entry per file
const all = Object.entries(files)
  .map(([path, src]) => {
    const relative = path.split('/assets/work/')[1] // e.g. "Design & Print/Brochures/15.jpg"
    const parts = relative.split('/')
    const file = parts[parts.length - 1]
    const category = parts[0]
    const sub = parts.length > 2 ? parts[1] : null // first folder inside the main folder
    const isVideo = VIDEO.test(file)
    const name = file.replace(/\.[^.]+$/, '')
    // File names are mostly numbers/"mockup", so the title is the sub-folder (or main folder) name
    const title = isVideo ? name.replace(/[_-]+/g, ' ') : labelFor(sub || category)
    return {
      path: relative,
      src,
      file,
      category,
      sub,
      type: isVideo ? 'video' : 'image',
      title,
      alt: `${labelFor(category)}${sub ? `, ${sub}` : ''}: ${name}`,
    }
  })
  .sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }))

// Main tabs, in the preferred order
const foundMain = [...new Set(all.map((p) => p.category))]
export const CATEGORIES = [
  ...MAIN_ORDER.filter((c) => foundMain.includes(c)),
  ...foundMain.filter((c) => !MAIN_ORDER.includes(c)).sort(),
]

// Sub-tabs for each main tab (empty list = no sub-tabs)
export const SUBCATEGORIES = Object.fromEntries(
  CATEGORIES.map((c) => [c, [...new Set(all.filter((p) => p.category === c && p.sub).map((p) => p.sub))]])
)

// Mix lists together so similar pieces don't bunch up
const interleave = (lists) => {
  const out = []
  for (let i = 0; lists.some((l) => i < l.length); i++) lists.forEach((l) => l[i] && out.push(l[i]))
  return out
}

// Projects for a tab (and optional sub-tab)
export function getProjects(category = 'All', sub = 'All') {
  if (category === 'All') {
    return interleave(CATEGORIES.map((c) => getProjects(c)))
  }
  const inCategory = all.filter((p) => p.category === category)
  if (sub !== 'All') return inCategory.filter((p) => p.sub === sub)
  const subs = SUBCATEGORIES[category]
  if (!subs.length) return inCategory
  return interleave([...subs.map((s) => inCategory.filter((p) => p.sub === s)), inCategory.filter((p) => !p.sub)])
}

export const PROJECTS = getProjects()

// Link to a tab on the Our Work page
export const workLink = (category, sub) => {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (sub) params.set('sub', sub)
  const q = params.toString()
  return q ? `/portfolio?${q}` : '/portfolio'
}

export function getWork(path) {
  const item = all.find((p) => p.path === path)
  if (!item) {
    console.warn(`Image not found in src/assets/work: ${path}`)
    return null
  }
  return { ...item, link: workLink(item.category, item.sub) }
}