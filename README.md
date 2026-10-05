# Nado Graphics – Portfolio Website

**Part of the Nado System Suite by SynStax Solutions**

- Team Member's Meeting Attendance : 100% - All present for every meeting
- Repository to the second repo containing the Nado Graphics Management System: https://github.com/SynStax-Solutions/SynStax-Solutions-Nado-System-Suite.git

- Live site: https://nadographics.com


Youtube URLs:
// Unverified account: maximum 15 minutes per video
1. Portfolio Website YouTube Demo: https://youtu.be/3p0sxSJpWpI
2. Management System YouTube Demo: https://youtu.be/SgdxLigqML0


The public-facing website for **Nado Graphics**, a Cape Town design and print agency established in 2000. The site showcases the agency's work, services and clients, and gives potential customers a quick, familiar way to get in touch.

This repository is one of two in the Nado System Suite:

| Repository | Description |
|---|---|
| **Portfolio Website** (this repo) | Public website built with React + Vite |
| **Business Management System (BMS)** | Internal staff system built with ASP.NET Core (.NET 10) and SQL Server |


---

## About the Project

Nado Graphics is a creative agency, so its website has to do more than list information. It has to *show* the quality of the work. Our goal was a site that feels modern and confident, lets the portfolio speak for itself, and makes contacting the agency as easy as possible.

The guiding idea behind the whole design was **"let the work be the colour."** The interface itself stays mostly black, white and grey, so the agency's brightly coloured print, merchandise and animation work stands out. A single brand colour, the yellow from the Nado Graphics logo, is used sparingly to guide the user's attention.

---

## Pages

### Home

The Home page is the first impression, so it is built to be memorable.

- **Animated hero:** A black stick figure pushes the rolling Nado logo across the screen, the Nado Graphics' logo falls infront of him and he gets a lightbulb moment, then uses the logo to fill the slogan (pushes the logo until the headline fills with yellow). It is a playful nod to the hard work that goes into every project, and it gives the site personality from the first second.
- **Introduction to the agency:** A short overview of who Nado Graphics is, with a **"Read our story"** button that links straight to the *Our philosophy* section on the About page instead of the top of the page.
- **Calls to action:** Buttons such as "Explore our work" guide visitors to the portfolio.
- **Rotating logo:** The Nado logo turns as the user scrolls past the story section, giving a sense of movement and progress.
- **Kite-on-a-string scroll animation:** As the user scrolls, a kite on a string connects one section to the next, visually leading the eye down the page.
- **Scrolling marquee and photo strip:** A slow-moving text marquee and an auto-sliding photo strip that pauses on hover.

### About Us

Tells the story of Nado Graphics, from its founding in 2000 to today.

- **Our story / Our philosophy:** The agency's history and values.
- **Scroll-lit text:** A key paragraph lights up word by word as the user scrolls, so it reads like the story is being told in real time and encourages people to actually read it.
- **Stacking step cards:** Approach and values are shown as cards that stack on top of each other as the visitor scrolls.

### Our Work

The heart of the site: a portfolio of the agency's past projects.

