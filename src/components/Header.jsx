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
