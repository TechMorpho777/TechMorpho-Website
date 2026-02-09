import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchServiceBySlug, fetchPublicServices } from '../utils/api'
import SEOHead from '../components/SEOHead'

interface HeroBanner {
  title?: string
  subtitle?: string
  image?: string
  showBreadcrumb?: boolean
}

interface Service {
  id: string
  title: string
  slug: string
  description: string
  content?: string | null
  sections?: ContentSection[] | null
  heroBanner?: HeroBanner | null
  icon: string | null
  features: string[]
  tag: string | null
  featured: boolean
  order: number
  active?: boolean
}

interface ContentSection {
  id: string
  title: string
  content: string
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
      <section 
        className="about-hero-modern"
        style={service.heroBanner?.image ? {
          backgroundImage: `url(${service.heroBanner.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative'
        } : {}}
      >
        {service.heroBanner?.image && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            zIndex: 0
          }}></div>
        )}
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {service.heroBanner?.showBreadcrumb !== false && (
            <div className="service-detail-breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Home</Link>
              <span style={{ margin: '0 0.5rem' }}>/</span>
              <Link to="/services" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Services</Link>
              <span style={{ margin: '0 0.5rem' }}>/</span>
              <span>{service.title}</span>
            </div>
          )}
          
          <div className="about-hero-content-modern">
            <div className="hero-badge-modern">
              {service.tag || (service.featured ? '⭐ Featured Service' : 'Our Service')}
            </div>
            <h1 
              className="hero-title-modern"
              style={service.heroBanner?.image ? {
                color: 'white',
                background: 'none',
                WebkitBackgroundClip: 'unset',
                WebkitTextFillColor: 'white',
                backgroundClip: 'unset',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              } : {}}
            >
              {service.heroBanner?.title || service.title}
            </h1>
            <div 
              className="hero-text-modern"
              style={service.heroBanner?.image ? {
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
              } : {}}
            >
              <p>{service.heroBanner?.subtitle || service.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-section-modern" style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className={`service-detail-grid ${(!service.sections || service.sections.length === 0) && !service.content ? '' : 'full-width'}`}>
            {/* Main Content */}
            <div className="service-detail-main">
              {/* Legacy single content display - First Editor */}
              {service.content && (
                <div className="service-content-main" style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  marginBottom: '2rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div 
                    className="service-content-html about-text-modern"
                    dangerouslySetInnerHTML={{ __html: service.content }}
                  />
                </div>
              )}

              {/* Content Sections - Multiple Editors */}
              {service.sections && service.sections.length > 0 && (
                <div className="service-sections">
                  {service.sections.map((section: ContentSection) => (
                    <div key={section.id} style={{
                      background: 'white',
                      padding: '2rem',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      marginBottom: '2rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                      {section.title && (
                        <div className="section-header-modern" style={{ marginBottom: '1.5rem' }}>
                          <h2 className="section-title-modern" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{section.title}</h2>
                        </div>
                      )}
                      <div className="about-content-modern" style={{ marginBottom: 0 }}>
                        <div 
                          className="section-content about-text-modern"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Features Section */}
              <div className="included-section-wrapper">
                <div className="section-header-modern" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                  <h2 className="section-title-modern" style={{ fontSize: '2rem', marginBottom: '0.75rem', fontWeight: '800' }}>What's Included</h2>
                  <p className="section-subtitle-modern" style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>Everything you need for success</p>
                </div>
                <div className="included-features-grid">
                  {service.features.map((feature, index) => (
                    <div key={index} className="included-feature-card">
                      <div className="feature-card-content">
                        <div className="feature-content-inline">
                          <div className="feature-number-badge">{String(index + 1).padStart(2, '0')}</div>
                          <h4 className="feature-card-title">{feature}</h4>
                        </div>
                      </div>
                      <div className="feature-card-glow"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Section - Only show if no custom content at all */}
              {!service.content && (!service.sections || service.sections.length === 0) && (
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  marginBottom: '2rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="section-header-modern" style={{ marginBottom: '1.5rem' }}>
                    <h2 className="section-title-modern" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Why Choose This Service?</h2>
                    <p className="section-subtitle-modern" style={{ fontSize: '1rem' }}>What makes us the right choice</p>
                  </div>
                  <div className="about-content-modern" style={{ marginBottom: '1.5rem' }}>
                    <p className="about-text-modern" style={{ marginBottom: 0 }}>
                      We're committed to delivering exceptional results that drive your business forward.
                    </p>
                  </div>
                  <div className="why-choose-grid-modern" style={{ marginTop: '1.5rem' }}>
                    <div className="why-choose-card-modern">
                      <div className="why-choose-icon-wrapper">
                        <div className="why-choose-icon-bg">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                          </svg>
                        </div>
                      </div>
                      <h4 className="why-choose-title">Expert Team</h4>
                      <p className="why-choose-description">Skilled professionals dedicated to your success</p>
                    </div>
                    <div className="why-choose-card-modern">
                      <div className="why-choose-icon-wrapper">
                        <div className="why-choose-icon-bg">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                          </svg>
                        </div>
                      </div>
                      <h4 className="why-choose-title">Fast Delivery</h4>
                      <p className="why-choose-description">Quick turnaround without compromising quality</p>
                    </div>
                    <div className="why-choose-card-modern">
                      <div className="why-choose-icon-wrapper">
                        <div className="why-choose-icon-bg">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                          </svg>
                        </div>
                      </div>
                      <h4 className="why-choose-title">Affordable Pricing</h4>
                      <p className="why-choose-description">Transparent pricing that fits your budget</p>
                    </div>
                    <div className="why-choose-card-modern">
                      <div className="why-choose-icon-wrapper">
                        <div className="why-choose-icon-bg">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                        </div>
                      </div>
                      <h4 className="why-choose-title">24/7 Support</h4>
                      <p className="why-choose-description">Round-the-clock assistance when you need it</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Only show if no custom content */}
            {!service.sections && !service.content && (
              <aside className="service-detail-sidebar">
                <div className="sidebar-card" style={{ 
                  background: '#fff', 
                  borderRadius: '12px', 
                  padding: '2rem', 
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>Get Started Today</h3>
                  <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '0.95rem' }}>
                    Ready to transform your business with our expert services?
                  </p>
                  <Link to="/contact" className="btn btn-primary-modern btn-block" style={{ marginBottom: '0.75rem', display: 'block', textAlign: 'center' }}>
                    Request a Quote
                  </Link>
                  <Link to="/contact" className="btn btn-secondary btn-block" style={{ display: 'block', textAlign: 'center' }}>
                    Schedule Consultation
                  </Link>
                </div>

                {relatedServices.length > 0 && (
                  <div className="sidebar-card" style={{ 
                    background: '#fff', 
                    borderRadius: '12px', 
                    padding: '2rem', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>Related Services</h3>
                    <div className="related-services-list">
                      {relatedServices.map((related) => (
                        <Link 
                          key={related.id} 
                          to={`/services/${related.slug}`}
                          className="related-service-item"
                          style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'all 0.2s',
                            background: '#f5f5f5',
                            border: '1px solid #e5e7eb'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#e8e8e8';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f5f5f5';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }}
                        >
                          <div className="related-service-icon" style={{ fontSize: '2rem', flexShrink: 0 }}>
                            {renderIcon(related.icon)}
                          </div>
                          <div className="related-service-info">
                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: '600' }}>{related.title}</h4>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
                              {related.description.substring(0, 60)}...
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-section-modern" style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="about-cta-modern">
            <p className="about-cta-text">
              Ready to get started? Let's discuss how we can help transform your business with our expert {service.title} services.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-large btn-primary-modern">
                Get Free Consultation
              </Link>
              <Link to="/services" className="btn btn-large btn-secondary">
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

