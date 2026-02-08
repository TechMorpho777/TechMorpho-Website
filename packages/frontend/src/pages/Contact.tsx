import { useState, useEffect, FormEvent } from 'react'
import { fetchPublicServices } from '../utils/api'
import SEOHead from '../components/SEOHead'

interface Service {
  id: string
  title: string
  slug: string
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [services, setServices] = useState<Service[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchPublicServices()
        setServices(data)
      } catch (error) {
        console.error('Error loading services:', error)
      } finally {
        setServicesLoading(false)
      }
    }

    loadServices()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const retryFetch = async (url: string, options: RequestInit, maxRetries = 2, delay = 1000): Promise<Response> => {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            const response = await fetch(url, options)
            if (response.ok || response.status !== 503) return response
            if (response.status === 503 && attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)))
              continue
            }
            return response
          } catch (error: any) {
            if (attempt < maxRetries && (error?.code === 'ECONNREFUSED' || error?.message?.includes('Failed to fetch'))) {
              await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)))
              continue
            }
            throw error
          }
        }
        throw new Error('Max retries exceeded')
      }
      
      const response = await retryFetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Thank you! Your message has been sent successfully. We will contact you soon!' 
        })
        setFormData({ name: '', email: '', phone: '', service: '', message: '' })
      } else {
        const errorData = await response.json().catch(() => ({}))
        setMessage({ 
          type: 'error', 
          text: errorData.message || 'Sorry, there was an error sending your message. Please try again or contact us directly via WhatsApp.' 
        })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Sorry, there was an error sending your message. Please try again or contact us directly via WhatsApp.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <SEOHead 
        defaultTitle="Contact Us - TechMorpho IT Solutions"
        defaultDescription="Get in touch with TechMorpho. We're here to help transform your business with innovative IT solutions."
      />
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <span className="hero-badge">💬 Let's Connect</span>
            <h1 className="page-title-large">Get In Touch With Us</h1>
            <p className="hero-description">
              Have a project in mind? We're here to help! Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="contact-main-section">
        <div className="container">
          <div className="contact-layout">
            {/* Contact Information Sidebar */}
            <div className="contact-info-sidebar">
              <div className="info-card">
                <div className="info-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <h3>Email Us</h3>
                <p>Send us an email anytime</p>
                <a href="mailto:info@techmorpho.in" className="contact-link">
                  info@techmorpho.in
                </a>
              </div>

              <div className="info-card whatsapp-card">
                <div className="info-icon-wrapper whatsapp-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <h3>WhatsApp Us</h3>
                <p>Quick response via WhatsApp</p>
                <a href="https://wa.me/15551234567" className="whatsapp-link-btn" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Start Chat
                </a>
              </div>

              <div className="info-card">
                <div className="info-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <h3>Business Hours</h3>
                <div className="hours-list">
                  <div className="hours-item">
                    <span className="hours-day">Monday - Friday</span>
                    <span className="hours-time">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span className="hours-day">Saturday</span>
                    <span className="hours-time">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span className="hours-day">Sunday</span>
                    <span className="hours-time">Closed</span>
                  </div>
                </div>
              </div>

              <div className="info-card trust-card">
                <div className="info-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <h3>Why Choose Us?</h3>
                <ul className="trust-list">
                 {/* <li>✓ 24/7 Support Available</li> */}
                  <li>✓ Quick Response Time</li>
                  <li>✓ Expert Team</li>
                  <li>✓ Free Consultation</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <div className="form-header">
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you as soon as possible</p>
              </div>

              {message && (
                <div className={`form-message form-message-${message.type}`}>
                  <span className="message-icon">{message.type === 'success' ? '✅' : '❌'}</span>
                  <span className="message-text">{message.text}</span>
                </div>
              )}

              <form className="contact-form-modern" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      <span className="label-text">Your Name</span>
                      <span className="label-required">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      placeholder="John Doe" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">
                      <span className="label-text">Email Address</span>
                      <span className="label-required">*</span>
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="john@example.com" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">
                      <span className="label-text">Phone Number</span>
                      <span className="label-optional">(Optional)</span>
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="service">
                      <span className="label-text">Select Service</span>
                      <span className="label-required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select 
                        id="service" 
                        name="service" 
                        required
                        value={formData.service}
                        onChange={handleChange}
                        disabled={servicesLoading}
                        className="form-select"
                      >
                        <option value="">
                          {servicesLoading ? 'Loading services...' : 'Choose a service...'}
                        </option>
                        {services.map((service) => (
                          <option key={service.id} value={service.title}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                      <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">
                    <span className="label-text">Your Message</span>
                    <span className="label-required">*</span>
                  </label>
                  <textarea 
                    id="message" 
                    name="message" 
                    placeholder="Tell us about your project, requirements, or any questions you have..." 
                    rows={6} 
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                  ></textarea>
                  <div className="char-count">{formData.message.length} characters</div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-large btn-submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </>
                  )}
                </button>

                <p className="form-note">
                  By submitting this form, you agree to our privacy policy. Your information will be stored securely and used only to contact you about your inquiry.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-cta-section">
        <div className="container">
          <div className="cta-content-modern">
            <h2>Prefer a Direct Conversation?</h2>
            <p>Schedule a free consultation call with our team</p>
            <div className="cta-buttons-modern">
              <a href="https://wa.me/15551234567" className="btn btn-whatsapp btn-large" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp Us
                </a>
                <a href="mailto:info@techmorpho.in" className="btn btn-secondary btn-large">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email Us
                </a>
              </div>
            </div>
          </div>
      </section>
    </>
  )
}

export default Contact
