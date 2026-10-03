/* =============================================================================
   CLIENT LOGOS DATA MODULE (clients.js)
   -----------------------------------------------------------------------------
   Purpose:
   Builds the list of client logos shown on the Our Clients page of the
   Nado Graphics website. Instead of writing every logo out by hand, the list
   is created automatically from the image files in src/assets/Logos/, so adding
   a client only requires dropping their logo file into that folder.

   What it exports:
   - CLIENT_LOGOS: an array of objects, one per client, each with:
       file -> the image's file name
       src  -> the image's address, ready to use in an <img> tag
       name -> a readable client name, used for screen readers and hover text

   How it works (in order):
   1. Load every image in the Logos folder (import.meta.glob).
   2. Turn each file into an object and work out a readable name for it.
   3. Remove the files listed in SKIP (extra versions of a logo).
   4. Keep only one logo per client name.
   5. Sort the list: clients named in FIRST come first, in that order, and
      everything else follows alphabetically by name.

   Settings you can change:
   - FIRST : which logos appear at the top, and in what order.
   - SKIP  : which files to leave out.
   - NAMES : the proper display name for each logo file.
   ============================================================================= */

/*
  Client logos for the Our Clients page, loaded automatically from src/assets/Logos/.
  To add a client: drop their logo into that folder (png, jpg, svg, webp or avif).
*/
 
// These appear first, in this order. Each entry matches the start of a file name (not case-sensitive).
// Note that 'UP ' has a space on the end on purpose, so it only matches file names that start with
// "UP " and not any file that merely starts with the letters "UP".
const FIRST = ['UWC', 'UCT Logo', 'UCT Sport', 'UP ', 'Stellenbosch_University', 'MatiesSport', 'Melomed', 'CCLogo']
 
// Files to leave out (extra versions of the same logo)
// Each entry is a regular expression (a pattern) that is tested against the file name.
// A file is dropped if any pattern matches.
const SKIP = [
  // Drops any file with "vertical" anywhere in its name. The i at the end means "ignore upper/lower case".
  /vertical/i,
  // The white-text version of the FISU logo: it disappears on a white background.
  // (If it is the other file that is white, change this to /final 3\.png$/i)
  // The $ means "at the end of the name", and \. is a literal dot, so this matches names ending in "logos-final.png".
  /logos-final\.png$/i,
]
 
// Names for screen readers and hover text. Matched against the start of the file name.
// The FIRST match wins, so put the more specific names (like 'UCT Sport') above the general ones ('UCT').
// Each entry is a pair: [start of the file name, readable name to show].
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
 
// Loads every image in the Logos folder when the site is built (a Vite feature).
// The result is an object where each key is a file path and each value is the image's address.
//   eager: true      -> load everything immediately, instead of on demand
//   import: 'default' -> give the image address directly, instead of a wrapper object around it
// The pattern lists each allowed file type in both lower case and upper case, because
// file matching here is case-sensitive.
const files = import.meta.glob('../assets/Logos/*.{png,jpg,jpeg,svg,webp,avif,PNG,JPG,JPEG,SVG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
})
 
// Helper: true if the file name starts with the given text, ignoring upper/lower case.
// Both sides are converted to lower case before comparing.
const startsWith = (file, key) => file.toLowerCase().startsWith(key.toLowerCase())
 
// Works out the readable name for a file.
const nameFor = (file) => {
  // Look through NAMES for the first pair whose key matches the start of the file name.
  // ([key]) takes just the first item of each pair (the key) so it can be compared.
  const match = NAMES.find(([key]) => startsWith(file, key))
  // If a match was found, use its readable name (the second item of the pair)
  if (match) return match[1]
  // Fallback: tidy the file name, e.g. "Some-Client_logo.png" -> "Some Client"
  // Step by step: remove the file extension, remove the word "logo" wherever it appears,
  // turn runs of underscores and dashes into single spaces, then trim spaces from the ends.
  return file.replace(/\.[^.]+$/, '').replace(/logo/gi, '').replace(/[_-]+/g, ' ').trim()
}
 
// Remembers which client names have already been used, so duplicates can be removed below.
// A Set only stores each value once.
const seen = new Set()
 
// The final list that other files import
export const CLIENT_LOGOS = Object.entries(files)
  // Turn the files object into an array of [path, src] pairs, then turn each pair into a logo object
  .map(([path, src]) => {
    // The path looks like "../assets/Logos/UWC.png". Splitting at "/" and taking the last piece gives the file name.
    const file = path.split('/').pop()
    return { file, src, name: nameFor(file) }
  })
  // Remove any logo whose file name matches one of the SKIP patterns
  .filter((logo) => !SKIP.some((rule) => rule.test(logo.file)))
  // Only one logo per client
  // Keep a logo only if its name hasn't been seen yet. The first logo for each name is kept and any
  // later ones are dropped, so which one survives depends on the order the files were loaded in.
  .filter((logo) => {
    if (seen.has(logo.name)) return false
    seen.add(logo.name)
    return true
  })
  // Sort the list. The function returns a negative number to put a before b, positive to put it after, 0 if equal.
  .sort((a, b) => {
    // A logo's rank is its position in FIRST. A logo not in FIRST gets the highest rank
    // (the length of FIRST), which puts it after all the listed ones.
    const rank = (logo) => {
      const i = FIRST.findIndex((key) => startsWith(logo.file, key))
      return i === -1 ? FIRST.length : i
    }
    // Compare by rank first. If the ranks are equal, the subtraction gives 0, which counts as "false",
    // so || moves on to compare the names alphabetically instead.
    // localeCompare handles letters and accents the way a person would expect.
    return rank(a) - rank(b) || a.name.localeCompare(b.name)
  })

/* =============================================================================
   REFERENCES
   -----------------------------------------------------------------------------
   Vite Docs: Glob import (import.meta.glob and its eager and import options,
   used to load every logo in the folder)
   https://vite.dev/guide/features.html#glob-import

   MDN Web Docs: Array.prototype.sort (how the comparison function decides the
   order, including the rank-then-name pattern)
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

   MDN Web Docs: String.prototype.localeCompare (alphabetical comparison of the
   client names)
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
   ============================================================================= */

// ---------------------------------- END OF FILE ---------------------------------- //