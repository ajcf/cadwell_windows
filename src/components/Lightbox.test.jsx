import { render, screen, fireEvent } from '@testing-library/react'
import Lightbox from './Lightbox'

test('renders the image', () => {
  render(<Lightbox src="/images/test.jpg" alt="Test image" onClose={() => {}} />)
  const img = screen.getByRole('img')
  expect(img).toHaveAttribute('src', '/images/test.jpg')
  expect(img).toHaveAttribute('alt', 'Test image')
})

test('calls onClose when overlay is clicked', () => {
  const onClose = vi.fn()
  render(<Lightbox src="/images/test.jpg" alt="Test image" onClose={onClose} />)
  fireEvent.click(screen.getByRole('dialog'))
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('calls onClose when Escape is pressed', () => {
  const onClose = vi.fn()
  render(<Lightbox src="/images/test.jpg" alt="Test image" onClose={onClose} />)
  fireEvent.keyDown(window, { key: 'Escape' })
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('does not call onClose when image itself is clicked', () => {
  const onClose = vi.fn()
  render(<Lightbox src="/images/test.jpg" alt="Test image" onClose={onClose} />)
  fireEvent.click(screen.getByRole('img'))
  expect(onClose).not.toHaveBeenCalled()
})
