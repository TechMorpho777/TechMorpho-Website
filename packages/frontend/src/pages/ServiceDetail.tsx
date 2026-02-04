import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchServiceBySlug, fetchPublicServices } from '../utils/api'
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
  active?: boolean
}

// Helper function to render icon from string (SVG path or emoji)
const renderIcon = (icon: string | null, size: 'small' | 'large' = 'small') => {
  if (!icon) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    )
  }

  // If it's an emoji, return it
  if (/[\u{1F300}-\u{1F9FF}]/u.test(icon)) {
    return <span style={{ fontSize: size === 'large' ? '4rem' : '2rem' }}>{icon}</span>
  }

  // If it's an SVG path, render it
  if (icon.includes('<svg') || icon.includes('viewBox')) {
    return <div dangerouslySetInnerHTML={{ __html: icon }} style={{ fontSize: size === 'large' ? '4rem' : '2rem' }} />
  }

  // Default icon for unrecognized formats
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={icon} />
    </svg>
  )
}

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const [service, setService] = useState<Service | null>(null)
  const [relatedServices, setRelatedServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadService = async () => {
      if (!slug) {
        setError('Invalid service URL')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const serviceData = await fetchServiceBySlug(slug)
        setService(serviceData)

        // Load related services (exclude current service)
        const allServices = await fetchPublicServices()
        const related = allServices
          .filter((s: Service) => s.id !== serviceData.id && s.active)
          .slice(0, 3)
        setRelatedServices(related)
      } catch (err: any) {
        console.error('Error loading service:', err)
        if (err.message?.includes('404') || err.message?.includes('not found')) {
          setError('Service not found')
        } else {
          setError('Failed to load service. Please try again later.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadService()
  }, [slug])

  if (loading) {
    return (
      <>
        <SEOHead 
          defaultTitle="Loading Service - TechMorpho"
        />
        <div className="service-detail-loading">
          <div className="container">
            <div className="loading-skeleton-detail">
              <div className="skeleton-hero"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-features">
                  <div className="skeleton-feature"></div>
                  <div className="skeleton-feature"></div>
                  <div className="skeleton-feature"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error || !service) {
    return (
      <>
        <SEOHead 
          defaultTitle="Service Not Found - TechMorpho"
        />
        <div className="service-detail-error">
          <div className="container">
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <h1>Service Not Found</h1>
              <p>{error || 'The service you are looking for does not exist or has been removed.'}</p>
              <div className="error-actions">
                <Link to="/services" className="btn btn-primary">View All Services</Link>
                <Link to="/" className="btn btn-secondary">Go to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHead 
        defaultTitle={`${service.title} - TechMorpho IT Solutions`}
        defaultDescription={service.description}
      />
      
      {/* Hero Section */}
      <section className="service-detail-hero">
        <div className="container">
          <div className="service-detail-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/services">Services</Link>
            <span>/</span>
            <span>{service.title}</span>
          </div>
          
          <div className="service-detail-hero-content">
            <div className="service-detail-icon-large">
              {renderIcon(service.icon, 'large')}
            </div>
            <div className="service-detail-header">
              {service.tag && (
                <span className="service-detail-tag">{service.tag}</span>
              )}
              {service.featured && (
                <span className="service-detail-featured-badge">⭐ Featured Service</span>
              )}
              <h1 className="service-detail-title">{service.title}</h1>
              <p className="service-detail-subtitle">{service.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="service-detail-content">
        <div className="container">
          <div className="service-detail-grid">
            {/* Features Section */}
            <div className="service-detail-main">
              <div className="service-detail-section">
                <h2 className="section-title">What's Included</h2>
                <div className="features-grid">
                  {service.features.map((feature, index) => (
                    <div key={index} className="feature-card">
                      <div className="feature-icon">✓</div>
                      <div className="feature-content">
                        <h3>{feature}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Section */}
              <div className="service-detail-section">
                <h2 className="section-title">Why Choose This Service?</h2>
                <div className="why-choose-grid">
                  <div className="why-item">
                    <div className="why-icon">🎯</div>
                    <h4>Expert Team</h4>
                    <p>Skilled professionals dedicated to your success</p>
                  </div>
                  <div className="why-item">
                    <div className="why-icon">⚡</div>
                    <h4>Fast Delivery</h4>
                    <p>Quick turnaround without compromising quality</p>
                  </div>
                  <div className="why-item">
                    <div className="why-icon">💰</div>
                    <h4>Affordable Pricing</h4>
                    <p>Transparent pricing that fits your budget</p>
                  </div>
                  <div className="why-item">
                    <div className="why-icon">🤝</div>
                    <h4>24/7 Support</h4>
                    <p>Round-the-clock assistance when you need it</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="service-detail-sidebar">
              <div className="sidebar-card">
                <h3>Get Started Today</h3>
                <p>Ready to transform your business with our expert services?</p>
                <Link to="/contact" className="btn btn-primary btn-block">
                  Request a Quote
                </Link>
                <Link to="/contact" className="btn btn-secondary btn-block">
                  Schedule Consultation
                </Link>
              </div>

              {relatedServices.length > 0 && (
                <div className="sidebar-card">
                  <h3>Related Services</h3>
                  <div className="related-services-list">
                    {relatedServices.map((related) => (
                      <Link 
                        key={related.id} 
                        to={`/services/${related.slug}`}
                        className="related-service-item"
                      >
                        <div className="related-service-icon">
                          {renderIcon(related.icon)}
                        </div>
                        <div className="related-service-info">
                          <h4>{related.title}</h4>
                          <p>{related.description.substring(0, 60)}...</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="service-detail-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Let's discuss how we can help transform your business with our expert {service.title} services.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary btn-large">
                Get Free Consultation
              </Link>
              <Link to="/services" className="btn btn-secondary btn-large">
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ServiceDetail

