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
      {/* Hero Section */}
      <section className="about-hero-modern">
        <div className="container">
          <div className="about-hero-content-modern">
            <div className="hero-badge-modern">Our Services</div>
            <h1 className="hero-title-modern">Transform Your Business with Expert IT Solutions</h1>
            <div className="hero-text-modern">
              <p>From stunning websites to powerful applications, we deliver comprehensive IT solutions that drive growth and innovation. Choose excellence, choose TechMorpho.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="about-section-modern about-section-alt" id="services">
        <div className="container">
          <div className="section-header-modern">
            <h2 className="section-title-modern">Our Core Services</h2>
            <p className="section-subtitle-modern">Choose the perfect solution for your business needs</p>
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

      {/* Why Choose Section */}
      <section className="about-section-modern">
        <div className="container">
          <div className="section-header-modern">
            <h2 className="section-title-modern">Why Businesses Choose TechMorpho</h2>
            <p className="section-subtitle-modern">Your Strategic Technology Partners</p>
          </div>
          <div className="about-content-modern">
            <p className="about-text-modern">
              We're not just service providers – we're your strategic technology partners committed to your success.
            </p>
          </div>

          <div className="why-choose-grid-modern">
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
              <p className="why-choose-description">Skilled professionals with years of experience</p>
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
      </section>

      {/* Process Section */}
      <section className="about-section-modern about-section-alt">
        <div className="container">
          <div className="section-header-modern">
            <h2 className="section-title-modern">Our Simple Process</h2>
            <p className="section-subtitle-modern">From concept to completion in 4 easy steps</p>
          </div>
          <div className="about-content-modern">
            <p className="about-text-modern">
              We follow a structured approach to ensure your project is delivered on time and exceeds expectations.
            </p>
          </div>

          <div className="approach-timeline">
            <div className="approach-step-card">
              <div className="approach-step-header">
                <div className="approach-step-number">01</div>
                <h4 className="approach-step-title">Discuss</h4>
              </div>
              <p className="approach-step-description">Tell us about your project and goals</p>
            </div>
            <div className="approach-step-card">
              <div className="approach-step-header">
                <div className="approach-step-number">02</div>
                <h4 className="approach-step-title">Design</h4>
              </div>
              <p className="approach-step-description">We create a customized solution plan</p>
            </div>
            <div className="approach-step-card">
              <div className="approach-step-header">
                <div className="approach-step-number">03</div>
                <h4 className="approach-step-title">Develop</h4>
              </div>
              <p className="approach-step-description">Expert team brings your vision to life</p>
            </div>
            <div className="approach-step-card">
              <div className="approach-step-header">
                <div className="approach-step-number">04</div>
                <h4 className="approach-step-title">Deliver</h4>
              </div>
              <p className="approach-step-description">Launch and ongoing support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-section-modern">
        <div className="container">
          <div className="about-cta-modern">
            <p className="about-cta-text">
              Ready to start your project? Get a free consultation and discover how we can help transform your business with our expert IT solutions.
            </p>
            <Link to="/contact" className="btn btn-large btn-primary-modern">Get Free Consultation</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Services