- **Category tabs:** Work is grouped into main categories such as *Design & Print*, *Merchandise*, *Video Animation* and *Lapel Badges*.
- **Sub-category tabs:** Each category can be broken down further (for example *Brochures* under Design & Print, *Apparel* under Merchandise), so visitors can find exactly the type of work they are interested in.
- **Images and video:** The gallery supports both images and `.mp4` video, which is important for showing animation work.
- **Lightbox viewer:** Clicking a piece opens it full screen, with previous/next arrows, a caption and a count.
- **Automatic loading:** The categories and tabs are built from the folder structure, so new work can be added without touching the code (see [Adding New Work Samples](#adding-new-work-samples)).

### Our Services

A clear overview of what Nado Graphics offers.

- **Icon-based grid:** Each service is shown as a card with an icon, so visitors can scan the full range of services quickly.
- This was originally a section on the Home page. We moved it to its own page so the Home page stays focused and each service gets more room.

### Our Clients

Builds trust by showing the brands Nado Graphics has worked with.

- **Logo wall:** Client logos (universities, sports bodies, hospitals and research centres) are displayed together in a clean grid.
- **Yellow banner:** An intro banner with slowly rotating ring artwork.
- This was originally part of the About page. Giving it a dedicated page makes the client list easier to find and lets it grow over time.

### Contact

Designed so visitors can reach Nado Graphics in whichever way suits them: a quick enquiry form that feeds into the BMS, plus direct contact links.

- **Enquiry form:** Visitors fill in their details and message and send an enquiry straight from the site. On success they see "Thanks, your enquiry is on its way."
- **Validation and consent:** Fields are validated with clear inline error messages, and the visitor must tick a consent box that links to the Privacy page before sending.
- **Spam protection:** A hidden honeypot field catches bots, and the backend limits each visitor to **3 enquiries per 10 minutes**.
- **Direct contact links:** WhatsApp, email, phone and Google Maps links open the right app with details already filled in.
- **Where enquiries go:** Each enquiry is saved in the BMS (Enquiries page) and emailed to the agency's enquiries inbox. See [Connection to the BMS](#connection-to-the-bms).

### Privacy

A plain-language privacy policy explaining what personal information the contact form collects and how it is used. It is linked from the footer and from the form's consent checkbox.

### Navigation bar and footer (on every page)

- **Sticky navbar:** Stays at the top of the screen while scrolling, with a slightly see-through, blurred white background so content scrolling underneath is still faintly visible.
- **Layout:** Logo on the left, page links in the centre, and a black **"Start a project"** pill button on the right. On smaller screens the links collapse into a menu button.
- **Active and hover underline:** A yellow underline slides in under a link on hover and stays under the page you are currently on.
- **Footer:** Includes a "Let's talk" call to action, contact details and a Privacy link so visitors are always one click from getting in touch.

---

## Key Features

| Feature | Description |
|---|---|
| **Custom SVG animations** | Stick-figure hero, kite-on-a-string, rotating logo and scroll-lit text, all built in-house with SVG and CSS/JavaScript rather than video, so they stay sharp and load quickly. |
| **Auto-loading portfolio** | Uses Vite's `import.meta.glob` to discover images and videos from `src/assets/work/` and build the category tabs automatically. |
| **Enquiry form linked to the BMS** | Website enquiries are sent to the BMS API, stored for staff to follow up, and emailed to the agency. |
| **One-tap contact** | WhatsApp, email, phone and maps links open the right app with details already filled in. |
| **Fully responsive** | Layouts adapt from large desktop screens down to mobile phones. Long text such as email addresses wraps properly on small screens. |
| **Smart scrolling** | Normal links open new pages at the top. Section links (e.g. `/about#philosophy`) jump straight to that section, with space left so the sticky navbar does not cover the heading. |
| **Safe animations** | Animations clean up after themselves if a visitor leaves the page mid-animation, preventing errors in the background. |
| **Reduced-motion support** | Animations switch off for visitors who have asked their device to reduce motion. |
| **Design tokens** | All colours, fonts, spacing and corner sizes are defined in one file (`tokens.css`), so the look of the whole site can be updated from one place. |

---

## Design Choices

### Minimal, monochrome base

The site is built on white pages with black type and soft greys. A design agency's portfolio is full of colour, so a neutral background avoids competing with the work and makes each project the focus.

### One accent colour, used with purpose

Instead of using many colours, the site uses a single accent: **Nado yellow**. It is reserved for things we want people to notice or interact with: button hovers, the navbar underline, the WhatsApp contact card and the headline in the Home animation. Because yellow appears so rarely, it immediately draws the eye when it does.

### From orange to brand yellow

Early versions of the site used orange as the accent colour. We replaced it with the exact yellow from the Nado Graphics logo (`#fabe3d`) so that the website and the brand identity match. The logo in the navbar is also shown in its original yellow instead of being turned black.

### Readability on yellow

When a button turns yellow on hover, its text changes from white to black. White text on yellow is hard to read, while black on yellow has strong contrast and matches how the logo looks against dark backgrounds.

### Pill buttons, rounded cards and hairline dividers

- **Pill-shaped buttons** feel friendly and modern, and are easy to recognise as clickable.
- **Rounded corners** on cards and panels soften the black-and-white palette.
- **Thin "hairline" dividers** separate sections without adding visual weight.

### Simple layouts with moments of play

Page layouts were kept clean and uncluttered. Earlier drafts that felt bulky or busy were simplified. Personality comes from a few deliberate animated moments (the stick man, the kite, the rotating logo) rather than from decoration on every section, which keeps the site fun without feeling chaotic.

### Content split into focused pages

Services and Clients started out as sections inside the Home and About pages. We gave each its own page so that every page has one clear job, and so that the Home page stays short and focused on first impressions. The "NADO GRAPHICS" text next to the logo was removed from the navbar to make room for the extra links.

### A form alongside quick-contact links

The Contact page originally offered only one-tap cards (WhatsApp, email, call, map). We added an enquiry form so that enquiries are captured in the BMS and can be tracked by staff, while keeping the quick links for visitors who prefer to reach out directly.

---

## Colour Palette

| Colour | Hex | Token | Used for |
|---|---|---|---|
| White (Paper) | `#ffffff` | `--paper` | Page backgrounds |
| Black (Ink) | `#000000` | `--ink` | Headings, body text, primary buttons, card hovers |
| Nado Yellow | `#fabe3d` | `--yellow` | Accent: button hovers, navbar underline, logo, WhatsApp card, Home headline fill |
| Muted Grey | `#9a9a9a` | `--muted` | Grey second line of headlines |
| Secondary Text | `#5c5c5c` | `--text-2` | Supporting body text |
| Soft Grey | `#f2f2f2` | `--soft` | Grey pill buttons and background panels |
| Hairline | `#e7e7e7` | `--line` | Thin dividers on light backgrounds |
| Hairline (dark) | `#262626` | `--line-dark` | Thin dividers on black backgrounds |

All colours live in `src/styles/tokens.css`. To change a colour across the whole site, change it there.

---

## Typography

- **Font:** [Manrope](https://fonts.google.com/specimen/Manrope), with Helvetica Neue and Arial as fallbacks.
- **Why Manrope:** It is a clean, modern sans-serif that is easy to read at small sizes and still looks bold and confident in large headlines. Using one font family for headings and body text keeps the site consistent and uncluttered.
- **Two-tone headlines:** Many headlines have a black first line and a grey second line, which creates hierarchy without needing extra colours or font sizes.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [React](https://react.dev/) | UI library |
| [Vite](https://vitejs.dev/) | Build tool and dev server; `import.meta.glob` powers the auto-loading portfolio |
| [React Router](https://reactrouter.com/) | Client-side routing between pages |
| CSS (per-component stylesheets + design tokens) | Styling, layout and animations |
| SVG | Logo, icons and custom animations |
| IIS `web.config` | Makes page refreshes and direct links work on the live Windows host |
| Afrihost (SolidCP) | Hosting for the live website |
| BMS API (ASP.NET Core) | Receives enquiries from the contact form |

---

## Project Structure

```
nado-graphics-website/
├── public/                     # Static files served as-is
│   ├── favicon.svg
│   ├── icons.svg
│   └── web.config              # IIS settings: React route rewrite + image MIME types
├── src/
│   ├── assets/
│   │   └── work/               # Portfolio samples, organised by category
│   │       ├── Design & Print/
│   │       │   └── Brochures/
│   │       ├── Merchandise/
│   │       │   └── Apparel/
│   │       ├── Video Animation/
│   │       └── Lapel badges/
│   ├── components/
│   │   ├── layout/             # Navbar, footer
│   │   ├── sections/           # Page sections (Hero, About, Story, etc.)
│   │   └── ui/                 # Reusable elements such as Button
│   ├── pages/                  # One file (plus CSS) per page, incl. ContactPage.jsx
│   ├── styles/
│   │   └── tokens.css          # Colours, fonts, spacing and radii
│   ├── ScrollToTop.jsx         # Scroll handling on page change
│   ├── App.jsx                 # Routes
│   └── main.jsx                # Entry point
├── .env.development            # VITE_API_URL for local development
├── .env.production             # VITE_API_URL for the live build
├── index.html
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nado-graphics-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:5173`.

### Other Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build in the `dist/` folder |
| `npm run preview` | Preview the production build locally |

---

## Environment Configuration

The website needs to know where the BMS API lives so the contact form can send enquiries. This is set with one variable, `VITE_API_URL`, in two files in the project root (next to `package.json`):

| File | Used by | Contents |
|---|---|---|
| `.env.development` | `npm run dev` | `VITE_API_URL=http://localhost:5295` |
| `.env.production` | `npm run build` | `VITE_API_URL=https://nadographicsapi.runasp.net` |

Vite picks the right file automatically: development values when you run `npm run dev`, production values when you run `npm run build`. The variable is read in the contact page (`src/pages/ContactPage.jsx`).

> Vite only reads these files when it starts. If you change one, stop and restart `npm run dev` (or re-run `npm run build`).

---

## Running Locally 

**This project is live in production.** The code in this repository is configured for the live environment at [nadographics.com](https://nadographics.com), including the live URL of the BMS API. The BMS itself also has production settings (database connection and email) in its own repository.

To run the project on your own machine, **you will need to replace the production settings with your own local ones.** If you skip this step, the site may try to connect to the live system or fail to connect at all.

### 1. Run the BMS locally first

Follow the **BMS repository README** to create the local database, run the scripts and start the BMS. Note the port it starts on (shown in Visual Studio or the terminal).

### 2. Point the website at your local BMS

Set the API URL in **`.env.development`** (project root) to your local BMS address:

```
VITE_API_URL=http://localhost:<your-bms-port>
```

The repository's default is `http://localhost:5295`. If your BMS starts on a different port, change it here. Do **not** use the `https://nadographicsapi.runasp.net` address, as that is the live system and would send test enquiries to the real agency.

| Setting | Production value | Change to (example) |
|---|---|---|
| Website URL | `https://nadographics.com` | `http://localhost:5173` |
| BMS API URL (`VITE_API_URL`) | `https://nadographicsapi.runasp.net` (`.env.production`) | `http://localhost:5295` (`.env.development`) |

### 3. Update the BMS connection strings (BMS repository)

The BMS database connection strings point to the **production database**. Replace them with a connection string for your own local SQL Server instance.

Example of a local connection string:

```
Server=YOUR_PC_NAME\SQLEXPRESS;Database=YOUR_DATABASE_NAME;Trusted_Connection=True;TrustServerCertificate=True;
```

- Replace `YOUR_PC_NAME\SQLEXPRESS` with your SQL Server instance name (shown when you connect in SSMS).
- Replace `YOUR_DATABASE_NAME` with the name of the database you created locally.

The BMS also has a `PaInbox` email setting in `appsettings.Production.json` that controls where new-enquiry emails are sent. Change or remove it locally so test enquiries do not email the agency.

### 4. Restart and test

1. Save your changes.
2. Start the BMS first, then the website (`npm run dev`).
3. Open `http://localhost:5173`, check that the pages load, and send a test enquiry from the Contact page.
4. Confirm the enquiry appears on the **Enquiries** page of your local BMS.

> **Please do not commit your local settings back to the repository.** The production values must stay in place for the live site.

---

## Deployment

The website is a static site hosted on **Afrihost** (Windows hosting managed through **SolidCP**, running IIS), and the BMS API is hosted separately on **runasp.net**. Deploying means building the site on your computer and uploading the result.


---

## Connection to the BMS

Enquiries made through the website feed into the **Nado Graphics Business Management System**, so staff can track and respond to potential clients from one place.

**How it works**

1. A visitor completes the form on the Contact page and ticks the consent box.
2. The website sends the enquiry to the BMS API at the address in `VITE_API_URL`.
3. The BMS validates the enquiry, applies the rate limit (3 enquiries per 10 minutes per visitor), and saves it.
4. The enquiry appears on the **Enquiries** page in the BMS for staff to follow up.
5. The BMS also emails the agency's enquiries inbox. The recipient is set by the `PaInbox` → `Email` setting in the backend's `appsettings.Production.json`.


---

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| **500 error on the whole site** | A problem in `web.config` (for example a typo or a rule the host doesn't support). Remove `web.config` from `wwwroot` to confirm, then fix and re-upload. |
| **Refreshing a page gives a 404** | `web.config` is missing from `wwwroot`. Re-upload it. |
| **Blank white page, and the console says a module script has the wrong MIME type "text/html"** | The `index-….js` file that `index.html` asks for is not in `wwwroot/assets/`, so the rewrite rule returns `index.html` instead. Upload the matching JS and CSS files into `assets`. If the files are present, clear the browser cache or test in an Incognito window. |
| **One image shows a broken icon or a 404** | Check the file is in `wwwroot/assets/`. For `.avif` or `.webp` files, check the MIME type entries in `web.config`. Converting the image to `.jpg` or `.png` also avoids the problem. |
| **Contact form says "Something went wrong"** | Open the browser console (F12) and check the error. Check `VITE_API_URL`, that the backend is running, and remember the limit of 3 enquiries per 10 minutes. |
| **"Not secure" warning** | The SSL certificate is missing or has expired. Redo the HTTPS steps in [Deployment](#deployment). |
| **Changes don't show after upload** | The browser has cached the old page. Hard refresh with **Ctrl+F5**, or test in an Incognito window. |


---

© Nado Graphics. Developed by SynStax Solutions.
