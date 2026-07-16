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
