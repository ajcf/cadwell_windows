# Cadwell Windows React Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a faithful static React reproduction of cadwellwindows.com and deploy it to AWS S3.

**Architecture:** Vite + React 18 SPA with React Router v6. `App.jsx` owns `BrowserRouter`; `AppRoutes.jsx` owns all routes and the layout — separating them enables testing with `MemoryRouter` without re-wrapping. Global CSS in `src/index.css` replicates the original GuCherry Blog WordPress theme. Images are pre-downloaded in `site-mirror/wp-content/uploads/2020/08/` and copied to `public/images/`. The compiled `dist/` folder (which includes all `public/` assets) is uploaded to S3.

**Tech Stack:** Vite 5, React 18, React Router v6, Vitest, @testing-library/react, @testing-library/jest-dom, jsdom

---

## File Map

| File | Responsibility |
|------|----------------|
| `public/images/` | 208 photos copied from site-mirror |
| `src/index.css` | Google Fonts import, CSS reset, all layout and component styles |
| `src/test/setup.js` | @testing-library/jest-dom setup for Vitest |
| `src/components/Header.jsx` | Site title, tagline, sticky nav bar, hamburger toggle |
| `src/components/Footer.jsx` | Fixed copyright bar |
| `src/App.jsx` | BrowserRouter wrapper only |
| `src/AppRoutes.jsx` | Layout (Header+Footer+Outlet), all routes, legacy WP redirects |
| `src/data/portfolio.js` | Array of 12 portfolio projects with titles, captions, image filenames |
| `src/data/drawings.js` | Two drawing sections with titles, text, image galleries |
| `src/pages/Home.jsx` | Hero image + body text |
| `src/pages/About.jsx` | Bio text + 6 workshop photos |
| `src/pages/Portfolio.jsx` | 12 project sections rendered from portfolio.js |
| `src/pages/Drawings.jsx` | Two sections rendered from drawings.js |
| `src/pages/Contact.jsx` | Address, phone, email, note |
| `vite.config.js` | Vite plugin + Vitest environment config |

---

### Task 1: Project Scaffold

**Files:**
- Create: `vite.config.js` (modified from scaffold)
- Create: `src/test/setup.js`
- Modify: `package.json` (add test scripts)
- Create: `.gitignore`

- [ ] **Step 1: Scaffold Vite React project**

Run from `/Users/ajcf/projects/cadwellwindows/`:
```bash
npm create vite@latest . -- --template react
```
When prompted about non-empty directory, choose to continue. This creates `src/App.jsx`, `src/main.jsx`, `index.html`, `vite.config.js`, `package.json`.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install react-router-dom
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Vitest in vite.config.js**

Replace the contents of `vite.config.js` with:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
```

- [ ] **Step 4: Create test setup file**

Create `src/test/setup.js`:
```js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test scripts to package.json**

In `package.json`, inside the `"scripts"` object, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Update .gitignore**

Append to `.gitignore`:
```
site-mirror/
.superpowers/
```

- [ ] **Step 7: Verify test runner works**

