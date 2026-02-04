import { useEffect, useState } from 'react'
import { fetchAllPages, fetchPageSEO, savePageSEO, Page, type PageSEO } from '../../utils/api'
import './Settings.css'

const PageSEO = () => {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [pageSEO, setPageSEO] = useState<PageSEO>({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: ''
  })
  const [pageSEOLoading, setPageSEOLoading] = useState(false)
  const [showPageSEOModal, setShowPageSEOModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      const pagesData = await fetchAllPages()
      setPages(pagesData)
    } catch (error) {
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageClick = async (page: Page) => {
    setSelectedPage(page)
    setPageSEOLoading(true)
    setShowPageSEOModal(true)
    
    try {
      const seoData = await fetchPageSEO(page.path)
      setPageSEO(seoData)
    } catch (error) {
      console.error('Error loading page SEO:', error)
      setPageSEO({
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        canonicalUrl: ''
      })
    } finally {
      setPageSEOLoading(false)
    }
  }

  const handlePageSEOSave = async () => {
    if (!selectedPage) return
    
    setSaving(true)
    setSaveMessage(null)
    try {
      await savePageSEO(selectedPage.path, pageSEO)
      setSaveMessage({ type: 'success', text: 'Page SEO settings saved successfully!' })
      setTimeout(() => {
        setSaveMessage(null)
        setShowPageSEOModal(false)
        setSelectedPage(null)
      }, 2000)
    } catch (error: any) {
      setSaveMessage({ type: 'error', text: error.message || 'Error saving page SEO' })
      setTimeout(() => setSaveMessage(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading pages...</div>
  }

  return (
    <div className="admin-settings">
      <div className="settings-content">
        <div className="settings-section">
          <h3>Page SEO Management</h3>
          <p className="settings-description">
            Manage SEO settings for individual pages. Click on a page to edit its meta tags, Open Graph tags, and canonical URL.
          </p>

          {saveMessage && (
            <div className={`save-message save-message-${saveMessage.type}`}>
              <span className="message-icon">{saveMessage.type === 'success' ? '✅' : '❌'}</span>
              <span className="message-text">{saveMessage.text}</span>
            </div>
          )}

          <div className="pages-list">
            {pages.length === 0 ? (
              <div className="loading">No pages found.</div>
            ) : (
              <div className="pages-grid">
                {pages.map((page) => (
                  <div 
                    key={page.path} 
                    className="page-card"
                    onClick={() => handlePageClick(page)}
                  >
                    <div className="page-card-header">
                      <h4 className="page-name">{page.name}</h4>
                      <span className={`page-type-badge ${page.type}`}>
                        {page.type === 'static' ? 'Static' : 'Dynamic'}
                      </span>
                    </div>
                    <p className="page-path">{page.path}</p>
                    <button className="page-edit-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit SEO
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page SEO Edit Modal */}
      {showPageSEOModal && selectedPage && (
        <div className="modal-overlay" onClick={() => setShowPageSEOModal(false)}>
          <div className="modal-content page-seo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-content">
                <h2>Edit SEO Settings</h2>
                <div className="modal-page-info">
                  <span className="modal-page-name">{selectedPage.name}</span>
                  <span className="modal-page-path">{selectedPage.path}</span>
                </div>
              </div>
              <button 
                className="modal-close"
                onClick={() => setShowPageSEOModal(false)}
                aria-label="Close modal"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {pageSEOLoading ? (
              <div className="loading">Loading SEO settings...</div>
            ) : (
              <div className="page-seo-form">
                <div className="setting-item">
                  <label>Meta Title *</label>
                  <input
                    type="text"
                    value={pageSEO.metaTitle}
                    onChange={(e) => setPageSEO({ ...pageSEO, metaTitle: e.target.value })}
                    placeholder="Page Title - TechMorpho"
                    maxLength={60}
                  />
                  <small>
                    <span style={{ flex: 1 }}>Recommended: 50-60 characters for optimal SEO</span>
                    <span className={`char-counter ${pageSEO.metaTitle.length > 60 ? 'error' : pageSEO.metaTitle.length < 50 && pageSEO.metaTitle.length > 0 ? 'warning' : ''}`}>
                      {pageSEO.metaTitle.length}/60
                    </span>
                  </small>
                </div>

                <div className="setting-item">
                  <label>Meta Description *</label>
                  <textarea
                    value={pageSEO.metaDescription}
                    onChange={(e) => setPageSEO({ ...pageSEO, metaDescription: e.target.value })}
                    placeholder="A compelling description of this page that will appear in search results..."
                    rows={4}
                    maxLength={160}
                  />
                  <small>
                    <span style={{ flex: 1 }}>Recommended: 150-160 characters for optimal SEO</span>
                    <span className={`char-counter ${pageSEO.metaDescription.length > 160 ? 'error' : pageSEO.metaDescription.length < 150 && pageSEO.metaDescription.length > 0 ? 'warning' : ''}`}>
                      {pageSEO.metaDescription.length}/160
                    </span>
                  </small>
                </div>

                <div className="setting-item">
                  <label>Meta Keywords</label>
                  <input
                    type="text"
                    value={pageSEO.metaKeywords}
                    onChange={(e) => setPageSEO({ ...pageSEO, metaKeywords: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <small>Comma-separated keywords for this page</small>
                </div>

                <div className="seo-divider">
                  <h4>Open Graph (Social Media)</h4>
                  <p className="settings-description">These tags control how your page appears when shared on social media.</p>
                </div>

                <div className="setting-item">
                  <label>OG Title</label>
                  <input
                    type="text"
                    value={pageSEO.ogTitle}
                    onChange={(e) => setPageSEO({ ...pageSEO, ogTitle: e.target.value })}
                    placeholder="Leave empty to use Meta Title"
                  />
                  <small>Title for social media shares (defaults to Meta Title if empty)</small>
                </div>

                <div className="setting-item">
                  <label>OG Description</label>
                  <textarea
                    value={pageSEO.ogDescription}
                    onChange={(e) => setPageSEO({ ...pageSEO, ogDescription: e.target.value })}
                    placeholder="Leave empty to use Meta Description"
                    rows={3}
                  />
                  <small>Description for social media shares (defaults to Meta Description if empty)</small>
                </div>

                <div className="setting-item">
                  <label>OG Image URL</label>
                  <input
                    type="url"
                    value={pageSEO.ogImage}
                    onChange={(e) => setPageSEO({ ...pageSEO, ogImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <small>Image URL for social media shares (recommended: 1200x630px)</small>
                </div>

                <div className="seo-divider">
                  <h4>Advanced</h4>
                </div>

                <div className="setting-item">
                  <label>Canonical URL</label>
                  <input
                    type="url"
                    value={pageSEO.canonicalUrl}
                    onChange={(e) => setPageSEO({ ...pageSEO, canonicalUrl: e.target.value })}
                    placeholder="Leave empty to use current page URL"
                  />
                  <small>Canonical URL for this page (defaults to current URL if empty)</small>
                </div>

                <div className="settings-actions">
                  <button 
                    onClick={handlePageSEOSave} 
                    className="btn-primary btn-save" 
                    disabled={saving || !pageSEO.metaTitle || !pageSEO.metaDescription}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-small"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                          <polyline points="17 21 17 13 7 13 7 21"/>
                          <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Save SEO Settings
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      setShowPageSEOModal(false)
                      setSelectedPage(null)
                    }}
                    className="btn-secondary btn-cancel"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PageSEO

