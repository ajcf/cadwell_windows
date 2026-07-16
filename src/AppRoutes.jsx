import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Drawings from './pages/Drawings'
import Contact from './pages/Contact'

function Layout() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/drawings" element={<Drawings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/index.php/about/" element={<Navigate to="/about" replace />} />
        <Route path="/index.php/portfolio/" element={<Navigate to="/portfolio" replace />} />
        <Route path="/index.php/drawings-technical/" element={<Navigate to="/drawings" replace />} />
        <Route path="/index.php/contact/" element={<Navigate to="/contact" replace />} />
      </Route>
    </Routes>
  )
}
