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
  const toggle = screen.getByRole('button', { name: /open menu/i })
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(toggle)
  expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true')
  fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
  expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-expanded', 'false')
})

test('clicking a nav link closes the menu', () => {
  renderHeader()
  const toggle = screen.getByRole('button', { name: /open menu/i })
  fireEvent.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  fireEvent.click(screen.getByRole('link', { name: /about/i }))
  expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-expanded', 'false')
})
