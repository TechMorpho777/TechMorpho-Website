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
  category: string | null
  featured: boolean
  order: number
}

const Home = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const allServices = await fetchPublicServices()
        const featured = allServices.filter((s: Service) => s.featured)
        
        // Show up to 6 services, prioritizing featured ones
        let displayServices: Service[] = []
        if (featured.length > 0) {
          displayServices = [...featured]
          // If we have fewer than 6 featured services, add non-featured ones to fill up
          if (displayServices.length < 6) {
            const nonFeatured = allServices.filter((s: Service) => !s.featured)
            displayServices = [...displayServices, ...nonFeatured].slice(0, 6)
          } else {
            displayServices = displayServices.slice(0, 6)
          }
        } else {
          displayServices = allServices.slice(0, 6)
        }
        setServices(displayServices)
      } catch (error) {
        console.error('Error loading services:', error)
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
        defaultTitle="TechMorpho: IT & Digital Marketing Services for Business Growth"
        defaultDescription="Drive Growth, Enhance Efficiency. Your Trusted Partner for IT Services & Digital Marketing. Transforming Businesses for the Digital Age."
      />
      
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-graphics">
          <div className="hero-graphic-circle circle-1"></div>
          <div className="hero-graphic-circle circle-2"></div>
          <div className="hero-graphic-circle circle-3"></div>
          <div className="hero-graphic-shape shape-1">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 20L120 80L180 100L120 120L100 180L80 120L20 100L80 80L100 20Z" fill="currentColor" opacity="0.1"/>
            </svg>
          </div>
          <div className="hero-graphic-shape shape-2">
            <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="75" cy="75" r="60" stroke="currentColor" strokeWidth="2" opacity="0.15"/>
              <circle cx="75" cy="75" r="40" stroke="currentColor" strokeWidth="2" opacity="0.1"/>
            </svg>
          </div>
          <div className="hero-graphic-grid">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.05"/>
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#grid)"/>
            </svg>
          </div>
        </div>
        
        {/* Hero Visual Elements */}
        <div className="hero-visual-elements">
          <div className="hero-icon-card card-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div className="hero-icon-card card-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h18v18H3zM3 9h18M9 3v18"/>
            </svg>
          </div>
          <div className="hero-icon-card card-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="hero-icon-card card-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>

        <div className="container">
          <div className="home-hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🚀</span>
              TechMorpho: IT & Digital Marketing Services
            </div>
            <h1 className="home-hero-title">
              <span className="title-line-1">Drive Growth, Enhance Efficiency</span>
              <span className="title-line-3 gradient-text">Your Trusted Partner</span>
              <span className="title-line-4">for IT Services & Digital Marketing</span>
            </h1>
            <p className="home-hero-subtitle">
              Transforming Businesses for the Digital Age
            </p>
            <p className="home-hero-description">
              Take your business to the next level with TechMorpho where innovative technology meets targeted digital marketing strategies. Our mission is simple: bridge the gap between IT and marketing so your business thrives in today's digital landscape.
            </p>
            <div className="home-hero-buttons">
              <Link to="/contact" className="btn btn-primary btn-large">
                <span>Get a Free Consultation</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/services" className="btn btn-secondary btn-large">
                <span>Explore Our Services</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4M12 8h.01"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-background-pattern"></div>
      </section>

      {/* Partner Section */}
      <section className="home-partner-section">
        <div className="container">
          <div className="partner-content">
            <div className="partner-header">
              <h2 className="section-title">Your Dedicated Partner in Digital Excellence</h2>
              <p className="section-subtitle">
                In a complex digital world, you deserve a reliable partner, not just another service provider. TechMorpho brings over a decade of collective experience to the table. Our certified IT professionals and digital marketing strategists are deeply committed to understanding your business and delivering measurable results.
              </p>
            </div>
            
            <div className="why-choose-section">
              <div className="section-header">
                <div className="section-badge">
                  <span>Why Choose Us</span>
                </div>
                <h2 className="section-title">Why Choose TechMorpho?</h2>
                <p className="section-subtitle">
                  We deliver exceptional value through expertise, innovation, and dedicated support
                </p>
              </div>
              <div className="why-choose-grid-home-redesigned">
                <div className="why-choose-card-redesigned">
                  <div className="why-choose-number">01</div>
                  <div className="why-choose-icon-redesigned">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p>Proven expertise from certified professionals across IT and digital marketing</p>
                </div>
                
                <div className="why-choose-card-redesigned">
                  <div className="why-choose-number">02</div>
                  <div className="why-choose-icon-redesigned">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                      <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                    </svg>
                  </div>
                  <p>Solutions tailored to your unique goals and ROI-focused</p>
                </div>
                
                <div className="why-choose-card-redesigned">
                  <div className="why-choose-number">03</div>
                  <div className="why-choose-icon-redesigned">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </div>
                  <p>Constant innovation to keep you ahead of digital trends</p>
                </div>
                
                <div className="why-choose-card-redesigned">
                  <div className="why-choose-number">04</div>
                  <div className="why-choose-icon-redesigned">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <p>Transparent, consistent communication and regular progress updates</p>
                </div>
                
                <div className="why-choose-card-redesigned">
                  <div className="why-choose-number">05</div>
                  <div className="why-choose-icon-redesigned">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  </div>
                  <p>Ongoing client support for seamless, secure operations</p>
                </div>
              </div>
            </div>
            
            <div className="partner-values">
              <p>We thrive on <strong>transparency</strong>, <strong>ethical practices</strong>, and <strong>long-term relationships</strong> that build trust and mutual success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Solutions Section */}
      <section className="home-solutions-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Comprehensive Solutions for a Connected World</h2>
            <p className="section-subtitle">
              TechMorpho delivers integrated IT and digital marketing services to boost your performance and visibility
            </p>
          </div>

          <div className="solutions-grid">
            {/* IT Services */}
            <div className="solution-category">
              <div className="solution-category-header">
                <div className="solution-category-icon it-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <h3>Cutting-Edge IT Services</h3>
              </div>
              
              <div className="solution-items">
                <div className="solution-item">
                  <div className="solution-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3h3a1 1 0 001-1v-4a1 1 0 00-1-1h-2V8a1 1 0 00-1-1h-1V5a1 1 0 011-1h3a1 1 0 011 1v2a1 1 0 01-1 1h-1v2h1a1 1 0 011 1v4a1 1 0 01-1 1h-2v4a1 1 0 01-1 1h-3a3 3 0 01-3-3V6a3 3 0 013-3h3z"/>
                    </svg>
                  </div>
                  <div className="solution-item-content">
                    <h4>Managed IT Support</h4>
                    <p>Proactive monitoring and support 24/7 prevent problems before they impact your workflow.</p>
                  </div>
                </div>
                
                <div className="solution-item">
                  <div className="solution-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div className="solution-item-content">
                    <h4>Cybersecurity</h4>
                    <p>Multi-layered security protects against cyber threats and ensures business continuity.</p>
                  </div>
                </div>
                
                <div className="solution-item">
                  <div className="solution-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div className="solution-item-content">
                    <h4>Cloud Solutions</h4>
                    <p>Migrate, manage, and optimize on AWS, Azure, or Google Cloud for flexibility and cost savings.</p>
                  </div>
                </div>
                
                <div className="solution-item">
                  <div className="solution-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6"/>
                      <polyline points="8 6 2 12 8 18"/>
                    </svg>
                  </div>
                  <div className="solution-item-content">
                    <h4>Custom Software Development</h4>
                    <p>Streamlined, tailored apps to solve your business's unique challenges.</p>
                  </div>
                </div>
                
                <div className="solution-item">
                  <div className="solution-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div className="solution-item-content">
                    <h4>IT Consulting</h4>
                    <p>Expert guidance for smarter tech investments and digital transformation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Digital Marketing Services */}
            <div className="solution-category">
              <div className="solution-category-header">
                <div className="solution-category-icon marketing-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h18v18H3zM3 9h18M9 3v18"/>
                  </svg>
                </div>
                <h3>Performance-Focused Digital Marketing</h3>
              </div>
              
              <div className="solution-items">
                <div className="solution-item">
                  <div className="solution-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                    </svg>
                  </div>
                  <div className="solution-item-content">
                    <h4>SEO</h4>
                    <p>Boost your search rankings with data-driven strategies and quality content.</p>
                  </div>
                </div>
                
                <div className="solution-item">
                  <div className="solution-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="2" x2="12" y2="22"/>
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                    </svg>
                  </div>
                  <div className="solution-item-content">
                    <h4>PPC Advertising</h4>
                    <p>Maximize your ad spend and capture qualified leads instantly.</p>
                  </div>
                </div>
                
                <div className="solution-item">
                  <div className="solution-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                  </div>
                  <div className="solution-item-content">
                    <h4>Social Media Marketing</h4>
                    <p>Build your brand, engage customers, and drive conversions on the platforms that matter.</p>
                  </div>
                </div>
                
                <div className="solution-item">
                  <div className="solution-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div className="solution-item-content">
                    <h4>Content Marketing</h4>
                    <p>Attract, engage, and convert with compelling, targeted content.</p>
                  </div>
                </div>
                
                <div className="solution-item">
                  <div className="solution-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <div className="solution-item-content">
                    <h4>Web Design & Development</h4>
                    <p>Fast, responsive websites designed for maximum user engagement and conversion.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Challenges Section */}
      <section className="home-challenges-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Solving Your Biggest Business Challenges</h2>
            <p className="section-subtitle">
              We know every business is unique. That's why our approach turns common pain points into growth opportunities:
            </p>
          </div>

          <div className="challenges-grid">
            <div className="challenge-card challenge-card-1">
              <div className="challenge-number">01</div>
              <div className="challenge-icon-wrapper">
                <div className="challenge-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
              </div>
              <div className="challenge-content">
                <h3>Lack of Visibility/Leads?</h3>
                <p>SEO, PPC, and social media work together to build awareness and generate quality leads, while content marketing positions you as an industry leader.</p>
              </div>
            </div>

            <div className="challenge-card challenge-card-2">
              <div className="challenge-number">02</div>
              <div className="challenge-icon-wrapper">
                <div className="challenge-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
              </div>
              <div className="challenge-content">
                <h3>Outdated IT/ Cyber Risks?</h3>
                <p>Managed services and cybersecurity upgrades keep your systems secure, efficient, and resilient.</p>
              </div>
            </div>

            <div className="challenge-card challenge-card-3">
              <div className="challenge-number">03</div>
              <div className="challenge-icon-wrapper">
                <div className="challenge-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
              </div>
              <div className="challenge-content">
                <h3>Need Better Operational Efficiency?</h3>
                <p>Cloud solutions and custom software streamline your workflows and boost productivity.</p>
              </div>
            </div>

            <div className="challenge-card challenge-card-4">
              <div className="challenge-number">04</div>
              <div className="challenge-icon-wrapper">
                <div className="challenge-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
              </div>
              <div className="challenge-content">
                <h3>Website Not Converting?</h3>
                <p>High-performance web design turns visitors into loyal customers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      {!loading && services.length > 0 && (
        <section className="services-preview">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <span>Our Services</span>
              </div>
              <h2 className="section-title">
                Comprehensive Solutions for Your Business
              </h2>
              <p className="section-subtitle">
                Discover our range of professional IT and digital marketing services designed to drive growth and efficiency
              </p>
            </div>
            
            <div className="services-grid-modern">
              {services.map((service, index) => (
                <Link 
                  key={service.id} 
                  to={`/services/${service.slug}`} 
                  className="service-card-modern"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="service-card-header">
                    <div className="service-icon-modern">
                      {service.icon && /[\u{1F300}-\u{1F9FF}]/u.test(service.icon) ? (
                        <span className="service-icon-emoji">{service.icon}</span>
                      ) : service.icon && service.icon.includes('<svg') ? (
                        <div className="service-icon-svg" dangerouslySetInnerHTML={{ __html: service.icon }} />
                      ) : service.icon && service.icon.startsWith('data:image/') ? (
                        <img src={service.icon} alt={service.title} className="service-icon-image" />
                      ) : service.icon ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="service-icon-svg-path">
                          <path d={service.icon} />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                      )}
                    </div>
                    {service.tag && (
                      <span className="service-tag">{service.tag}</span>
                    )}
                  </div>
                  <div className="service-card-body">
                    <h3 className="service-title-modern">{service.title}</h3>
                    <p className="service-description-modern">{service.description}</p>
                    {service.features && service.features.length > 0 && (
                      <ul className="service-features-preview">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="service-card-footer">
                    <span className="service-link">
                      Learn More
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="services-cta">
              <Link to="/services" className="btn btn-primary">
                <span>Explore All Services</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="home-final-cta">
        <div className="container">
          <div className="final-cta-content">
            <h2 className="final-cta-title">Ready to Transform Your Business?</h2>
            <p className="final-cta-description">
              Partner with TechMorpho for innovative IT solutions and digital marketing strategies that put your business ahead of the competition. Discover how we can support your growth, secure your data, and help you win online.
            </p>
            <div className="final-cta-buttons">
              <Link to="/contact" className="btn btn-cta-white btn-large">
                Request a Free Consultation
              </Link>
              <Link to="/contact" className="btn btn-cta-outline btn-large">
                Contact Us Today
              </Link>
            </div>
            <p className="final-cta-footer">Reach out now - TechMorpho is your partner for digital success.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
