/*
  Our Work: everything is loaded automatically from src/assets/work/.

  Folder structure = tabs on the Our Work page:

    src/assets/work/
      Design & Print/          <- main tab
        Brochures/             <- sub-tab inside Design & Print
          any-image.jpg

      Lapel badges/            <- main tab with no sub-tabs
        lapel_1.jpg

  Video Animation:
    Videos are loaded from YouTube as unlisted videos.
    The YouTube links are added manually below.

  To add image work:
    Drop files into the appropriate folder.

  To add a YouTube video:
    Add it to YOUTUBE_VIDEOS below.
*/

// ---------- Main tab order ----------

// Order of the main tabs.
// Folders not listed here are added after these, A to Z.

const MAIN_ORDER = [
  'Design & Print',
  'Merchandise',
  'Video Animation',
  'Lapel badges'
]

// ---------- Labels ----------

const LABELS = {
  'Lapel badges': 'Lapel Badges',
}

export const labelFor = (name) => LABELS[name] || name

// ---------- Local image files ----------

// Automatically load images from src/assets/work/.

const files = import.meta.glob(
  '../assets/work/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
)

// ---------- YouTube videos ----------

// YouTube videos are unlisted and are embedded using their video IDs
// (the part after youtu.be/ in the link).
// Keep the titles the same: the Home page finds videos by "Video Animation/01 Medical Bioscience" etc.

const YOUTUBE_VIDEOS = [
  { id: 'NXsovPw1Z5g', title: 'Medical Bioscience' },
  { id: 'ExIxhRCc_os', title: 'Computer Science' },
  { id: '0L8ewbpnLeY', title: 'Maties Intro' },
  { id: 'fYVSQjV1TJA', title: 'Understanding Employment Equity in South Africa' },
  { id: 'p0Rikg9W98I', title: 'Biotechnology' },
  { id: '0W6arLd7rc4', title: 'Maties Sport Awards' },
  { id: 'DOFwlia_zM4', title: 'Maties Sport Welcome' },
  { id: 'OGbuHZKyxgI', title: 'Chemical Sciences' },
  { id: 'CyPGTOIHD8I', title: 'FISU Welcome Video Final' },
  { id: '8eUj5BMeDoQ', title: 'Maties Sport Academic Achievers' },
].map((video, index) => ({
  path: `Video Animation/${String(index + 1).padStart(2, '0')} ${video.title}`,
  src: `https://www.youtube.com/embed/${video.id}`,
  // Picture shown in the grid before the video is opened
  thumb: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
  thumbFallback: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
  file: `${String(index + 1).padStart(2, '0')} ${video.title}`,
  category: 'Video Animation',
  sub: null,
  type: 'video',
  title: video.title,
  alt: `Video Animation: ${video.title}`,
  youtubeId: video.id,
  youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
}))

// ---------- Build image entries ----------

// Build one entry per local image.

const imageProjects = Object.entries(files).map(([path, src]) => {
  const relative = path.split('/assets/work/')[1]
  const parts = relative.split('/')
  const file = parts[parts.length - 1]
  const category = parts[0]
  const sub = parts.length > 2 ? parts[1] : null
  const name = file.replace(/\.[^.]+$/, '').replace(/^\d+[\s._-]+/, '')

  // File names are mostly numbers/"mockup",
  // so the title is the sub-folder or main folder name.
  const title = labelFor(sub || category)

  return {
    path: relative,
    src,
    file,
    category,
    sub,
    type: 'image',
    title,
    alt: `${labelFor(category)}${sub ? `, ${sub}` : ''}: ${name}`,
  }
})

// ---------- Combine local images and YouTube videos ----------

const all = [...imageProjects, ...YOUTUBE_VIDEOS].sort((a, b) =>
  a.path.localeCompare(b.path, undefined, { numeric: true })
)

// ---------- Main tabs ----------

// Main tabs, in the preferred order.

const foundMain = [...new Set(all.map((p) => p.category))]

export const CATEGORIES = [
  ...MAIN_ORDER.filter((c) => foundMain.includes(c)),
  ...foundMain.filter((c) => !MAIN_ORDER.includes(c)).sort(),
]

// ---------- Sub-tabs ----------

// Sub-tabs for each main tab.
// Empty list = no sub-tabs.

export const SUBCATEGORIES = Object.fromEntries(
  CATEGORIES.map((c) => [
    c,
    [...new Set(all.filter((p) => p.category === c && p.sub).map((p) => p.sub))],
  ])
)

// ---------- Interleave ----------

// Mix lists together so similar pieces don't bunch up.

const interleave = (lists) => {
  const out = []
  for (let i = 0; lists.some((l) => i < l.length); i++) {
    lists.forEach((l) => l[i] && out.push(l[i]))
  }
  return out
}

// ---------- Projects for a tab ----------

// Projects for a tab and optional sub-tab.

export function getProjects(category = 'All', sub = 'All') {
  if (category === 'All') {
    return interleave(CATEGORIES.map((c) => getProjects(c)))
  }

  const inCategory = all.filter((p) => p.category === category)

  if (sub !== 'All') {
    return inCategory.filter((p) => p.sub === sub)
  }

  const subs = SUBCATEGORIES[category]

  if (!subs.length) {
    return inCategory
  }

  return interleave([
    ...subs.map((s) => inCategory.filter((p) => p.sub === s)),
    inCategory.filter((p) => !p.sub),
  ])
}

export const PROJECTS = getProjects()

// ---------- Link to a tab on the Our Work page ----------

// Link to a tab on the Our Work page.

export const workLink = (category, sub) => {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (sub) params.set('sub', sub)
  const q = params.toString()
  return q ? `/portfolio?${q}` : '/portfolio'
}

// ---------- Get a specific work item ----------

export function getWork(path) {
  const item = all.find((p) => p.path === path)

  if (!item) {
    console.warn(`Work item not found in src/assets/work: ${path}`)
    return null
  }

  return {
    ...item,
    link: workLink(item.category, item.sub),
  }
}

// ------------------ END OF FILE ------------------ //
