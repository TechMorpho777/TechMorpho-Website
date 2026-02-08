import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchPublicServices, fetchPublicSettings } from '../utils/api'

interface Service {
  id: string
  title: string
  slug: string
}

interface SocialMedia {
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  youtube?: string
  github?: string
}

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [services, setServices] = useState<Service[]>([])
  const [socialMedia, setSocialMedia] = useState<SocialMedia>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch top 5 active services (ordered by order field)
        const servicesData = await fetchPublicServices()
        // Services are already filtered to active and ordered by backend
        const topServices = servicesData.slice(0, 5)
        setServices(topServices)

        // Fetch social media links
        try {
          const socialData = await fetchPublicSettings('social')
          setSocialMedia({
            facebook: socialData.social_facebook || '',
            twitter: socialData.social_twitter || '',
            linkedin: socialData.social_linkedin || '',
            instagram: socialData.social_instagram || '',
            youtube: socialData.social_youtube || '',
            github: socialData.social_github || ''
          })
        } catch (error) {
          console.error('Error loading social media:', error)
        }
      } catch (error) {
        console.error('Error loading footer data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              <img 
                src="/assets/images/logo/techmorpho.png" 
                alt="TechMorpho IT Solutions" 
                className="footer-logo-img"
              />
            </Link>
            <p className="footer-description">
              Transforming businesses through innovative IT solutions and digital excellence.
            </p>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-title">Services</h4>
            {loading ? (
              <ul className="footer-links">
                <li>Loading...</li>
              </ul>
            ) : services.length > 0 ? (
              <>
                <ul className="footer-links">
                  {services.map((service) => (
                    <li key={service.id}>
                      <Link to={`/services#${service.slug}`}>{service.title}</Link>
                    </li>
                  ))}
                </ul>
                <Link to="/services" className="footer-view-all">
                  View All Services →
                </Link>
              </>
            ) : (
              <ul className="footer-links">
                <li><Link to="/services">Our Services</Link></li>
              </ul>
            )}
          </div>
          
          <div className="footer-col">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-title">Contact</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <span>+91 9423982855</span>
              </div>
              <div className="footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>Info@techmorpho.in</span>
              </div>
            </div>
            <h4 className="footer-title" style={{ marginTop: '2rem' }}>Connect</h4>
            <div className="social-links">
              {socialMedia.facebook && (
                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </a>
              )}
              {socialMedia.twitter && (
                <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                </a>
              )}
              {socialMedia.linkedin && (
                <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              )}
              {socialMedia.instagram && (
                <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
              )}
              {socialMedia.youtube && (
                <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {socialMedia.github && (
                <a href={socialMedia.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} TechMorpho IT Solutions. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

