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
