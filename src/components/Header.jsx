import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { phone, phoneHref, email } from '../data/contact'

export default function Header() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <header>
      <div className="gc-logo-block">
        <div className="title-row">
          <Link to="/" className="site-title">Cadwell Windows</Link>
          <button
            className="menu-toggle"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="primary-menu"
            onClick={() => setNavOpen((open) => !open)}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
        <p className="site-description">
          Period Appropriate Windows, Doors and Woodwork | Warwick Massachusetts
        </p>
        <p className="site-contact">
          <a href={phoneHref}>{phone}</a> · <a href={`mailto:${email}`}>{email}</a>
        </p>
      </div>
      <div className="bottom-header">
        <nav>
          <ul
            id="primary-menu"
            className={`primary-menu${navOpen ? ' open' : ''}`}
            onClick={() => setNavOpen(false)}
          >
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
