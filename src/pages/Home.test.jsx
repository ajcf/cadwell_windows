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
