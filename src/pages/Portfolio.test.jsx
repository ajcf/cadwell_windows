import { render, screen } from '@testing-library/react'
import Portfolio from './Portfolio'

test('renders all 12 project titles', () => {
  render(<Portfolio />)
  const titles = [
    'Elliptical Transom',
    'Five Curve Casement Window',
    'Arrowhead (Herman Melville House)',
    'Enfield Shaker Village',
    'Gore Place Mansion',
    'Samuel Harrison House',
    'Woodstock Connecticut Residence',
    'Mission House Fence and Arbor',
    'Rehoboth Residence',
    'Springfield Historical Museum',
    'Royalston Residence',
    'Wyman House',
  ]
  titles.forEach((title) => {
    expect(screen.getByText(title)).toBeInTheDocument()
  })
})

test('renders project captions', () => {
  render(<Portfolio />)
  expect(screen.getByText(/Asher Benjamin Handbook/)).toBeInTheDocument()
  expect(screen.getByText(/Herman Melville House was built/)).toBeInTheDocument()
  expect(screen.getByText(/grape arbor was built in 1928/)).toBeInTheDocument()
})
