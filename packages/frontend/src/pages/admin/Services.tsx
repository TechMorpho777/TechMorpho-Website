import { useEffect, useState } from 'react'
import { apiRequest } from '../../utils/api'
import './Services.css'

interface Service {
  id: string
  title: string
  slug: string
  description: string
  icon?: string
  features: string[]
  tag?: string
  featured: boolean
  order: number
  active: boolean
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
    icon: '',
    features: '',
    tag: '',
    featured: false,
    order: 0,
    active: true
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
    } catch (error: any) {
      alert(error.message || 'Error saving service')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description,
      icon: service.icon || '',
      features: service.features.join('\n'),
      tag: service.tag || '',
      featured: service.featured,
      order: service.order,
      active: service.active
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
      icon: '',
      features: '',
      tag: '',
      featured: false,
      order: 0,
      active: true
    })
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
              <th>Tag</th>
              <th>Featured</th>
              <th>Active</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.title}</td>
                <td><code>{service.slug}</code></td>
                <td>{service.tag || '-'}</td>
                <td>{service.featured ? '⭐' : '-'}</td>
                <td>{service.active ? '✅' : '❌'}</td>
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
            <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Icon</label>
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
                      Emoji/Icons
                    </button>
                    <button
                      type="button"
                      className={`icon-tab ${iconTab === 'upload' ? 'active' : ''}`}
                      onClick={() => setIconTab('upload')}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      className={`icon-tab ${iconTab === 'svg' ? 'active' : ''}`}
                      onClick={() => setIconTab('svg')}
                    >
                      SVG Code
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
                <label>Features (one per line)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={4}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tag</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="Popular, Trending, etc."
                  />
                </div>

                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  Featured
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); setEditingService(null) }} className="btn-secondary">
                  Cancel
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

