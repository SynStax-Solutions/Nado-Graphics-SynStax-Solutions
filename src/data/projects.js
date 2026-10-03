/* =============================================================================
   PROJECTS DATA MODULE (projects.js)
   -----------------------------------------------------------------------------
   Purpose:
   The data layer for the "Our Work" part of the Nado Graphics website. It builds
   one combined list of portfolio items (local images and YouTube videos) and
   provides helper functions so other files can ask for the items they need,
   without knowing where the items came from.

   What it exports:
   - labelFor(name)           : turns a folder name into a display label.
   - CATEGORIES               : the main tabs (for example "Design & Print").
   - SUBCATEGORIES            : the sub-tabs for each main tab.
   - getProjects(cat, sub)    : the items for a tab, and optionally a sub-tab.
   - PROJECTS                 : every item, mixed across all tabs.
   - workLink(category, sub)  : builds a link to a tab on the Our Work page.
   - getWork(path)            : finds one specific item and adds its link.

   How it works:
   1. Every image in src/assets/work/ is loaded automatically. The folder
      structure becomes the tabs: the first folder is the main tab and an
      optional second folder is the sub-tab.
   2. YouTube videos can't be found by scanning a folder, so they are listed by
      hand in YOUTUBE_VIDEOS and converted into the same shape as the images.
   3. Images and videos are merged into one list (all), sorted by path.
   4. The tabs (CATEGORIES and SUBCATEGORIES) are worked out from that list,
      so adding a new folder creates a new tab with no code changes.

   Every item has the same basic shape: path, src, file, category, sub, type
   ("image" or "video"), title and alt. Videos have extra fields (thumbnails and
   YouTube details).

   Used by: the Our Work page, WorkGrid, AboutHero and ServiceGrid.
   ============================================================================= */

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

// Display names for folders whose name should look different on screen.
// Here the folder is "Lapel badges" but the tab shows "Lapel Badges".
const LABELS = {
  'Lapel badges': 'Lapel Badges',
}

// Returns the display label for a folder name. If there is no special label, the name is used as it is.
// (|| uses the right-hand value whenever the left-hand value is missing.)
export const labelFor = (name) => LABELS[name] || name

// ---------- Local image files ----------

// Automatically load images from src/assets/work/.

// import.meta.glob is a Vite feature that finds every file matching a pattern when the site is built.
//   **            -> any folder at any depth, so images in sub-folders are found too
//   eager: true   -> load everything immediately, instead of on demand
//   import: 'default' -> give the image address directly, instead of a wrapper object around it
// The result is an object where each key is the file's path and each value is the image's address.
// Upper and lower case extensions are both listed because file matching here is case-sensitive.
const files = import.meta.glob(
  '../assets/work/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
)

// ---------- YouTube videos ----------

// YouTube videos are unlisted and are embedded using their video IDs
// (the part after youtu.be/ in the link).
// Keep the titles the same: the Home page finds videos by "Video Animation/01 Medical Bioscience" etc.

// The hand-written list of videos. Each entry only needs the YouTube ID and a title.
// Important: the order matters as well as the titles. The number in each video's path
// (01, 02, ...) comes from its position in this list, so putting a new video before
// an existing one renumbers it and breaks any lookup that uses the old path.
// Add new videos at the end to be safe.
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
// Convert each entry into the same shape as an image entry, so the rest of the site can treat both the same.
// index is the video's position in the list (0, 1, 2 ...).
].map((video, index) => ({
  // A made-up path in the same style as the image paths. padStart(2, '0') turns 1 into "01"
  // so the numbers line up and sort correctly.
  path: `Video Animation/${String(index + 1).padStart(2, '0')} ${video.title}`,
  src: `https://www.youtube.com/embed/${video.id}`,   // The address used to embed the video in an <iframe>
  // Picture shown in the grid before the video is opened
  thumb: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,         // High quality thumbnail (not every video has one)
  thumbFallback: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,     // Smaller thumbnail that every video has, used if the one above is missing
  file: `${String(index + 1).padStart(2, '0')} ${video.title}`,          // A file-style name, to match the image entries
  category: 'Video Animation',                        // Every video goes in the Video Animation tab
  sub: null,                                          // Videos have no sub-tab
  type: 'video',                                      // Tells the rest of the site this is a video, not an image
  title: video.title,
  alt: `Video Animation: ${video.title}`,             // Description for screen readers
  youtubeId: video.id,
  youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,   // The normal link to the video on YouTube
}))

// ---------- Build image entries ----------

// Build one entry per local image.

// Object.entries(files) turns the files object into an array of [path, src] pairs,
// and .map() turns each pair into an item object.
const imageProjects = Object.entries(files).map(([path, src]) => {
  // The path looks like "../assets/work/Design & Print/Brochures/mockup 1.jpg".
  // Everything before "/assets/work/" is cut off, leaving "Design & Print/Brochures/mockup 1.jpg".
  const relative = path.split('/assets/work/')[1]
  // Split into folder and file names: ["Design & Print", "Brochures", "mockup 1.jpg"]
  const parts = relative.split('/')
  const file = parts[parts.length - 1]                // The last piece is the file name
  const category = parts[0]                           // The first piece is the main tab
  const sub = parts.length > 2 ? parts[1] : null      // A second folder, if there is one, is the sub-tab. Otherwise null
  // Tidy the file name for the alt text: remove the extension, then remove any number
  // and separators at the start (so "03 - banner.jpg" becomes "banner")
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
    // Builds text like "Design & Print, Brochures: mockup 1". The sub-folder is only included if there is one.
    alt: `${labelFor(category)}${sub ? `, ${sub}` : ''}: ${name}`,
  }
})

