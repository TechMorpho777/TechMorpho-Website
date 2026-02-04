import { useEffect, useState } from 'react'
import { apiRequest } from '../../utils/api'
import { fetchAllPages, fetchPageSEO, savePageSEO, Page, PageSEO } from '../../utils/api'
import './Settings.css'

const Settings = () => {
  const [settings, setSettings] = useState<any>({})
  const [localSettings, setLocalSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Page SEO state
  const [pages, setPages] = useState<Page[]>([])
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

  useEffect(() => {
    loadSettings()
    if (activeTab === 'page-seo') {
      loadPages()
    }
  }, [activeTab])

  const loadSettings = async () => {
    try {
      const data = await apiRequest('/admin/settings')
      const loadedSettings = data.data || {}
      setSettings(loadedSettings)
      setLocalSettings(loadedSettings)
      setHasChanges(false)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLocalSetting = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(settings))
  }

  const saveAllSettings = async () => {
    setSaving(true)
    setSaveMessage(null)
    
    try {
      // Get all settings that have changed
      const settingsToSave: Array<{ key: string; value: any; type: string; category: string }> = []
      
      // General settings
      if (localSettings.site_name !== settings.site_name) {
        settingsToSave.push({ key: 'site_name', value: localSettings.site_name || '', type: 'text', category: 'general' })
      }
      if (localSettings.site_url !== settings.site_url) {
        settingsToSave.push({ key: 'site_url', value: localSettings.site_url || '', type: 'text', category: 'general' })
      }
      if (localSettings.contact_email !== settings.contact_email) {
        settingsToSave.push({ key: 'contact_email', value: localSettings.contact_email || '', type: 'text', category: 'general' })
      }
      
      // SEO & Analytics
      if (localSettings.google_tag_manager_id !== settings.google_tag_manager_id) {
        settingsToSave.push({ key: 'google_tag_manager_id', value: localSettings.google_tag_manager_id || '', type: 'text', category: 'analytics' })
      }
      if (localSettings.google_analytics_id !== settings.google_analytics_id) {
        settingsToSave.push({ key: 'google_analytics_id', value: localSettings.google_analytics_id || '', type: 'text', category: 'analytics' })
      }
      if (localSettings.meta_description !== settings.meta_description) {
        settingsToSave.push({ key: 'meta_description', value: localSettings.meta_description || '', type: 'text', category: 'seo' })
      }
      if (localSettings.meta_keywords !== settings.meta_keywords) {
        settingsToSave.push({ key: 'meta_keywords', value: localSettings.meta_keywords || '', type: 'text', category: 'seo' })
      }
      
      // Social Media
      if (localSettings.social_facebook !== settings.social_facebook) {
        settingsToSave.push({ key: 'social_facebook', value: localSettings.social_facebook || '', type: 'text', category: 'social' })
      }
      if (localSettings.social_twitter !== settings.social_twitter) {
        settingsToSave.push({ key: 'social_twitter', value: localSettings.social_twitter || '', type: 'text', category: 'social' })
      }
      if (localSettings.social_linkedin !== settings.social_linkedin) {
        settingsToSave.push({ key: 'social_linkedin', value: localSettings.social_linkedin || '', type: 'text', category: 'social' })
      }
      if (localSettings.social_instagram !== settings.social_instagram) {
        settingsToSave.push({ key: 'social_instagram', value: localSettings.social_instagram || '', type: 'text', category: 'social' })
      }
      if (localSettings.social_youtube !== settings.social_youtube) {
        settingsToSave.push({ key: 'social_youtube', value: localSettings.social_youtube || '', type: 'text', category: 'social' })
      }
      if (localSettings.social_github !== settings.social_github) {
        settingsToSave.push({ key: 'social_github', value: localSettings.social_github || '', type: 'text', category: 'social' })
      }

      // Save all changed settings
      if (settingsToSave.length > 0) {
        await Promise.all(
          settingsToSave.map(setting => 
            apiRequest('/admin/settings', {
              method: 'POST',
              body: JSON.stringify(setting)
            })
          )
        )
        
        setSettings({ ...localSettings })
        setHasChanges(false)
        setSaveMessage({ type: 'success', text: `Successfully saved ${settingsToSave.length} setting(s)!` })
        
        // Clear message after 3 seconds
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage({ type: 'success', text: 'No changes to save.' })
        setTimeout(() => setSaveMessage(null), 2000)
      }
    } catch (error: any) {
      setSaveMessage({ type: 'error', text: error.message || 'Error saving settings' })
      setTimeout(() => setSaveMessage(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  const loadPages = async () => {
    try {
      const pagesData = await fetchAllPages()
      setPages(pagesData)
    } catch (error) {
      console.error('Error loading pages:', error)
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

  const generateSitemap = async () => {
    if (!confirm('Generate new sitemap? This will update the sitemap.xml file.')) return

    try {
      const data = await apiRequest('/admin/settings/sitemap/generate')
      alert(`Sitemap generated successfully! ${data.data.routes} routes added.`)
    } catch (error: any) {
      alert(error.message || 'Error generating sitemap')
    }
  }

  if (loading) {
    return <div className="loading">Loading settings...</div>
  }

  return (
    <div className="admin-settings">
      <div className="settings-tabs">
        <button
          className={`tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`tab ${activeTab === 'seo' ? 'active' : ''}`}
          onClick={() => setActiveTab('seo')}
        >
          SEO & Analytics
        </button>
        <button
          className={`tab ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          Social Media
        </button>
        <button
          className={`tab ${activeTab === 'page-seo' ? 'active' : ''}`}
          onClick={() => setActiveTab('page-seo')}
        >
          Page SEO
        </button>
        <button
          className={`tab ${activeTab === 'sitemap' ? 'active' : ''}`}
          onClick={() => setActiveTab('sitemap')}
        >
          Sitemap
        </button>
      </div>

      <div className="settings-content">
        {saveMessage && (
          <div className={`save-message save-message-${saveMessage.type}`}>
            <span className="message-icon">{saveMessage.type === 'success' ? '✅' : '❌'}</span>
            <span className="message-text">{saveMessage.text}</span>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="settings-section">
            <h3>General Settings</h3>
            <div className="setting-item">
              <label>Site Name</label>
              <input
                type="text"
                value={localSettings.site_name || 'TechMorpho IT Solutions'}
                onChange={(e) => updateLocalSetting('site_name', e.target.value)}
                placeholder="TechMorpho IT Solutions"
              />
            </div>

            <div className="setting-item">
              <label>Site URL</label>
              <input
                type="url"
                value={localSettings.site_url || ''}
                onChange={(e) => updateLocalSetting('site_url', e.target.value)}
                placeholder="https://techmorpho.in"
              />
            </div>

            <div className="setting-item">
              <label>Contact Email</label>
              <input
                type="email"
                value={localSettings.contact_email || 'info@techmorpho.in'}
                onChange={(e) => updateLocalSetting('contact_email', e.target.value)}
                placeholder="info@techmorpho.in"
              />
            </div>

            <div className="settings-actions">
              <button 
                onClick={saveAllSettings} 
                className="btn-primary btn-save" 
                disabled={saving || !hasChanges}
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
                    Save Changes
                  </>
                )}
              </button>
              {hasChanges && (
                <button 
                  onClick={loadSettings} 
                  className="btn-secondary btn-cancel"
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="settings-section">
            <h3>Google Tag Manager / Analytics</h3>
            
            <div className="setting-item">
              <label>Google Tag Manager ID (GTM-XXXXXXX)</label>
              <input
                type="text"
                value={localSettings.google_tag_manager_id || ''}
                onChange={(e) => updateLocalSetting('google_tag_manager_id', e.target.value)}
                placeholder="GTM-XXXXXXX"
              />
              <small>Enter your Google Tag Manager container ID</small>
            </div>

            <div className="setting-item">
              <label>Google Analytics ID (G-XXXXXXXXXX or UA-XXXXXXXXX-X)</label>
              <input
                type="text"
                value={localSettings.google_analytics_id || ''}
                onChange={(e) => updateLocalSetting('google_analytics_id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
              <small>Enter your Google Analytics measurement ID</small>
            </div>

            <div className="setting-item">
              <label>Meta Description</label>
              <textarea
                value={localSettings.meta_description || ''}
                onChange={(e) => updateLocalSetting('meta_description', e.target.value)}
                rows={3}
                placeholder="Default meta description for SEO"
              />
            </div>

            <div className="setting-item">
              <label>Meta Keywords</label>
              <input
                type="text"
                value={localSettings.meta_keywords || ''}
                onChange={(e) => updateLocalSetting('meta_keywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="settings-actions">
              <button 
                onClick={saveAllSettings} 
                className="btn-primary btn-save" 
                disabled={saving || !hasChanges}
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
                    Save Changes
                  </>
                )}
              </button>
              {hasChanges && (
                <button 
                  onClick={loadSettings} 
                  className="btn-secondary btn-cancel"
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="settings-section">
            <h3>Social Media Accounts</h3>
            <p className="settings-description">Add your social media profile URLs. These will appear in the website footer.</p>
            
            <div className="setting-item">
              <label>Facebook URL</label>
              <input
                type="url"
                value={localSettings.social_facebook || ''}
                onChange={(e) => updateLocalSetting('social_facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="setting-item">
              <label>Twitter/X URL</label>
              <input
                type="url"
                value={localSettings.social_twitter || ''}
                onChange={(e) => updateLocalSetting('social_twitter', e.target.value)}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            <div className="setting-item">
              <label>LinkedIn URL</label>
              <input
                type="url"
                value={localSettings.social_linkedin || ''}
                onChange={(e) => updateLocalSetting('social_linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>

            <div className="setting-item">
              <label>Instagram URL</label>
              <input
                type="url"
                value={localSettings.social_instagram || ''}
                onChange={(e) => updateLocalSetting('social_instagram', e.target.value)}
                placeholder="https://instagram.com/yourhandle"
              />
            </div>

            <div className="setting-item">
              <label>YouTube URL</label>
              <input
                type="url"
                value={localSettings.social_youtube || ''}
                onChange={(e) => updateLocalSetting('social_youtube', e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>

            <div className="setting-item">
              <label>GitHub URL</label>
              <input
                type="url"
                value={localSettings.social_github || ''}
                onChange={(e) => updateLocalSetting('social_github', e.target.value)}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div className="settings-actions">
              <button 
                onClick={saveAllSettings} 
                className="btn-primary btn-save" 
                disabled={saving || !hasChanges}
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
                    Save Changes
                  </>
                )}
              </button>
              {hasChanges && (
                <button 
                  onClick={loadSettings} 
                  className="btn-secondary btn-cancel"
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'page-seo' && (
          <div className="settings-section">
            <h3>Page SEO Management</h3>
            <p className="settings-description">
              Manage SEO settings for individual pages. Click on a page to edit its meta tags, Open Graph tags, and canonical URL.
            </p>

            <div className="pages-list">
              {pages.length === 0 ? (
                <div className="loading">Loading pages...</div>
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
        )}

        {activeTab === 'sitemap' && (
          <div className="settings-section">
            <h3>Sitemap Management</h3>
            
            <div className="setting-item">
              <p>Sitemap helps search engines discover and index your website pages.</p>
              <button onClick={generateSitemap} className="btn-primary" disabled={saving}>
                {saving ? 'Generating...' : 'Generate Sitemap'}
              </button>
            </div>

            <div className="setting-item">
              <label>Sitemap URL</label>
              <div className="sitemap-url">
                <input
                  type="text"
                  value={`${localSettings.site_url || 'https://techmorpho.in'}/sitemap.xml`}
                  readOnly
                />
                <button
                  onClick={() => window.open('/sitemap.xml', '_blank')}
                  className="btn-secondary"
                >
                  View Sitemap
                </button>
              </div>
              <small>Submit this URL to Google Search Console</small>
            </div>
          </div>
        )}
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

export default Settings

