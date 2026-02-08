import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

const About = () => {
  const coreBeliefs = [
    {
      title: 'We believe that the right technology and a smart digital strategy can transform a business. We are here to make that transformation accessible and effective for you.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      )
    },
    {
      title: "Being a new company means we bring a fresh, agile, and highly adaptable approach to every project. We're unburdened by legacy thinking, allowing us to innovate freely and tailor solutions precisely to your unique challenges.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      )
    },
    {
      title: 'The digital world evolves rapidly, and so do we. Our team is committed to continuous learning and professional development, ensuring we are always equipped with the most effective tools and knowledge to serve you. This dedication to expertise is at the heart of everything we do.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      )
    }
  ]

  const missionGoals = [
    'Simplify Technology: Demystify complex IT concepts and provide user-friendly, efficient solutions that truly benefit your operations.',
    'Amplify Your Reach: Connect you with your ideal customers through targeted and effective digital marketing strategies.',
    'Build Digital Resilience: Equip your business with secure and scalable solutions that can adapt to future demands and threats.'
  ]

  const itServices = [
    {
      title: 'Custom Software Development',
      description: 'Creating bespoke applications that streamline your workflows and enhance productivity. We focus on scalable, efficient, and user-friendly software solutions.'
    },
    {
      title: 'Cloud Solutions & Migration',
      description: 'Helping you transition to and optimize powerful cloud computing platforms like AWS and Azure for enhanced flexibility and cost efficiency.'
    },
    {
      title: 'IT Consulting & Strategy',
      description: 'Providing clear guidance and a strategic roadmap for your technology investments, ensuring your IT infrastructure supports your business goals.'
    },
    {
      title: 'Cybersecurity Solutions',
      description: 'Protecting your valuable data and systems with robust cybersecurity measures to ensure your business remains secure and compliant.'
    },
    {
      title: 'Managed IT Services',
      description: 'Taking the burden of IT management off your shoulders, ensuring your systems run smoothly and efficiently, so you can focus on your core business.'
    }
  ]

  const digitalMarketingServices = [
    {
      title: 'Search Engine Optimization (SEO)',
      description: 'Boosting your online visibility and attracting more organic traffic to your website through expert SEO strategies.'
    },
    {
      title: 'Social Media Marketing (SMM)',
      description: 'Building a strong brand presence and engaging with your audience on platforms like Facebook, Instagram, and LinkedIn through effective social media campaigns.'
    },
    {
      title: 'Content Marketing',
      description: 'Crafting compelling and valuable content that resonates with your target audience, establishing your authority and driving engagement.'
    },
    {
      title: 'Pay-Per-Click (PPC) Advertising',
      description: 'Generating immediate leads and sales through highly targeted and cost-effective PPC campaigns on Google and social media.'
    },
    {
      title: 'Website Design & Development',
      description: 'Creating stunning, functional, and user-friendly websites that serve as powerful assets for your business, optimized for performance and conversions.'
    }
  ]

  const approachSteps = [
    {
      step: '01',
      title: 'Discovery & Understanding',
      description: 'We start by deeply understanding your business, your challenges, and your aspirations. We listen, ask questions, and gather all the necessary information.'
    },
    {
      step: '02',
      title: 'Strategy & Planning',
      description: 'Based on our understanding, we develop a customized strategy outlining the proposed solutions, timelines, and expected outcomes.'
    },
    {
      step: '03',
      title: 'Execution & Development',
      description: 'Our team then brings the strategy to life, developing and implementing the agreed-upon IT and digital marketing solutions with precision and expertise.'
    },
    {
      step: '04',
      title: 'Monitoring & Optimization',
      description: "We don't just set it and forget it. We continuously monitor performance, analyze data, and make ongoing adjustments to ensure optimal results."
    },
    {
      step: '05',
      title: 'Communication & Support',
      description: "We believe in open and consistent communication. You'll be kept informed every step of the way, and our team will be readily available to answer your questions and provide support."
    }
  ]

  const whyChoosePoints = [
    {
      title: 'Dedicated Focus',
      description: "We're passionate about making a name for ourselves by making your business succeed. This means you'll receive our undivided attention and a highly personalized service.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="6"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      )
    },
    {
      title: 'Innovative Solutions',
      description: "We're always exploring new technologies and creative strategies to give you a competitive edge.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )
    },
    {
      title: 'Transparent Communication',
      description: 'No jargon, no hidden fees. We believe in clear, honest communication throughout our partnership.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          <path d="M8 10h8M8 14h6"/>
        </svg>
      )
    },
    {
      title: 'Measurable Results',
      description: 'Our focus is always on delivering tangible outcomes that contribute directly to your business growth.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18"/>
          <path d="M7 16l4-4 4 4 6-6"/>
          <path d="M7 12h10"/>
        </svg>
      )
    }
  ]

  return (
    <>
      <SEOHead 
        defaultTitle="About Us - TechMorpho IT Solutions"
        defaultDescription="Learn about TechMorpho - your trusted partner for innovative IT solutions and digital excellence."
      />
      
      {/* Hero Section */}
      <section className="about-hero-modern">
        <div className="container">
          <div className="about-hero-content-modern">
            <div className="hero-badge-modern">About TechMorpho</div>
            <h1 className="hero-title-modern">Your Vision, Our Innovation</h1>
            <div className="hero-text-modern">
              <p>Welcome to TechMorpho, where we're shaping the future of businesses through innovative IT services and strategic digital marketing solutions. Founded with a clear vision to empower businesses in Badlapur, Maharashtra, and beyond, we might be new to the scene, but our drive to deliver exceptional results is second to none. We believe that every business, regardless of its size or current digital footprint, deserves a robust online presence and efficient technological backbone to thrive in today's competitive landscape.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="about-section-modern about-section-alt">
        <div className="container">
          <div className="section-header-modern">
            <h2 className="section-title-modern">Who We Are: A Team Driven by Passion and Purpose</h2>
            <p className="section-subtitle-modern">Building Expertise and Trust - Emphasize Team's Capabilities</p>
          </div>
          <div className="about-content-modern">
            <p className="about-text-modern">At TechMorpho, we're more than just a service provider; we're a collective of passionate IT and digital marketing specialists united by a common goal: your success. While we're building our industry experience, our team comprises dedicated professionals with a deep understanding of their respective fields. We continuously immerse ourselves in the latest technological advancements and digital trends, ensuring that the solutions we craft for you are not just current, but future-proof.</p>
          </div>
          
          <div className="core-beliefs-grid">
            {coreBeliefs.map((belief, index) => (
              <div key={index} className="core-belief-card">
                <div className="core-belief-icon">{belief.icon}</div>
                <p className="core-belief-text">{belief.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section-modern">
        <div className="container">
          <div className="section-header-modern">
            <h2 className="section-title-modern">Our Mission: Empowering Your Digital Journey</h2>
            <p className="section-subtitle-modern">Clearly Stating Purpose and Value Proposition</p>
          </div>
          <div className="about-content-modern">
            <p className="about-text-modern">Our mission at TechMorpho is simple: to empower small and medium-sized businesses with the digital tools and strategies they need to grow, compete, and succeed. We understand the challenges businesses face from managing complex IT infrastructure to reaching target audiences online. That's why we've carefully curated a suite of IT services and digital marketing solutions designed to address these pain points directly.</p>
          </div>
          
          <div className="mission-goals-list">
            {missionGoals.map((goal, index) => (
              <div key={index} className="mission-goal-item">
                <div className="mission-goal-number">{String(index + 1).padStart(2, '0')}</div>
                <p className="mission-goal-text">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="about-section-modern about-section-alt">
        <div className="container">
          <div className="section-header-modern">
            <h2 className="section-title-modern">What We Offer: Tailored Solutions for Tangible Results</h2>
            <p className="section-subtitle-modern">Explaining Services and Benefits with Keywords</p>
          </div>
          <div className="about-content-modern">
            <p className="about-text-modern">At TechMorpho, we focus on delivering customized IT services and data-driven digital marketing campaigns that align perfectly with your business objectives. We don't believe in one-size-fits-all solutions. Instead, we work closely with you to understand your specific needs and craft strategies that deliver measurable results.</p>
          </div>

          <div className="services-section-wrapper">
            <div className="services-category">
              <h3 className="services-category-title">Our IT Services include:</h3>
              <div className="services-grid-modern">
                {itServices.map((service, index) => (
                  <div key={index} className="service-card-about">
                    <div className="service-card-number">{String(index + 1).padStart(2, '0')}</div>
                    <h4 className="service-card-title">{service.title}</h4>
                    <p className="service-card-description">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="services-category">
              <h3 className="services-category-title">Our Digital Marketing Solutions include:</h3>
              <div className="services-grid-modern">
                {digitalMarketingServices.map((service, index) => (
                  <div key={index} className="service-card-about">
                    <div className="service-card-number">{String(index + 1).padStart(2, '0')}</div>
                    <h4 className="service-card-title">{service.title}</h4>
                    <p className="service-card-description">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="about-section-modern">
        <div className="container">
          <div className="section-header-modern">
            <h2 className="section-title-modern">Our Approach: Collaborative, Transparent, and Results-Oriented</h2>
            <p className="section-subtitle-modern">How You Work - Building Trust through Process</p>
          </div>
          <div className="about-content-modern">
            <p className="about-text-modern">Even as beginners, our commitment to a structured and client-focused approach is unwavering. We follow a clear process to ensure transparency, efficiency, and ultimately, your satisfaction:</p>
          </div>

          <div className="approach-timeline">
            {approachSteps.map((step, index) => (
              <div key={index} className="approach-step-card">
                <div className="approach-step-header">
                  <div className="approach-step-number">{step.step}</div>
                  <h4 className="approach-step-title">{step.title}</h4>
                </div>
                <p className="approach-step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose TechMorpho Section */}
      <section className="about-section-modern about-section-alt">
        <div className="container">
          <div className="section-header-modern">
            <h2 className="section-title-modern">Why Choose TechMorpho? Your Success is Our Foundation</h2>
            <p className="section-subtitle-modern">Reiterating Value Proposition for New Clients</p>
          </div>
          <div className="about-content-modern">
            <p className="about-text-modern">We understand you have choices when it comes to IT services and digital marketing companies. As a new entrant in the industry, we're driven by an insatiable desire to prove our capabilities and build lasting relationships based on trust and mutual success.</p>
            <p className="about-text-modern about-text-spacing">When you partner with TechMorpho, you benefit from:</p>
          </div>

          <div className="why-choose-grid-modern">
            {whyChoosePoints.map((point, index) => (
              <div key={index} className="why-choose-card-modern">
                <div className="why-choose-icon-wrapper">
                  <div className="why-choose-icon-bg">
                    {point.icon}
                  </div>
                </div>
                <h4 className="why-choose-title">{point.title}</h4>
                <p className="why-choose-description">{point.description}</p>
              </div>
            ))}
          </div>

          <div className="about-cta-modern">
            <p className="about-cta-text">We're excited to embark on this journey with you. Let TechMorpho be the catalyst for your digital transformation.</p>
            <Link to="/contact" className="btn btn-large btn-primary-modern">Get Started Today</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
