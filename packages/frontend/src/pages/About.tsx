import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

const About = () => {
  const values = [
    { number: '01', icon: '💡', title: 'Innovation', description: 'We stay ahead of the curve by embracing the latest technologies and methodologies to deliver cutting-edge solutions.' },
    { number: '02', icon: '🤝', title: 'Partnership', description: 'We build long-term relationships with our clients based on trust, transparency, and mutual success.' },
    { number: '03', icon: '⭐', title: 'Excellence', description: 'We are committed to delivering the highest quality work that exceeds expectations every single time.' },
    { number: '04', icon: '🎯', title: 'Results-Driven', description: 'We focus on delivering measurable results that contribute directly to your business objectives.' }
  ]

  const whyChoose = [
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, title: 'Expert Team', description: 'Skilled professionals with extensive experience in cutting-edge technologies and industry best practices.' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: 'Quality Assurance', description: 'Every project undergoes rigorous testing and quality control to ensure flawless performance and reliability.' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: 'Timely Delivery', description: 'We respect deadlines and work efficiently to deliver your projects on time, every time.' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>, title: 'Client-Focused', description: 'We take the time to understand your unique needs and craft tailored solutions that align with your goals.' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, title: 'Competitive Pricing', description: 'Transparent, competitive pricing without compromising on quality or service excellence.' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, title: 'Priority Support', description: 'Round-the-clock support to ensure your business operations run smoothly without interruption.' }
  ]

  return (
    <>
      <SEOHead 
        defaultTitle="About Us - TechMorpho IT Solutions"
        defaultDescription="Learn about TechMorpho - your trusted partner for innovative IT solutions and digital excellence."
      />
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="hero-badge">🚀 About TechMorpho</span>
            <h1 className="page-title-large">Your Trusted Technology Partner</h1>
            <p className="hero-description">
              Transforming businesses through innovative IT solutions and digital excellence. 
              We don't just build software – we build success stories.
            </p>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To empower businesses with cutting-edge technology solutions that fuel growth and success in the digital age. 
                We transform complex challenges into elegant solutions that drive real business results.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>
                To be the most trusted IT solutions partner, known for innovation, excellence, and delivering 
                measurable value to every client we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </div>
          <div className="values-grid-modern">
            {values.map((value, index) => (
              <div key={index} className="value-card-modern">
                <div className="value-number">{value.number}</div>
                <div className="value-icon-modern">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-choose-about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Businesses Choose TechMorpho</h2>
            <p className="section-subtitle">What sets us apart in the IT industry</p>
          </div>
          <div className="why-grid-modern">
            {whyChoose.map((item, index) => (
              <div key={index} className="why-card-modern">
                <div className="why-card-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Work With Us?</h2>
            <p className="cta-text">
              Let's discuss how we can help transform your business with our expert IT solutions.
            </p>
            <Link to="/contact" className="btn btn-large">Get In Touch</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default About