```bash
npm test
```
Expected: exits cleanly (no test files found yet — that's fine).

- [ ] **Step 8: Commit**

```bash
git add vite.config.js src/test/setup.js package.json package-lock.json .gitignore index.html
git commit -m "chore: scaffold Vite React project with Vitest"
```

---

### Task 2: Copy Image Assets

**Files:**
- Create: `public/images/` (208 image files)

- [ ] **Step 1: Copy images from the downloaded WordPress mirror**

```bash
mkdir -p public/images
cp site-mirror/www.cadwellwindows.com/wp-content/uploads/2020/08/* public/images/
```

- [ ] **Step 2: Verify the count**

```bash
ls public/images/ | wc -l
```
Expected: `208`

- [ ] **Step 3: Commit**

```bash
git add public/images/
git commit -m "chore: add WordPress site images to public/images"
```

---

### Task 3: Global CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace src/index.css with all site styles**

Replace the entire contents of `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap');

/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
}

body {
  font-family: 'Poppins', sans-serif;
  color: #222;
  background: #fff;
}

/* Logo block */
.gc-logo-block {
  text-align: center;
  padding: 20px 0 12px;
  background: #fff;
}

.site-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 52px;
  font-weight: 700;
  color: #222;
  line-height: 1.3;
  text-decoration: none;
  display: block;
}

.site-title:hover {
  color: #444;
}

.site-description {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: #555;
  margin-top: 6px;
}

/* Nav bar — sticky, stays at top once logo scrolls away */
.bottom-header {
  position: sticky;
  top: 0;
  z-index: 9999;
  background: #fff;
  width: 100%;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  padding: 15px 0;
}

.primary-menu {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 28px;
}

.primary-menu a {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #222;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.primary-menu a:hover,
.primary-menu a.active {
  color: #666;
}

/* Hamburger button — hidden on desktop */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 4px;
  background: none;
  border: none;
  margin: 0 auto;
}

.hamburger-bar {
  display: block;
  width: 24px;
  height: 2px;
  background: #222;
}

/* Main content — bottom padding reserves space for fixed footer */
.main-content {
  padding-bottom: 50px;
}

/* Page content container */
.page-content {
  padding: 28px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.page-content p {
  font-size: 15px;
  line-height: 1.75;
  margin-bottom: 16px;
}

.page-content a {
  color: #222;
}

.page-content h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin: 32px 0 16px;
  color: #222;
}

.page-content h4 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin: 32px 0 16px;
  color: #222;
}

/* Gallery grid */
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 16px 0;
}

.gallery-2 {
  grid-template-columns: repeat(2, 1fr);
}

.gallery-1 {
  grid-template-columns: 1fr;
}

.gallery figure {
  margin: 0;
}

.gallery img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.gallery figcaption {
  font-size: 12px;
  color: #666;
  text-align: center;
  padding: 4px 0;
}

.gallery-caption {
  font-size: 14px;
  color: #444;
  font-style: italic;
  text-align: center;
  margin: 8px 0 28px;
  line-height: 1.6;
}

/* Single centered image (About hero, Drawings autocad) */
.centered-figure {
  text-align: center;
  margin: 0 0 20px;
}

.centered-figure img {
  max-width: 100%;
  display: inline-block;
}

.centered-figure figcaption {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* Footer — fixed at bottom */
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  border-top: 1px solid #f5f5f5;
  padding: 12px 0;
  z-index: 9999;
}

.copyright-info {
  text-align: center;
  font-size: 12px;
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .site-title { font-size: 42px; }
  .site-description { display: none; }

  .primary-menu {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    display: none;
    padding: 16px 0;
  }

  .primary-menu.open {
    display: flex;
  }

  .menu-toggle {
    display: flex;
  }

  .gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .site-title { font-size: 36px; }
}

@media (max-width: 480px) {
  .site-title { font-size: 32px; }
  .gallery { grid-template-columns: 1fr; }
}

@media (max-width: 380px) {
  .site-title { font-size: 28px; }
}
```

- [ ] **Step 2: Delete the Vite scaffold's App.css**

```bash
rm src/App.css
```

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add global CSS matching original GuCherry Blog theme"
```

---

### Task 4: Header Component

**Files:**
- Create: `src/components/Header.jsx`
- Test: `src/components/Header.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Header.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )
}

test('renders site title', () => {
  renderHeader()
  expect(screen.getByText('Cadwell Windows')).toBeInTheDocument()
})

test('renders tagline', () => {
  renderHeader()
  expect(
    screen.getByText('Period Appropriate Windows, Doors and Woodwork | Warwick Massachusetts')
  ).toBeInTheDocument()
})

test('renders all five nav links', () => {
  renderHeader()
  expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /drawings/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
})

