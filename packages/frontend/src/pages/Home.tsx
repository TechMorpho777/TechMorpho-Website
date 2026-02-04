import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchPublicServices } from '../utils/api'
import SEOHead from '../components/SEOHead'

interface Service {
  id: string
  title: string
  slug: string
  description: string
  icon: string | null
  features: string[]
  tag: string | null
  featured: boolean
  order: number
}

// Helper function to render icon from string
const renderIcon = (icon: string | null) => {
  if (!icon) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    )
  }

  if (/[\u{1F300}-\u{1F9FF}]/u.test(icon)) {
    return <span style={{ fontSize: '2rem' }}>{icon}</span>
  }

  if (icon.includes('<svg') || icon.includes('viewBox')) {
    return <div dangerouslySetInnerHTML={{ __html: icon }} />
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={icon} />
    </svg>
  )
}

const Home = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const allServices = await fetchPublicServices()
        // Show featured services first, or first 6 services
        const featured = allServices.filter((s: Service) => s.featured)
        const displayServices = featured.length > 0 
          ? featured.slice(0, 6)
          : allServices.slice(0, 6)
        setServices(displayServices)
      } catch (error) {
        console.error('Error loading services:', error)
        // On error, show empty array (graceful degradation)
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  return (
    <>
      <SEOHead 
        defaultTitle="TechMorpho IT Solutions - Transform Your Digital Presence"
        defaultDescription="Innovative IT solutions that drive growth and elevate your business to new heights. Expert website development, digital marketing, and custom software solutions."
      />
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Transform Your Digital <span className="gradient-text">Presence</span>
            </h1>
            <p className="hero-subtitle">
              Innovative IT solutions that drive growth and elevate your business to new heights. 
              Expert website development, digital marketing, and custom software solutions.
            </p>
            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary">Explore Services</Link>
              <Link to="/contact" className="btn btn-secondary">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="services-preview">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">Comprehensive IT solutions tailored to your business needs</p>
          </div>
          
          {loading && (
            <div className="loading-skeleton">
              <div className="services-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="service-card skeleton-card">
                    <div className="service-icon skeleton-icon"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-description"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && (
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  <div className="service-icon">
                    {renderIcon(service.icon)}
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!loading && services.length === 0 && (
            <div className="no-services">
              <p>Services are being updated. Please check back soon.</p>
            </div>
          )}

          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link to="/services" className="btn btn-primary">View All Services</Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Business?</h2>
            <p className="cta-text">
              Let's discuss how TechMorpho can help you achieve your digital goals. 
              Get a free consultation today!
            </p>
            <Link to="/contact" className="btn btn-large">Start Your Project</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
