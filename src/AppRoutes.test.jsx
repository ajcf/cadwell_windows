import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  )
}

test('/ renders Home page', () => {
  renderAt('/')
  expect(screen.getByText(/Jack Cadwell is a woodworker/)).toBeInTheDocument()
})

test('/about renders About page', () => {
  renderAt('/about')
  expect(screen.getByText(/Jack Cadwell began his career/)).toBeInTheDocument()
})

test('/portfolio renders Portfolio page', () => {
  renderAt('/portfolio')
  expect(screen.getByText('Elliptical Transom')).toBeInTheDocument()
})

test('/drawings renders Drawings page', () => {
  renderAt('/drawings')
  expect(screen.getByText('Custom Made Profile Cutters')).toBeInTheDocument()
})

test('/contact renders Contact page', () => {
  renderAt('/contact')
  expect(screen.getByText(/122 Hastings Pond Rd/)).toBeInTheDocument()
})

test('/index.php/portfolio/ redirects to portfolio content', () => {
  renderAt('/index.php/portfolio/')
  expect(screen.getByText('Elliptical Transom')).toBeInTheDocument()
})

test('/index.php/about/ redirects to about content', () => {
  renderAt('/index.php/about/')
  expect(screen.getByText(/Jack Cadwell began his career/)).toBeInTheDocument()
})

test('/index.php/drawings-technical/ redirects to drawings content', () => {
  renderAt('/index.php/drawings-technical/')
  expect(screen.getByText('Custom Made Profile Cutters')).toBeInTheDocument()
})

test('/index.php/contact/ redirects to contact content', () => {
  renderAt('/index.php/contact/')
  expect(screen.getByText(/122 Hastings Pond Rd/)).toBeInTheDocument()
})
