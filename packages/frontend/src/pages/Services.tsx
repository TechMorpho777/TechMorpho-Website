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

// Helper function to render icon from string (SVG path or emoji)
const renderIcon = (icon: string | null) => {
  if (!icon) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    )
  }

  // If it's an emoji, return it
  if (/[\u{1F300}-\u{1F9FF}]/u.test(icon)) {
    return <span style={{ fontSize: '2rem' }}>{icon}</span>
  }

  // If it's an SVG path, render it
  if (icon.includes('<svg') || icon.includes('viewBox')) {
    return <div dangerouslySetInnerHTML={{ __html: icon }} />
  }

  // Default icon for unrecognized formats
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={icon} />
    </svg>
  )
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchPublicServices()
        setServices(data)
      } catch (err) {
        console.error('Error loading services:', err)
        setError('Failed to load services. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  return (
    <>
      <SEOHead 
        defaultTitle="Our Services - TechMorpho IT Solutions"
        defaultDescription="Comprehensive IT solutions tailored to your business needs. Website development, web applications, digital marketing, and more."
      />
      <section className="services-hero">
        <div className="container">
          <div className="services-hero-content">
            <span className="hero-badge">🎯 Professional IT Solutions</span>
            <h1 className="page-title-large">Transform Your Business with Our Expert Services</h1>
            <p className="hero-description">
              From stunning websites to powerful applications, we deliver comprehensive IT solutions that drive growth and innovation. Choose excellence, choose TechMorpho.
            </p>
            <div className="hero-cta-buttons">
              <Link to="/contact" className="btn btn-primary btn-large">Get Started Now</Link>
              <a href="#services" className="btn btn-secondary btn-large">Explore Services ↓</a>
            </div>
            <div className="trust-badges">
              <div className="badge-item">
                <span className="badge-icon">✓</span>
                <span>100+ Projects</span>
              </div>
              <div className="badge-item">
                <span className="badge-icon">⭐</span>
                <span>5-Star Rated</span>
              </div>
              <div className="badge-item">
                <span className="badge-icon">🚀</span>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-modern" id="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Core Services</h2>
            <p className="section-subtitle">Choose the perfect solution for your business needs</p>
          </div>

          {loading && (
            <div className="loading-skeleton">
              <div className="skeleton-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-header"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-description"></div>
                    <div className="skeleton-features">
                      <div className="skeleton-feature"></div>
                      <div className="skeleton-feature"></div>
                      <div className="skeleton-feature"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="services-grid-modern">
              {services.map((service, index) => (
                <div key={service.id} className={`service-card-modern ${service.featured ? 'featured' : ''}`}>
                  {service.featured && <div className="featured-badge">⭐ Most Popular</div>}
                  <div className="service-card-header">
                    <div className="service-number">{String(index + 1).padStart(2, '0')}</div>
                    <div className="service-icon-modern">{renderIcon(service.icon)}</div>
                  </div>
                  <h3 className="service-title-modern">{service.title}</h3>
                  <p className="service-description-modern">{service.description}</p>
                  <ul className="service-features-modern">
                    {service.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className="check-icon">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="service-card-footer">
                    <Link to={`/services/${service.slug}`} className="service-btn">Learn More →</Link>
                    {service.tag && <span className="service-tag">{service.tag}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="no-services">
              <p>No services available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      <section className="why-choose-section">
        <div className="container">
          <div className="why-choose-content-centered">
            <h2 className="section-title">Why Businesses Choose TechMorpho</h2>
            <p className="why-description">
              We're not just service providers – we're your strategic technology partners committed to your success.
            </p>
            <div className="why-features">
              <div className="why-feature">
                <div className="why-icon">🎯</div>
                <div>
                  <h4>Expert Team</h4>
                  <p>Skilled professionals with years of experience</p>
                </div>
              </div>
              <div className="why-feature">
                <div className="why-icon">⚡</div>
                <div>
                  <h4>Fast Delivery</h4>
                  <p>Quick turnaround without compromising quality</p>
                </div>
              </div>
              <div className="why-feature">
                <div className="why-icon">💰</div>
                <div>
                  <h4>Affordable Pricing</h4>
                  <p>Transparent pricing that fits your budget</p>
                </div>
              </div>
              <div className="why-feature">
                <div className="why-icon">🤝</div>
                <div>
                  <h4>24/7 Support</h4>
                  <p>Round-the-clock assistance when you need it</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Simple Process</h2>
            <p className="section-subtitle">From concept to completion in 4 easy steps</p>
          </div>
          <div className="process-grid">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-icon">📋</div>
              <h3>Discuss</h3>
              <p>Tell us about your project and goals</p>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-icon">🎨</div>
              <h3>Design</h3>
              <p>We create a customized solution plan</p>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-icon">⚙️</div>
              <h3>Develop</h3>
              <p>Expert team brings your vision to life</p>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-icon">🚀</div>
              <h3>Deliver</h3>
              <p>Launch and ongoing support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Project?</h2>
            <p className="cta-text">
              Get a free consultation and discover how we can help transform your business with our expert IT solutions.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-large">Get Free Consultation</Link>
              <a href="https://wa.me/15551234567" className="btn btn-whatsapp btn-large" target="_blank" rel="noopener noreferrer">💬 WhatsApp Us</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Services
