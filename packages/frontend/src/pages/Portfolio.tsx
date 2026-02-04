import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const projects = [
    { category: 'website', title: 'E-Commerce Platform', description: 'Complete e-commerce solution with payment gateway integration, inventory management, and responsive design.', tags: ['WordPress', 'WooCommerce', 'Payment Gateway'], gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { category: 'application', title: 'Inventory Management System', description: 'Custom desktop application for inventory tracking, billing, and reporting with real-time data synchronization.', tags: ['Electron', 'Node.js', 'SQLite'], gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { category: 'website', title: 'Corporate Business Website', description: 'Professional corporate website with CMS integration, blog functionality, and contact forms.', tags: ['Custom HTML/CSS', 'JavaScript', 'SEO'], gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { category: 'design', title: 'Brand Identity Package', description: 'Complete branding solution including logo design, business cards, letterheads, and brand guidelines.', tags: ['Logo Design', 'Branding', 'Print Design'], gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { category: 'marketing', title: 'SEO & Marketing Campaign', description: 'Comprehensive SEO strategy that increased organic traffic by 250% and improved search rankings significantly.', tags: ['SEO', 'Content Marketing', 'Google Ads'], gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
    { category: 'application', title: 'CRM Dashboard', description: 'Customer relationship management system with analytics, reporting, and automated email campaigns.', tags: ['React', 'Node.js', 'MongoDB'], gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { category: 'website', title: 'Restaurant Website', description: 'Modern restaurant website with online ordering system, menu management, and table reservation features.', tags: ['WordPress', 'Online Ordering', 'Responsive'], gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { category: 'design', title: 'Social Media Campaign', description: 'Complete social media graphics package for 3-month marketing campaign across multiple platforms.', tags: ['Social Media', 'Graphics', 'Ad Design'], gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { category: 'website', title: 'Portfolio Website', description: 'Creative portfolio website for a photographer with gallery, client login, and booking system.', tags: ['Custom Design', 'Gallery', 'Booking System'], gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' }
  ]

  const filters = ['all', 'website', 'application', 'design', 'marketing']
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter)

  return (
    <>
      <SEOHead 
        defaultTitle="Our Portfolio - TechMorpho IT Solutions"
        defaultDescription="Explore our portfolio of successful projects. See how we've helped businesses transform their digital presence."
      />
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Our Portfolio</h1>
          <p className="page-subtitle">Showcasing our successful projects and client success stories</p>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="container">
          <div className="portfolio-filters">
            {filters.map(filter => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'all' ? 'All Projects' : filter.charAt(0).toUpperCase() + filter.slice(1) + 's'}
              </button>
            ))}
          </div>

          <div className="portfolio-grid">
            {filteredProjects.map((project, index) => (
              <div key={index} className="portfolio-item" data-category={project.category}>
                <div className="portfolio-image">
                  <div className="portfolio-placeholder" style={{ background: project.gradient }}>
                    <svg viewBox="0 0 24 24" fill="white" width="80" height="80">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                </div>
                <div className="portfolio-content">
                  <div className="portfolio-category">
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </div>
                  <h3 className="portfolio-title">{project.title}</h3>
                  <p className="portfolio-description">{project.description}</p>
                  <div className="portfolio-tags">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Want to See Your Project Here?</h2>
            <p className="cta-text">
              Let's collaborate and create something amazing together.
            </p>
            <Link to="/contact" className="btn btn-large">Start Your Project</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Portfolio