test('hamburger button toggles the nav open class', () => {
  renderHeader()
  const nav = screen.getByRole('navigation')
  const toggle = screen.getByRole('button', { name: /menu/i })
  expect(nav.querySelector('ul')).not.toHaveClass('open')
  fireEvent.click(toggle)
  expect(nav.querySelector('ul')).toHaveClass('open')
  fireEvent.click(toggle)
  expect(nav.querySelector('ul')).not.toHaveClass('open')
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL — `Cannot find module './Header'`

- [ ] **Step 3: Create the components directory and Header.jsx**

```bash
mkdir -p src/components
```

Create `src/components/Header.jsx`:
```jsx
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <header className="mastheader">
      <div className="gc-logo-block">
        <Link to="/" className="site-title">Cadwell Windows</Link>
        <p className="site-description">
          Period Appropriate Windows, Doors and Woodwork | Warwick Massachusetts
        </p>
      </div>
      <div className="bottom-header">
        <nav role="navigation">
          <button
            className="menu-toggle"
            aria-label="menu"
            onClick={() => setNavOpen((open) => !open)}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
          <ul className={`primary-menu${navOpen ? ' open' : ''}`}>
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/portfolio">Portfolio</NavLink></li>
            <li><NavLink to="/drawings">Drawings</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: 4 tests PASS in `Header.test.jsx`

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.jsx src/components/Header.test.jsx
git commit -m "feat: add Header with site title, tagline, nav, and hamburger"
```

---

### Task 5: Footer Component

**Files:**
- Create: `src/components/Footer.jsx`
- Test: `src/components/Footer.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Footer.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

test('renders copyright notice', () => {
  render(<Footer />)
  expect(screen.getByText(/Copyright © 2020 Cadwell Windows/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL — `Cannot find module './Footer'`

- [ ] **Step 3: Create Footer.jsx**

Create `src/components/Footer.jsx`:
```jsx
export default function Footer() {
  return (
    <footer className="footer">
      <div className="copyright-info">
        <p>Copyright © 2020 Cadwell Windows</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.jsx src/components/Footer.test.jsx
git commit -m "feat: add Footer component"
```

---

### Task 6: App Routing

**Files:**
- Create: `src/App.jsx`
- Create: `src/AppRoutes.jsx`
- Create: `src/AppRoutes.test.jsx`
- Create: `src/pages/Home.jsx` (stub — full version in Task 7)
- Create: `src/pages/About.jsx` (stub — full version in Task 8)
- Create: `src/pages/Portfolio.jsx` (stub — full version in Task 9)
- Create: `src/pages/Drawings.jsx` (stub — full version in Task 10)
- Create: `src/pages/Contact.jsx` (stub — full version in Task 11)
- Modify: `src/main.jsx`

- [ ] **Step 1: Write the failing routing tests**

Create `src/AppRoutes.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  )
}

test('/ renders Home page', () => {
  renderAt('/')
  expect(screen.getByText(/Jack Cadwell is a woodworker/)).toBeInTheDocument()
})

test('/about renders About page', () => {
  renderAt('/about')
  expect(screen.getByText(/Jack Cadwell began his career/)).toBeInTheDocument()
})

test('/portfolio renders Portfolio page', () => {
  renderAt('/portfolio')
  expect(screen.getByText('Elliptical Transom')).toBeInTheDocument()
})

test('/drawings renders Drawings page', () => {
  renderAt('/drawings')
  expect(screen.getByText('Custom Made Profile Cutters')).toBeInTheDocument()
})

test('/contact renders Contact page', () => {
  renderAt('/contact')
  expect(screen.getByText(/122 Hastings Pond Rd/)).toBeInTheDocument()
})

test('/index.php/portfolio/ redirects to portfolio content', () => {
  renderAt('/index.php/portfolio/')
  expect(screen.getByText('Elliptical Transom')).toBeInTheDocument()
})

test('/index.php/about/ redirects to about content', () => {
  renderAt('/index.php/about/')
  expect(screen.getByText(/Jack Cadwell began his career/)).toBeInTheDocument()
})

test('/index.php/drawings-technical/ redirects to drawings content', () => {
  renderAt('/index.php/drawings-technical/')
  expect(screen.getByText('Custom Made Profile Cutters')).toBeInTheDocument()
})

test('/index.php/contact/ redirects to contact content', () => {
  renderAt('/index.php/contact/')
  expect(screen.getByText(/122 Hastings Pond Rd/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL — `Cannot find module './AppRoutes'`

- [ ] **Step 3: Create minimal stub page components**

These stubs give the routing tests just enough content to assert against. They will be replaced with full implementations in Tasks 7–11.

Create `src/pages/Home.jsx`:
```jsx
export default function Home() {
  return (
    <div className="page-content">
      <p>Jack Cadwell is a woodworker from Massachusetts specializing in period appropriate windows, doors, entrances and other parts for historic and new buildings.</p>
    </div>
  )
}
```

Create `src/pages/About.jsx`:
```jsx
export default function About() {
  return (
    <div className="page-content">
      <p>Jack Cadwell began his career as a woodworker in 1985 and currently works out of his Warwick Massachusetts shop.</p>
    </div>
  )
}
```

Create `src/pages/Portfolio.jsx`:
```jsx
export default function Portfolio() {
  return <div className="page-content"><h2>Elliptical Transom</h2></div>
}
```

Create `src/pages/Drawings.jsx`:
```jsx
export default function Drawings() {
  return <div className="page-content"><h4>Custom Made Profile Cutters</h4></div>
}
```

Create `src/pages/Contact.jsx`:
```jsx
export default function Contact() {
  return <div className="page-content"><p>122 Hastings Pond Rd.</p></div>
}
```

- [ ] **Step 4: Create AppRoutes.jsx**

Create `src/AppRoutes.jsx`:
```jsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Drawings from './pages/Drawings'
import Contact from './pages/Contact'

function Layout() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/drawings" element={<Drawings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/index.php/about/" element={<Navigate to="/about" replace />} />
        <Route path="/index.php/portfolio/" element={<Navigate to="/portfolio" replace />} />
        <Route path="/index.php/drawings-technical/" element={<Navigate to="/drawings" replace />} />
        <Route path="/index.php/contact/" element={<Navigate to="/contact" replace />} />
      </Route>
    </Routes>
  )
}
```

- [ ] **Step 5: Create App.jsx**

Create `src/App.jsx`:
```jsx
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
```

- [ ] **Step 6: Update src/main.jsx**

Replace the entire contents of `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 7: Run tests to verify they pass**

```bash
npm test
```
Expected: all 9 routing tests PASS

- [ ] **Step 8: Commit**

```bash
git add src/App.jsx src/AppRoutes.jsx src/AppRoutes.test.jsx src/main.jsx src/pages/
git commit -m "feat: add routing with Layout wrapper and legacy WordPress URL redirects"
```

---

### Task 7: Home Page

**Files:**
- Modify: `src/pages/Home.jsx`
- Test: `src/pages/Home.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/Home.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import Home from './Home'

test('renders hero image', () => {
  render(<Home />)
  const img = screen.getByRole('img')
  expect(img).toHaveAttribute('src', '/images/IMG_1981-1-1024x768.jpg')
})

test('renders full body text', () => {
  render(<Home />)
  expect(screen.getByText(/preserving the historic fabric/)).toBeInTheDocument()
  expect(screen.getByText(/restoring existing parts/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --reporter=verbose src/pages/Home.test.jsx
```
Expected: FAIL — no img with that src

- [ ] **Step 3: Implement Home.jsx**

Replace `src/pages/Home.jsx`:
```jsx
export default function Home() {
  return (
    <div className="page-content">
      <figure style={{ margin: '0 0 20px' }}>
        <img
          src="/images/IMG_1981-1-1024x768.jpg"
          alt="Cadwell Windows craftsmanship"
          loading="eager"
          style={{ width: '100%', display: 'block' }}
        />
      </figure>
      <p>
        Jack Cadwell is a woodworker from Massachusetts specializing in period
        appropriate windows, doors, entrances and other parts for historic and
        new buildings. As a small specialized shop, preserving the historic
        fabric of a building is what it&#8217;s all about. While replacing
        entire items is oftentimes necessary, Jack Cadwell is an expert at
        restoring existing parts and making new parts to match the originals.
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/pages/Home.test.jsx
```
Expected: 2 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.test.jsx
git commit -m "feat: implement Home page"
```

---

### Task 8: About Page

**Files:**
- Modify: `src/pages/About.jsx`
- Test: `src/pages/About.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/About.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import About from './About'

test('renders bio paragraphs', () => {
  render(<About />)
  expect(screen.getByText(/Jack Cadwell began his career as a woodworker in 1985/)).toBeInTheDocument()
  expect(screen.getByText(/properly adjusted and maintained machinery/)).toBeInTheDocument()
})

test('renders portrait photo of Jack Cadwell', () => {
  render(<About />)
  const imgs = screen.getAllByRole('img')
  expect(imgs.map((i) => i.getAttribute('src'))).toContain('/images/IMG_2099.jpg')
})

test('renders all machinery photos', () => {
  render(<About />)
  const srcs = screen.getAllByRole('img').map((i) => i.getAttribute('src'))
  expect(srcs).toContain('/images/IMG_3351-1024x768.jpg')
  expect(srcs).toContain('/images/knives_sm-1-rotated.jpg')
  expect(srcs).toContain('/images/planer.jpg')
  expect(srcs).toContain('/images/jointer.jpg')
  expect(srcs).toContain('/images/back-1.jpg')
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --reporter=verbose src/pages/About.test.jsx
```
Expected: FAIL

- [ ] **Step 3: Implement About.jsx**

Replace `src/pages/About.jsx`:
```jsx
export default function About() {
  return (
    <div className="page-content">
      <figure className="centered-figure">
        <img
          src="/images/IMG_2099.jpg"
          alt="Jack Cadwell in his shop"
          loading="lazy"
          style={{ maxWidth: '480px', width: '100%' }}
        />
        <figcaption>Jack Cadwell in his shop located in Warwick MA</figcaption>
      </figure>

      <p>
        Jack Cadwell began his career as a woodworker in 1985 and currently
        works out of his Warwick Massachusetts shop. Specializing in period
        appropriate windows, doors, entrances and other parts for historic and
        new buildings, clients of Jack Cadwell include many historical sites
        and private residences.
      </p>

      <p>
        Jack Cadwell&#8217;s shop is outfitted with proper machinery and tools
        to ensure high quality finished products. Although handwork is important
        for final fit and finish, creating true, accurate and to drawing pieces
        is achieved by use of properly adjusted and maintained machinery.
      </p>

      <div className="gallery gallery-2">
        <figure>
          <img src="/images/IMG_3351-1024x768.jpg" alt="Custom blade in shaper" loading="lazy" />
          <figcaption>Custom blade in shaper.</figcaption>
        </figure>
        <figure>
          <img src="/images/knives_sm-1-rotated.jpg" alt="Custom knives" loading="lazy" />
          <figcaption>Custom knives are made for individual jobs.</figcaption>
        </figure>
      </div>

      <div className="gallery gallery-2">
        <figure>
          <img src="/images/planer.jpg" alt="Planer" loading="lazy" />
          <figcaption>Planer</figcaption>
        </figure>
        <figure>
          <img src="/images/jointer.jpg" alt="Jointer" loading="lazy" />
          <figcaption>Jointer</figcaption>
        </figure>
      </div>

      <div className="gallery gallery-1">
        <figure>
          <img src="/images/back-1.jpg" alt="Tenoner" loading="lazy" />
          <figcaption>Tenoner</figcaption>
        </figure>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/pages/About.test.jsx
```
Expected: 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/About.jsx src/pages/About.test.jsx
git commit -m "feat: implement About page"
```

---

### Task 9: Portfolio Data and Page

**Files:**
- Create: `src/data/portfolio.js`
- Modify: `src/pages/Portfolio.jsx`
- Test: `src/pages/Portfolio.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/Portfolio.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import Portfolio from './Portfolio'

test('renders all 12 project titles', () => {
  render(<Portfolio />)
  const titles = [
    'Elliptical Transom',
    'Five Curve Casement Window',
    'Arrowhead (Herman Melville House)',
    'Enfield Shaker Village',
    'Gore Place Mansion',
    'Samuel Harrison House',
    'Woodstock Connecticut Residence',
    'Mission House Fence and Arbor',
    'Rehoboth Residence',
    'Springfield Historical Museum',
    'Royalston Residence',
    'Wyman House',
  ]
  titles.forEach((title) => {
    expect(screen.getByText(title)).toBeInTheDocument()
  })
})

test('renders project captions', () => {
  render(<Portfolio />)
  expect(screen.getByText(/Asher Benjamin Handbook/)).toBeInTheDocument()
  expect(screen.getByText(/Herman Melville House was built/)).toBeInTheDocument()
  expect(screen.getByText(/grape arbor was built in 1928/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --reporter=verbose src/pages/Portfolio.test.jsx
```
Expected: FAIL

- [ ] **Step 3: Create src/data/portfolio.js**

Create `src/data/portfolio.js`:
```js
export const projects = [
  {
    title: 'Elliptical Transom',
    caption: 'This elliptical transom window was replicated for a farmhouse in Shelburne MA. The original builder of this window followed designs from the Asher Benjamin Handbook',
    columns: 3,
    images: [
      { src: 'IMG_2959.jpg', caption: 'Original Window' },
      { src: 'IMG_3071-Copy-1024x768.jpg', caption: '' },
      { src: 'IMG_3073-Copy-1024x768.jpg', caption: '' },
      { src: 'IMG_3080-1-Copy-1024x768.jpg', caption: '' },
      { src: 'IMG_3107-1024x768.jpg', caption: 'The finished window in primer' },
      { src: 'Fria-Window-Copy-Copy.jpg', caption: 'The finished window in the house.' },
    ],
  },
  {
    title: 'Five Curve Casement Window',
    caption: '',
    columns: 3,
    images: [
      { src: 'IMG_3597-1.jpg', caption: '' },
      { src: 'IMG_3601-1.jpg', caption: '' },
      { src: '84-March-20-2020-3-rotated.jpg', caption: '' },
      { src: '84-March-20-2020-1-1.jpg', caption: 'Windows After installation' },
    ],
  },
  {
    title: 'Arrowhead (Herman Melville House)',
    caption: 'The Herman Melville House was built in the 1780’s and purchased by Herman Melville in 1850. In the early 1900’s, the front porch was removed. Along with carpenter Peter Hamm, the porch was recreated to match the building. The construction is primarily mortise and tenon, and the door is made from heartwood of Longleaf Pine.',
    columns: 3,
    images: [
      { src: 'IMG_6073-1-1024x768.jpg', caption: '' },
      { src: 'IMG_6069-1024x768.jpg', caption: '' },
      { src: 'Arrowhead-Door-Front-1.jpg', caption: '' },
      { src: 'IMG_6070-1024x768.jpg', caption: '' },
      { src: 'IMG_6064-1024x768.jpg', caption: '' },
    ],
  },
  {
    title: 'Enfield Shaker Village',
    caption: 'These windows were made as part of a restoration of the Enfield Shaker Village workshop building. The original windows and doors where unfortunately thrown away in the 1930’s, but much could be replicated from other existing work.',
    columns: 3,
    images: [
      { src: 'IMG_5401.jpg', caption: '' },
      { src: 'IMG_5413.jpg', caption: '' },
      { src: 'IMG_5376.jpg', caption: '' },
      { src: 'IMG_1522.jpg', caption: '' },
      { src: 'IMG_5342-2.jpg', caption: '' },
      { src: 'Nailing-Window-Casing.jpg', caption: '' },
      { src: 'Enfield-Sash-March-2-1.jpg', caption: '' },
      { src: 'IMG_5952.jpg', caption: '' },
    ],
  },
  {
    title: 'Gore Place Mansion',
    caption: 'This staircase was replaced as the previous one had been removed at some point in the past. In order to maintain the accuracy and the vision of the original workers, the drawings to create these were based upon another original, adjacent staircase. To make all the parts, 22 existing molding profiles were matched. The construction used was primarily mortise and tenon.',
    columns: 3,
    images: [
      { src: 'IMG_2940-1-1024x768.jpg', caption: '' },
      { src: 'IMG_2946-1-768x1024.jpg', caption: '' },
      { src: 'IMG_1321-2-768x1024.jpg', caption: '' },
      { src: 'IMG_13175-768x1024.jpg', caption: '' },
    ],
  },
  {
    title: 'Samuel Harrison House',
    caption: 'As part of a complete renovation, all windows were replaced with period appropriate replicas. Additionally, working with carpenter Peter Hamm, a handicap entrance and bathroom was built in the basement.',
    columns: 2,
    images: [
      { src: 'Harrison-House-Before.jpg', caption: 'Before' },
      { src: 'Harrison-House-After-1.jpg', caption: 'After' },
    ],
  },
  {
    title: 'Woodstock Connecticut Residence',
    caption: 'In collaboration with Peter Hamm, a complete entrance was restored on this home. The door sill is made of white oak and the side lites were replaced with reproduction safety glass.',
    columns: 3,
    images: [
      { src: 'IMG_4981.jpg', caption: '' },
      { src: 'IMG_4689.jpg', caption: '' },
      { src: 'IMG_4690.jpg', caption: '' },
      { src: 'IMG_4575.jpg', caption: '' },
    ],
  },
  {
    title: 'Mission House Fence and Arbor',
    caption: 'This grape arbor was built in 1928. Over the years it had been altered and pieces were missing. However, given that original plans existed, autocad drawing were able to be made and it was restored to it’s original condition.',
    columns: 3,
    images: [
      { src: 'EP4-256-Mission-House-4.jpg', caption: '' },
      { src: 'EP20-256-Mission-House-2.jpg', caption: '' },
      { src: 'IMG_0637.jpg', caption: '' },
      { src: 'IMG_1600.jpg', caption: '' },
      { src: 'IMG_0638.jpg', caption: '' },
      { src: 'IMG_3334.jpg', caption: '' },
      { src: 'IMG_3336_1.jpg', caption: '' },
      { src: 'IMG_3385.jpg', caption: '' },
      { src: 'IMG_3380.jpg', caption: '' },
      { src: 'Mission-House-1-1024x576.jpg', caption: '' },
      { src: 'Mission-House-2-1024x576.jpg', caption: '' },
    ],
  },
  {
    title: 'Rehoboth Residence',
    caption: 'This is an example of a traditional plank frame window, built to match the original design from the 1720’s.',
    columns: 2,
    images: [
      { src: 'IMG_2603-1.jpg', caption: 'Sapele is was used for its rot resistance and stability' },
      { src: 'IMG_2614-Copy-1.jpg', caption: 'In primer ready to be delivered to site' },
    ],
  },
  {
    title: 'Springfield Historical Museum',
    caption: 'In order to restore this window, all the moldings were replaced but the sash was able to be restored.',
    columns: 2,
    images: [
      { src: 'Dormer-Trim-2-scaled-e1597427314577-1024x724.jpg', caption: '' },
      { src: 'IMG_1981.jpg', caption: '' },
    ],
  },
  {
    title: 'Royalston Residence',
    caption: 'An elliptical transom was made to match the original.',
    columns: 1,
    images: [
      { src: 'IMG_0962.jpg', caption: '' },
    ],
  },
  {
    title: 'Wyman House',
    caption: 'Due to a fire, much of this building had to be restored. Fortunately the job was assisted by the American Building Survey who had created drawings of the building, which could be used to create replica items.',
    columns: 2,
    images: [
      { src: 'IMG_0883-1.jpg', caption: '' },
      { src: 'IMG_0426-2.jpg', caption: '' },
      { src: 'IMG_0428-1.jpg', caption: '' },
      { src: 'IMG_0422-2.jpg', caption: '' },
    ],
  },
]
```

- [ ] **Step 4: Implement Portfolio.jsx**

Replace `src/pages/Portfolio.jsx`:
```jsx
import { projects } from '../data/portfolio'

export default function Portfolio() {
  return (
    <div className="page-content">
      {projects.map((project) => (
        <section key={project.title}>
          <h2>{project.title}</h2>
          <div className={`gallery gallery-${project.columns}`}>
            {project.images.map((img, i) => (
              <figure key={i}>
                <img
                  src={`/images/${img.src}`}
                  alt={img.caption || project.title}
                  loading="lazy"
                />
                {img.caption && <figcaption>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
          {project.caption && (
            <p className="gallery-caption">{project.caption}</p>
          )}
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/pages/Portfolio.test.jsx
```
Expected: 2 tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/data/portfolio.js src/pages/Portfolio.jsx src/pages/Portfolio.test.jsx
git commit -m "feat: implement Portfolio page with all 12 projects"
```

---

### Task 10: Drawings Page

**Files:**
- Create: `src/data/drawings.js`
- Modify: `src/pages/Drawings.jsx`
- Test: `src/pages/Drawings.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/Drawings.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import Drawings from './Drawings'

test('renders Custom Made Profile Cutters heading and text', () => {
  render(<Drawings />)
  expect(screen.getByText('Custom Made Profile Cutters')).toBeInTheDocument()
  expect(screen.getByText(/Polyester resin patterns/)).toBeInTheDocument()
})

test('renders Autocad Drawings heading and text', () => {
  render(<Drawings />)
  expect(screen.getByText('Autocad Drawings')).toBeInTheDocument()
  expect(screen.getByText(/technical drawings ensure/)).toBeInTheDocument()
})

test('renders drawing images', () => {
  render(<Drawings />)
  const srcs = screen.getAllByRole('img').map((i) => i.getAttribute('src'))
  expect(srcs).toContain('/images/IMG_0382.jpg')
  expect(srcs).toContain('/images/Petersham-Windows-1.png-1-1-1024x699.png')
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --reporter=verbose src/pages/Drawings.test.jsx
```
Expected: FAIL

- [ ] **Step 3: Create src/data/drawings.js**

Create `src/data/drawings.js`:
```js
export const sections = [
  {
    title: 'Custom Made Profile Cutters',
    text: 'Polyester resin patterns or the actual molding itself can be used to create templates. These templates can then be used to make cutters that match existing woodwork.',
    galleries: [
      {
        columns: 2,
        images: [
          { src: 'IMG_0382.jpg', caption: '' },
          { src: 'IMG_0395.jpg', caption: '' },
        ],
      },
      {
        columns: 3,
        images: [
          { src: 'Colrain-Library-Sash-2-2-1024x542.jpg', caption: '' },
          { src: 'Mount-Greenhouse-Cutters-2-2.jpg', caption: '' },
          { src: 'Munton_scan_drawing.png-1-791x1024.png', caption: '' },
        ],
      },
      {
        columns: 2,
        images: [
          { src: 'knives_sm-1-rotated.jpg', caption: 'Custom Made Cutters' },
          { src: 'IMG_3351-1024x768.jpg', caption: 'Custom Cutter in Shaper' },
        ],
      },
    ],
  },
  {
    title: 'Autocad Drawings',
    text: 'Use of technical drawings ensure that finished work is correct and will fit into frames. Pictured above is a sample of a drawing created for a recent project. By using good technical drawings, clients know what they will receive and carpenters know what to expect.',
    galleries: [
      {
        columns: 1,
        centered: true,
        images: [
          { src: 'Petersham-Windows-1.png-1-1-1024x699.png', caption: '' },
        ],
      },
    ],
  },
]
```

- [ ] **Step 4: Implement Drawings.jsx**

Replace `src/pages/Drawings.jsx`:
```jsx
import { sections } from '../data/drawings'

export default function Drawings() {
  return (
    <div className="page-content">
      {sections.map((section) => (
        <section key={section.title}>
          <h4>{section.title}</h4>
          {section.galleries.map((gallery, gi) => (
            <div key={gi} className={`gallery gallery-${gallery.columns}`}>
              {gallery.images.map((img, i) => (
                <figure key={i}>
                  <img
                    src={`/images/${img.src}`}
                    alt={img.caption || section.title}
                    loading="lazy"
                    style={gallery.centered ? { maxWidth: '100%', margin: '0 auto', display: 'block' } : {}}
                  />
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          ))}
          <p>{section.text}</p>
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/pages/Drawings.test.jsx
```
Expected: 3 tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/data/drawings.js src/pages/Drawings.jsx src/pages/Drawings.test.jsx
git commit -m "feat: implement Drawings page"
```

---

### Task 11: Contact Page

**Files:**
- Modify: `src/pages/Contact.jsx`
- Test: `src/pages/Contact.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/Contact.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import Contact from './Contact'

test('renders address', () => {
  render(<Contact />)
  expect(screen.getByText(/122 Hastings Pond Rd/)).toBeInTheDocument()
  expect(screen.getByText(/Warwick, MA 01378/)).toBeInTheDocument()
})

test('renders phone number', () => {
  render(<Contact />)
  expect(screen.getByText(/\(978\) 429-7947/)).toBeInTheDocument()
})

test('renders email as mailto link', () => {
  render(<Contact />)
  const link = screen.getByRole('link', { name: /cadwelljack@gmail.com/ })
  expect(link).toHaveAttribute('href', 'mailto:cadwelljack@gmail.com')
})

test('renders phone preference note', () => {
  render(<Contact />)
  expect(screen.getByText(/one phone call can be worth/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --reporter=verbose src/pages/Contact.test.jsx
```
Expected: FAIL

- [ ] **Step 3: Implement Contact.jsx**

Replace `src/pages/Contact.jsx`:
```jsx
export default function Contact() {
  return (
    <div className="page-content">
      <p>
        122 Hastings Pond Rd.<br />
        Warwick, MA 01378
      </p>
      <p>(978) 429-7947</p>
      <p>
        <a href="mailto:cadwelljack@gmail.com">cadwelljack@gmail.com</a>
      </p>
      <p>
        <em>
          One phone call can be worth a thousand emails. For lengthy questions
          that require lengthy answers, a phone call is often the most
          efficient way to communicate.
        </em>
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Run all tests**

```bash
npm test
```
Expected: all tests across all files PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Contact.jsx src/pages/Contact.test.jsx
git commit -m "feat: implement Contact page"
```

---

### Task 12: Build Verification

**Files:** none — verification only

- [ ] **Step 1: Start dev server and spot-check every page**

```bash
npm run dev
```
Open http://localhost:5173. Verify each of the following:

- **Home**: hero photo loads, body text present
- **About**: Jack's portrait, bio text, 5 machinery photos with captions
- **Portfolio**: all 12 project headings visible, images load (lazily below the fold)
- **Drawings**: "Custom Made Profile Cutters" and "Autocad Drawings" sections, images load
- **Contact**: address, phone, email link, italic note
- **Nav**: clicking each link changes the URL cleanly (`/portfolio`, not `/index.php/portfolio/`)
- **Legacy redirect**: type `http://localhost:5173/index.php/portfolio/` in the address bar — content renders (React Router handles it client-side)
- **Mobile**: resize browser to 375px wide — hamburger appears, clicking it reveals nav links, clicking again hides them
- **Font**: site title renders in Cormorant Garamond (tall, elegant serif), nav links in uppercase Poppins

- [ ] **Step 2: Run production build**

```bash
npm run build
```
Expected: `dist/` folder created, no errors. Build output shows JS/CSS bundle sizes.

- [ ] **Step 3: Verify dist/ contains the images**

```bash
ls dist/images/ | wc -l
```
Expected: same number as `ls public/images/ | wc -l` (Vite copies all of `public/` into `dist/`).

- [ ] **Step 4: Preview the production build**

```bash
npm run preview
```
Open http://localhost:4173. Repeat the spot-check from Step 1. The preview server is a closer simulation of S3 static hosting than the dev server.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Cadwell Windows React site rebuild"
```

---

## S3 Deployment Reference

After build verification passes, deploy with these steps:

1. Create S3 bucket (name can be anything — doesn't need to match the domain)
2. Enable **Static website hosting** on the bucket:
   - Index document: `index.html`
   - Error document: `index.html` ← **required** for React Router to work
3. Set bucket policy for public read access:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
  }]
}
```
4. Upload: `aws s3 sync dist/ s3://YOUR-BUCKET-NAME --delete`
5. Verify using the S3 static website endpoint URL
