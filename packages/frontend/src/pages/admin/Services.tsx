import { useEffect, useState, useCallback } from 'react'
import { apiRequest } from '../../utils/api'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './Services.css'

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
  content?: string
  sections?: ContentSection[]
  heroBanner?: HeroBanner
  icon?: string
  features: string[]
  tag?: string
  category?: string
  featured: boolean
  order: number
  active: boolean
  showInNav: boolean
}

interface ContentSection {
  id: string
  title: string
  content: string
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [iconTab, setIconTab] = useState<'emoji' | 'upload' | 'svg'>('emoji')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    sections: [] as ContentSection[],
    heroBanner: null as HeroBanner | null,
    icon: '',
    features: '',
    tag: '',
    category: '',
    featured: false,
    order: 0,
    active: true,
    showInNav: false
  })

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const data = await apiRequest('/admin/services')
      setServices(data.data)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const features = formData.features.split('\n').filter(f => f.trim())
      const payload = {
        ...formData,
        features,
        sections: formData.sections.length > 0 ? formData.sections : undefined,
        heroBanner: formData.heroBanner && (formData.heroBanner.title || formData.heroBanner.subtitle || formData.heroBanner.image) ? formData.heroBanner : undefined,
        order: parseInt(String(formData.order)) || 0
      }

      if (editingService) {
        await apiRequest(`/admin/services/${editingService.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        })
      } else {
        await apiRequest('/admin/services', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
      }

      setShowModal(false)
      setEditingService(null)
      resetForm()
      loadServices()
      alert('Service saved successfully!')
    } catch (error: any) {
      console.error('Error saving service:', error)
      const errorMessage = error?.message || error?.response?.data?.message || 'Error saving service. Please try again.'
      alert(errorMessage)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description,
      content: service.content || '',
      sections: service.sections || [],
      heroBanner: service.heroBanner || null,
      icon: service.icon || '',
      features: service.features.join('\n'),
      tag: service.tag || '',
      category: service.category || '',
      featured: service.featured,
      order: service.order,
      active: service.active,
      showInNav: service.showInNav
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      await apiRequest(`/admin/services/${id}`, { method: 'DELETE' })
      loadServices()
    } catch (error: any) {
      alert(error.message || 'Error deleting service')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      sections: [],
      heroBanner: null,
      icon: '',
      features: '',
      tag: '',
      category: '',
      featured: false,
      order: 0,
      active: true,
      showInNav: false
    })
  }

  // Compress image before uploading
  const compressImage = (file: File, maxWidth: number = 1920, maxHeight: number = 600, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Could not compress image'))
                return
              }
              const reader = new FileReader()
              reader.onloadend = () => {
                resolve(reader.result as string)
              }
              reader.onerror = reject
              reader.readAsDataURL(blob)
            },
            'image/jpeg',
            quality
          )
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleHeroBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Compress image to reduce size
    try {
      const compressedImage = await compressImage(file)
      setFormData({
        ...formData,
        heroBanner: {
          ...formData.heroBanner,
          image: compressedImage
        } as HeroBanner
      })
    } catch (error) {
      console.error('Error compressing image:', error)
      alert('Error processing image. Please try again.')
    }
  }

  const addSection = () => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      title: '',
      content: ''
    }
    setFormData({ ...formData, sections: [...formData.sections, newSection] })
  }

  const updateSection = useCallback((id: string, field: 'title' | 'content', value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    }))
  }, [])

  const removeSection = (id: string) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter(section => section.id !== id)
    })
  }

  const moveSectionUp = (index: number) => {
    if (index === 0) return
    const newSections = [...formData.sections]
    const temp = newSections[index]
    newSections[index] = newSections[index - 1]
    newSections[index - 1] = temp
    setFormData({ ...formData, sections: newSections })
  }

  const moveSectionDown = (index: number) => {
    if (index === formData.sections.length - 1) return
    const newSections = [...formData.sections]
    const temp = newSections[index]
    newSections[index] = newSections[index + 1]
    newSections[index + 1] = temp
    setFormData({ ...formData, sections: newSections })
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  // Common emojis and icons for quick selection
  const commonIcons = [
    '💻', '🌐', '📱', '⚡', '🔒', '☁️', '📊', '🎨', '🚀', '💡',
    '🔧', '🛠️', '📈', '🎯', '🌟', '✨', '🔥', '💎', '🎪', '🏆',
    '📦', '🔐', '🌍', '💼', '🎭', '🎬', '📸', '🎵', '🎮', '🤖'
  ]

  // SVG path icons
  const svgIcons = [
    { name: 'Code', path: 'M8 3l4 8-4 8M16 21l-4-8 4-8' },
    { name: 'Globe', path: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
    { name: 'Mobile', path: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { name: 'Cloud', path: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
    { name: 'Shield', path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { name: 'Rocket', path: 'M5 13l4 4L19 7' },
    { name: 'Lightbulb', path: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { name: 'Chart', path: 'M3 3v18h18M7 12l4-4 4 4 6-6' }
  ]

  const handleIconSelect = (icon: string) => {
    setFormData({ ...formData, icon })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFormData({ ...formData, icon: base64String })
    }
    reader.readAsDataURL(file)
  }

  const handleSvgChange = (svg: string) => {
    setFormData({ ...formData, icon: svg })
  }

  const renderIconPreview = (icon: string | null) => {
    if (!icon) {
      return (
        <div className="icon-preview-placeholder">
          <span>No icon selected</span>
        </div>
      )
    }

    // Check if it's an emoji
    if (/[\u{1F300}-\u{1F9FF}]/u.test(icon)) {
      return <span className="icon-preview-emoji">{icon}</span>
    }

    // Check if it's base64 image
    if (icon.startsWith('data:image/')) {
      return <img src={icon} alt="Icon preview" className="icon-preview-image" />
    }

    // Check if it's SVG code
    if (icon.includes('<svg') || icon.includes('viewBox')) {
      return <div className="icon-preview-svg" dangerouslySetInnerHTML={{ __html: icon }} />
    }

    // SVG path
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="icon-preview-svg-path">
        <path d={icon} />
      </svg>
    )
  }


  if (loading) {
    return <div className="loading">Loading services...</div>
  }

  return (
    <div className="admin-services">
      <div className="page-header">
        <button onClick={() => { setShowModal(true); resetForm(); setEditingService(null) }} className="btn-primary">
          + Add New Service
        </button>
      </div>

      <div className="services-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Category</th>
              <th>Tag</th>
              <th>Featured</th>
              <th>Active</th>
              <th>In Nav</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.title}</td>
                <td><code>{service.slug}</code></td>
                <td>{service.category || '-'}</td>
                <td>{service.tag || '-'}</td>
                <td>{service.featured ? '⭐' : '-'}</td>
                <td>{service.active ? '✅' : '❌'}</td>
                <td>{service.showInNav ? '🔗' : '-'}</td>
                <td>{service.order}</td>
                <td>
                  <button onClick={() => handleEdit(service)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(service.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); setEditingService(null) }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <p className="modal-subtitle">Fill in the details below to create or update a service</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Section 1: Basic Information */}
              <div className="form-section">
                <div className="form-section-header">
                  <div className="section-number">1</div>
                  <div>
                    <h3>Basic Information</h3>
                    <p>Enter the service name and URL identifier</p>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Service Title <span className="required">*</span></label>
                  <p className="field-hint">The main name of your service (e.g., "Web Development")</p>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })
                    }}
                    placeholder="Enter service title..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>URL Slug <span className="required">*</span></label>
                  <p className="field-hint">Auto-generated from title. This will be used in the URL (e.g., "web-development")</p>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="web-development"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Short Description <span className="required">*</span></label>
                  <p className="field-hint">A brief summary that will appear on service cards (2-3 sentences recommended)</p>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this service offers..."
                    required
                    rows={4}
                  />
                </div>
              </div>

              {/* Section 2: Visual Elements */}
              <div className="form-section">
                <div className="form-section-header">
                  <div className="section-number">2</div>
                  <div>
                    <h3>Visual Elements</h3>
                    <p>Select an icon and customize the hero banner for this service</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Service Icon</label>
                  <p className="field-hint">Choose an icon to represent this service visually</p>
                  <div className="icon-selector-container">
                    <div className="icon-preview-wrapper">
                      {renderIconPreview(formData.icon)}
                    </div>
                    
                    <div className="icon-selector-tabs">
                      <button
                        type="button"
                        className={`icon-tab ${iconTab === 'emoji' ? 'active' : ''}`}
                        onClick={() => setIconTab('emoji')}
                      >
                        📱 Emoji/Icons
                      </button>
                      <button
                        type="button"
                        className={`icon-tab ${iconTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setIconTab('upload')}
                      >
                        📤 Upload Image
                      </button>
                      <button
                        type="button"
                        className={`icon-tab ${iconTab === 'svg' ? 'active' : ''}`}
                        onClick={() => setIconTab('svg')}
                      >
                        🎨 SVG Code
                      </button>
                    </div>

                    <div className="icon-selector-content">
                      {iconTab === 'emoji' && (
                        <div className="icon-selector-emoji">
                          <div className="emoji-grid">
                            {commonIcons.map((emoji, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className={`emoji-btn ${formData.icon === emoji ? 'selected' : ''}`}
                                onClick={() => handleIconSelect(emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                          <div className="svg-icons-grid">
                            <p className="svg-icons-label">Or select an SVG icon:</p>
                            <div className="svg-icons-list">
                              {svgIcons.map((svgIcon, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className={`svg-icon-btn ${formData.icon === svgIcon.path ? 'selected' : ''}`}
                                  onClick={() => handleIconSelect(svgIcon.path)}
                                  title={svgIcon.name}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d={svgIcon.path} />
                                  </svg>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="emoji-input-group">
                            <input
                              type="text"
                              placeholder="Or type an emoji directly..."
                              value={formData.icon && /[\u{1F300}-\u{1F9FF}]/u.test(formData.icon) ? formData.icon : ''}
                              onChange={(e) => handleIconSelect(e.target.value)}
                              className="emoji-input"
                            />
                          </div>
                        </div>
                      )}

                      {iconTab === 'upload' && (
                        <div className="icon-selector-upload">
                          <label className="upload-label">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="file-input"
                            />
                            <div className="upload-area">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                              </svg>
                              <p>Click to upload or drag and drop</p>
                              <p className="upload-hint">PNG, JPG, SVG up to 2MB</p>
                            </div>
                          </label>
                          {formData.icon && formData.icon.startsWith('data:image/') && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, icon: '' })
                              }}
                              className="remove-icon-btn"
                            >
                              Remove Image
                            </button>
                          )}
                        </div>
                      )}

                      {iconTab === 'svg' && (
                        <div className="icon-selector-svg">
                          <textarea
                            placeholder="Paste your SVG code here...&#10;Example: &lt;svg viewBox=&quot;0 0 24 24&quot;&gt;&lt;path d=&quot;M12 2L2 7l10 5 10-5-10-5z&quot;/&gt;&lt;/svg&gt;"
                            value={formData.icon && (formData.icon.includes('<svg') || formData.icon.includes('viewBox')) ? formData.icon : ''}
                            onChange={(e) => handleSvgChange(e.target.value)}
                            rows={8}
                            className="svg-code-input"
                          />
                          <p className="svg-hint">You can also paste just an SVG path (e.g., "M12 2L2 7l10 5 10-5-10-5z")</p>
                          <input
                            type="text"
                            placeholder="Or enter SVG path directly..."
                            value={formData.icon && !formData.icon.includes('<svg') && !formData.icon.includes('viewBox') && !formData.icon.startsWith('data:') && !/[\u{1F300}-\u{1F9FF}]/u.test(formData.icon) ? formData.icon : ''}
                            onChange={(e) => handleSvgChange(e.target.value)}
                            className="svg-path-input"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, icon: '' })
                      }}
                      className="clear-icon-btn"
                    >
                      Clear Icon
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Hero Banner <span className="optional-badge">Optional</span></label>
                  <p className="field-hint">Customize the hero banner for this service page. Leave empty to use defaults.</p>
                  
                  <div className="hero-banner-wrapper">
                    <div className="form-group">
                      <label>Hero Title</label>
                      <input
                        type="text"
                        value={formData.heroBanner?.title || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          heroBanner: { ...formData.heroBanner, title: e.target.value } as HeroBanner
                        })}
                        placeholder="Leave empty to use service title"
                      />
                    </div>

                    <div className="form-group">
                      <label>Hero Subtitle</label>
                      <textarea
                        value={formData.heroBanner?.subtitle || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          heroBanner: { ...formData.heroBanner, subtitle: e.target.value } as HeroBanner
                        })}
                        placeholder="Add a custom subtitle for the hero section"
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label>Hero Background Image</label>
                      {!formData.heroBanner?.image ? (
                        <label className="upload-label">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroBannerImageUpload}
                            className="file-input"
                          />
                          <div className="upload-area">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                            </svg>
                            <p>Click to upload background image</p>
                            <p className="upload-hint">PNG, JPG, SVG up to 5MB (recommended: 1920x600px)</p>
                          </div>
                        </label>
                      ) : (
                        <div className="image-preview-wrapper">
                          <img
                            src={formData.heroBanner.image}
                            alt="Hero banner preview"
                            className="image-preview"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              heroBanner: { ...formData.heroBanner, image: undefined } as HeroBanner
                            })}
                            className="remove-icon-btn"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.heroBanner?.showBreadcrumb !== false}
                          onChange={(e) => setFormData({
                            ...formData,
                            heroBanner: { ...formData.heroBanner, showBreadcrumb: e.target.checked } as HeroBanner
                          })}
                        />
                        <span>Show Breadcrumb Navigation</span>
                      </label>
                    </div>

                    {(formData.heroBanner?.title || formData.heroBanner?.subtitle || formData.heroBanner?.image) && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, heroBanner: null })}
                        className="btn-secondary clear-hero-btn"
                      >
                        Clear All Hero Banner Settings
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Content & Features */}
              <div className="form-section">
                <div className="form-section-header">
                  <div className="section-number">3</div>
                  <div>
                    <h3>Content & Features</h3>
                    <p>Add detailed content and list key features of this service</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Key Features <span className="required">*</span></label>
                  <p className="field-hint">List the main features or benefits (one per line). These will appear as bullet points.</p>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={6}
                    placeholder="Fast delivery&#10;24/7 support&#10;Quality assurance&#10;Competitive pricing"
                  />
                </div>

                <div className="form-group">
                  <label>Detailed Content <span className="optional-badge">Optional</span></label>
                  <p className="field-hint">Write detailed content about this service. Use the rich text editor to format text, add headings, lists, and more.</p>
                  <div className="editor-wrapper">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(value: string) => {
                        setFormData(prev => ({ ...prev, content: value }))
                      }}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'color': [] }, { 'background': [] }],
                          ['link', 'image'],
                          ['clean']
                        ]
                      }}
                      placeholder="Write detailed content about this service..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="section-header">
                    <label>Content Sections <span className="optional-badge">Recommended</span></label>
                    <button type="button" onClick={addSection} className="btn-add-section">
                      + Add Section
                    </button>
                  </div>
                  <p className="field-hint">Break down your service content into organized sections. Each section will appear as a separate card.</p>
                  
                  {formData.sections.length > 0 && (
                    <div className="content-sections-list">
                      {formData.sections.map((section, index) => (
                        <div key={section.id} className="content-section-item">
                          <div className="section-item-header">
                            <span className="section-number">Section {index + 1}</span>
                            <div className="section-controls">
                              <button
                                type="button"
                                onClick={() => moveSectionUp(index)}
                                disabled={index === 0}
                                className="btn-move"
                                title="Move up"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveSectionDown(index)}
                                disabled={index === formData.sections.length - 1}
                                className="btn-move"
                                title="Move down"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSection(section.id)}
                                className="btn-remove"
                                title="Remove section"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          
                          <input
                            type="text"
                            placeholder="Section Title"
                            value={section.title}
                            onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                            className="section-title-input"
                          />
                          
                          <div className="editor-wrapper section-editor">
                            <ReactQuill
                              theme="snow"
                              value={section.content}
                              onChange={(value: string) => {
                                updateSection(section.id, 'content', value)
                              }}
                              modules={{
                                toolbar: [
                                  [{ 'header': [3, 4, false] }],
                                  ['bold', 'italic', 'underline'],
                                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                  ['link'],
                                  ['clean']
                                ]
                              }}
                              placeholder="Write section content..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formData.sections.length === 0 && (
                    <div className="empty-state">
                      <p>No content sections added yet. Click "+ Add Section" to create one.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Categories & Settings */}
              <div className="form-section">
                <div className="form-section-header">
                  <div className="section-number">4</div>
                  <div>
                    <h3>Categories & Settings</h3>
                    <p>Organize and configure how this service appears on your website</p>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category <span className="optional-badge">Optional</span></label>
                    <p className="field-hint">Group related services (e.g., "IT Services", "Digital Marketing")</p>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., IT Services"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tag <span className="optional-badge">Optional</span></label>
                    <p className="field-hint">Add a badge (e.g., "Popular", "Trending", "New")</p>
                    <input
                      type="text"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      placeholder="e.g., Popular"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Display Order</label>
                  <p className="field-hint">Lower numbers appear first (0 = highest priority)</p>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Visibility & Display Options</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      />
                      <span>
                        <strong>Active</strong> - Service is visible on the website
                      </span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <span>
                        <strong>Featured</strong> - Highlight this service on the homepage
                      </span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.showInNav}
                        onChange={(e) => setFormData({ ...formData, showInNav: e.target.checked })}
                      />
                      <span>
                        <strong>Show in Navigation</strong> - Include in the main menu
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); setEditingService(null) }} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Services

