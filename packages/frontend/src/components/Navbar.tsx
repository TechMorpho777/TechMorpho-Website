import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fetchPublicServices } from '../utils/api'

interface NavService {
  id: string
  title: string
  slug: string
  showInNav: boolean
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const [navServices, setNavServices] = useState<NavService[]>([])
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadNavServices = async () => {
      try {
        const allServices = await fetchPublicServices()
        const servicesInNav = allServices
          .filter((s: any) => s.showInNav && s.active)
          .sort((a: any, b: any) => a.order - b.order)
          .slice(0, 5) // Limit to 5 services in nav
        setNavServices(servicesInNav)
      } catch (error) {
        console.error('Error loading navigation services:', error)
      }
    }
    loadNavServices()
  }, [])

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container">
        <div className="nav-wrapper">
          <Link to="/" className="logo">
            <img 
              src="/assets/images/logo/techmorpho.png" 
              alt="TechMorpho IT Solutions Logo" 
              className="logo-image"
            />
          </Link>
          
          <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`} id="navMenu">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* Services with Dropdown */}
            <div 
              className="nav-dropdown"
              onMouseEnter={() => !isMobileMenuOpen && setIsServicesDropdownOpen(true)}
              onMouseLeave={() => !isMobileMenuOpen && setIsServicesDropdownOpen(false)}
            >
              <Link 
                to="/services" 
                className={`nav-link ${isActive('/services') || location.pathname.startsWith('/services/') ? 'active' : ''}`}
                onClick={(e) => {
                  if (navServices.length > 0 && isMobileMenuOpen) {
                    e.preventDefault()
                    setIsServicesDropdownOpen(!isServicesDropdownOpen)
                  } else {
                    setIsMobileMenuOpen(false)
                  }
                }}
              >
                Services
                {navServices.length > 0 && (
                  <svg 
                    className="dropdown-arrow" 
                    width="12" 
                    height="8" 
                    viewBox="0 0 12 8" 
                    fill="none"
                    style={{ transition: 'transform 0.3s ease', transform: isServicesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </Link>
              
              {navServices.length > 0 && (
                <div className={`dropdown-menu ${isServicesDropdownOpen ? 'show' : ''}`}>
                  {navServices.map((service) => (
                    <Link
                      key={service.id}
                      to={`/services/${service.slug}`}
                      className={`dropdown-item ${isActive(`/services/${service.slug}`) ? 'active' : ''}`}
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsServicesDropdownOpen(false)
                      }}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} 
              className="nav-link nav-login-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Link>
          </div>
          
          <button 
            className="mobile-menu-btn" 
            id="mobileMenuBtn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