// ---------- Combine local images and YouTube videos ----------

// Join the two lists into one (the ... spreads each list's items out), then sort by path.
// numeric: true makes numbers inside the text sort by value, so "mockup 2" comes before "mockup 10"
// instead of after it, which is what plain alphabetical sorting would do.
const all = [...imageProjects, ...YOUTUBE_VIDEOS].sort((a, b) =>
  a.path.localeCompare(b.path, undefined, { numeric: true })
)

// ---------- Main tabs ----------

// Main tabs, in the preferred order.

// The unique main tabs that actually exist in the data. A Set only stores each value once,
// and [...new Set(...)] turns it back into an array.
const foundMain = [...new Set(all.map((p) => p.category))]

export const CATEGORIES = [
  // First, the tabs listed in MAIN_ORDER (skipping any that don't exist in the data)
  ...MAIN_ORDER.filter((c) => foundMain.includes(c)),
  // Then any other tabs, in A to Z order
  ...foundMain.filter((c) => !MAIN_ORDER.includes(c)).sort(),
]

// ---------- Sub-tabs ----------

// Sub-tabs for each main tab.
// Empty list = no sub-tabs.

// Builds an object like { 'Design & Print': ['Brochures', 'Flyers'], 'Lapel badges': [] }.
// For each main tab, it finds that tab's items that have a sub-tab, collects the unique sub-tab names,
// and Object.fromEntries turns the list of [tab, subs] pairs into an object.
export const SUBCATEGORIES = Object.fromEntries(
  CATEGORIES.map((c) => [
    c,
    [...new Set(all.filter((p) => p.category === c && p.sub).map((p) => p.sub))],
  ])
)

// ---------- Interleave ----------

// Mix lists together so similar pieces don't bunch up.

// Takes several lists and returns one list that alternates between them:
// [[A1, A2, A3], [B1, B2]] becomes [A1, B1, A2, B2, A3].
const interleave = (lists) => {
  const out = []
  // Keep going while at least one list still has an item at position i
  for (let i = 0; lists.some((l) => i < l.length); i++) {
    // Take the item at position i from each list. The && skips a list that has run out,
    // because l[i] is undefined and the push is never reached.
    lists.forEach((l) => l[i] && out.push(l[i]))
  }
  return out
}

// ---------- Projects for a tab ----------

// Projects for a tab and optional sub-tab.

// category and sub both default to 'All', which means "don't filter by this".
export function getProjects(category = 'All', sub = 'All') {
  // Case 1: no category filter. Get every tab's items and interleave them,
  // so the grid mixes different kinds of work instead of showing one tab after another.
  if (category === 'All') {
    return interleave(CATEGORIES.map((c) => getProjects(c)))
  }

  // All the items in the chosen main tab
  const inCategory = all.filter((p) => p.category === category)

  // Case 2: a specific sub-tab was chosen, so only return items from that sub-tab
  if (sub !== 'All') {
    return inCategory.filter((p) => p.sub === sub)
  }

  // Case 3: the whole main tab. First check whether this tab has any sub-tabs.
  const subs = SUBCATEGORIES[category]

  // No sub-tabs: just return the items in order
  if (!subs.length) {
    return inCategory
  }

  // Has sub-tabs: interleave the sub-tabs so they are mixed together, with any items that
  // aren't in a sub-tab (!p.sub) added as one more list at the end
  return interleave([
    ...subs.map((s) => inCategory.filter((p) => p.sub === s)),
    inCategory.filter((p) => !p.sub),
  ])
}

// Every item, mixed across all tabs
export const PROJECTS = getProjects()

// ---------- Link to a tab on the Our Work page ----------

// Link to a tab on the Our Work page.

// Builds a link like "/portfolio?category=Design%20%26%20Print&sub=Brochures".
// URLSearchParams builds the part after the ? and automatically encodes special characters
// such as spaces and "&" so they don't break the link.
export const workLink = (category, sub) => {
  const params = new URLSearchParams()
  if (category) params.set('category', category)   // Only added if a category was given
  if (sub) params.set('sub', sub)                  // Only added if a sub-tab was given
  const q = params.toString()
  // If nothing was added, link to the plain portfolio page without a "?"
  return q ? `/portfolio?${q}` : '/portfolio'
}

// ---------- Get a specific work item ----------

// Finds one item by its path (for example 'Lapel badges/lapel_6.jpg') and returns a copy of it with
// a link to its tab added. Used by AboutHero and WorkGrid, which list items by path.
export function getWork(path) {
  const item = all.find((p) => p.path === path)

  // If no item matches (for example a typo or a deleted file), warn in the browser console
  // and return null. The code that calls this checks for null so it can skip the missing item.
  if (!item) {
    console.warn(`Work item not found in src/assets/work: ${path}`)
    return null
  }

  return {
    ...item,                                       // Copy everything from the item
    link: workLink(item.category, item.sub),       // Add a link to the item's tab on the Our Work page
  }
}

/* =============================================================================
   REFERENCES
   -----------------------------------------------------------------------------
   Vite Docs: Glob import (import.meta.glob and its eager and import options,
   used to load every image in the work folder)
   https://vite.dev/guide/features.html#glob-import

   MDN Web Docs: String.prototype.localeCompare (the numeric option that sorts
   "mockup 2" before "mockup 10")
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare

   MDN Web Docs: URLSearchParams (builds the ?category=...&sub=... part of the
   links and encodes special characters safely)
   https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
   ============================================================================= */

// ---------------------------------- END OF FILE ---------------------------------- //