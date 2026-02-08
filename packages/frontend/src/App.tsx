import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Layout from './components/admin/Layout'
import GoogleTag from './components/GoogleTag'
import './App.css'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Portfolio = lazy(() => import('./pages/Portfolio'))

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminServices = lazy(() => import('./pages/admin/Services'))
const AdminEnquiries = lazy(() => import('./pages/admin/Enquiries'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))
const AdminPageSEO = lazy(() => import('./pages/admin/PageSEO'))

function App() {
  return (
    <AuthProvider>
      <GoogleTag />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={
            <div className="app">
              <Navbar />
              <main>
                <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:slug" element={<ServiceDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
              <AdminLogin />
            </Suspense>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="enquiries" element={<AdminEnquiries />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="page-seo" element={<AdminPageSEO />} />
                  </Routes>
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

