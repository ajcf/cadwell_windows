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
