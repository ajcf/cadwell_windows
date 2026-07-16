import { render, screen } from '@testing-library/react'
import Footer from './Footer'

test('renders copyright notice', () => {
  render(<Footer />)
  expect(screen.getByText(/Copyright © 2020 Cadwell Windows/)).toBeInTheDocument()
})
