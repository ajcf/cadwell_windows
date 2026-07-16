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
