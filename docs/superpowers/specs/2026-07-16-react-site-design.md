---
title: Cadwell Windows — React Site Rebuild
date: 2026-07-16
status: approved
---

# Cadwell Windows — React Site Rebuild

## Overview

Rebuild the existing WordPress site at cadwellwindows.com as a static React app deployed to AWS S3. The React site will be a faithful visual reproduction of the current site — same content, same layout, same design — with clean URL routes for new visitors and backward-compatible redirects for existing WordPress URLs.

## Source Material

The WordPress site has been mirrored locally to `site-mirror/www.cadwellwindows.com/`. This includes:
- All 5 pages of HTML
- All CSS stylesheets (theme: GuCherry Blog / Cormorant Garamond + Poppins)
- 208 image assets in `wp-content/uploads/`

## Pages

| Page | Clean URL | WordPress URL (redirects to clean) |
|------|-----------|-------------------------------------|
| Home | `/` | (none needed) |
| About | `/about` | `/index.php/about/` |
| Portfolio | `/portfolio` | `/index.php/portfolio/` |
| Drawings | `/drawings` | `/index.php/drawings-technical/` |
| Contact | `/contact` | `/index.php/contact/` |

## Visual Design

Faithful reproduction of the existing site. All design values sourced from the downloaded CSS.

**Fonts (Google Fonts):**
- Headings / site title: Cormorant Garamond, bold (400, 700)
- Body / nav: Poppins (400, 500, 600, 700)
- Loaded with `display=swap` for fast initial render

**Colors:**
- Background: `#ffffff`
- Body text: `#222222`
- Borders / dividers: `#f5f5f5`

**Header layout (per page):**
- Site title "Cadwell Windows" — Cormorant Garamond, 52px bold, centered, scrolls with page
- Tagline "Period Appropriate Windows, Doors and Woodwork | Warwick Massachusetts" — Poppins, centered, below title
- Nav bar — `position: fixed`, white background, 1px `#f5f5f5` border top/bottom, nav links centered, `text-transform: uppercase`, Poppins 500

**Footer:** white background, centered "Copyright © 2020 Cadwell Windows", fixed position

**Custom CSS rules from original site:**
- `.page-title { display: none }` — H1 page titles hidden
- `.breadcrumb-entry { display: none }` — breadcrumbs hidden
- `* { margin: 0 }` — margin reset

## Architecture

**Stack:** Vite + React 18 + React Router v6

**Project structure:**
```
cadwellwindows/
├── public/
│   └── images/          ← all 208 photos copied from site-mirror
├── src/
│   ├── components/
│   │   ├── Header.jsx   ← site title + tagline + fixed nav
│   │   └── Footer.jsx   ← fixed copyright bar
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Drawings.jsx
│   │   └── Contact.jsx
│   ├── App.jsx          ← BrowserRouter + routes + Layout wrapper
│   └── index.css        ← all styles
├── index.html
├── vite.config.js
└── package.json
```

## Routing

React Router v6 with `BrowserRouter`. All routes are handled client-side:

```jsx
// Clean routes
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/portfolio" element={<Portfolio />} />
<Route path="/drawings" element={<Drawings />} />
<Route path="/contact" element={<Contact />} />

// Legacy WordPress redirects
<Route path="/index.php/about/" element={<Navigate to="/about" replace />} />
<Route path="/index.php/portfolio/" element={<Navigate to="/portfolio" replace />} />
<Route path="/index.php/drawings-technical/" element={<Navigate to="/drawings" replace />} />
<Route path="/index.php/contact/" element={<Navigate to="/contact" replace />} />
```

## Content (per page)

**Home:** Hero image (IMG_1981-1-1024x768.jpg) + body text about Jack Cadwell's woodworking specialty.

**About:** Bio text + 6 workshop photos (Jack in shop, shaper blade, custom knives, planer, jointer, tenoner).

**Portfolio:** 12 projects, each with a title, description paragraph, and 1–10 photos. Projects:
1. Elliptical Transom (6 photos)
2. Five Curve Casement Window (4 photos)
3. Arrowhead / Herman Melville House (5 photos)
4. Enfield Shaker Village (8 photos)
5. Gore Place Mansion (4 photos)
6. Samuel Harrison House (2 photos — before/after)
7. Woodstock Connecticut Residence (4 photos)
8. Mission House Fence and Arbor (10 photos)
9. Rehoboth Residence (2 photos)
10. Springfield Historical Museum (2 photos)
11. Royalston Residence (1 photo)
12. Wyman House (4 photos)

**Drawings:** Two sections — Custom Made Profile Cutters (image gallery of cutters + technical drawings) and AutoCAD Drawings (sample Petersham Windows drawing). Text explains the fabrication and documentation process.

**Contact:** Address (122 Hastings Pond Rd., Warwick MA 01378), phone ((978) 429-7947), email (cadwelljack@gmail.com), and note about preferring phone calls. No form — contact info only.

## Images

- Source: `site-mirror/www.cadwellwindows.com/wp-content/uploads/2020/08/` (208 files)
- Destination: `public/images/` (flat directory, same filenames)
- All images use `loading="lazy"` to keep initial page load fast
- The portfolio page (60+ images) benefits most from lazy loading

## Mobile

- Nav collapses to a hamburger menu (3 bars) on small screens, matching the original WordPress theme behavior
- Site title font size scales down responsively (52px → 42px → 36px → 32px → 28px → 26px), matching original CSS breakpoints
- Site description (tagline) hidden on mobile (matches original)
- Images use `max-width: 100%` and stack vertically
- No horizontal scrolling

## S3 Deployment

1. `npm run build` produces `dist/` — contains compiled JS/CSS, `index.html`, and all `public/` assets including images
2. Upload `dist/` contents to the S3 bucket configured as a static website
3. **One required S3 setting:** set the error document to `index.html` — this is what makes React Router's client-side routing and legacy URL redirects work
4. No other S3 configuration needed (no CloudFront, no routing rules)

## Out of Scope

- Contact form (original site has none — just contact info)
- CloudFront CDN
- Any content changes from the original site
- New features beyond faithful reproduction
