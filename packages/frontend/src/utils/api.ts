const API_BASE = '/api'

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('admin_token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Use retry logic for all API requests
  const response = await retryFetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: headers as HeadersInit
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

// Helper function to retry requests with exponential backoff
const retryFetch = async (url: string, options: RequestInit = {}, maxRetries = 3, delay = 1000): Promise<Response> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)
      if (response.ok || response.status !== 503) {
        return response
      }
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

// Public API functions (no authentication required)
export const fetchPublicServices = async () => {
  try {
    const response = await retryFetch(`${API_BASE}/services`)
    if (!response.ok) {
      throw new Error('Failed to fetch services')
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching services:', error)
    throw error
  }
}

export const fetchServiceBySlug = async (slug: string) => {
  try {
    const response = await retryFetch(`${API_BASE}/services/${slug}`)
    if (!response.ok) {
      throw new Error('Failed to fetch service')
    }
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching service:', error)
    throw error
  }
}

export const fetchPublicSettings = async (category?: string) => {
  try {
    const url = category ? `${API_BASE}/settings?category=${category}` : `${API_BASE}/settings`
    const response = await retryFetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch settings')
    }
    const data = await response.json()
    return data.data || {}
  } catch (error) {
    console.error('Error fetching settings:', error)
    throw error
  }
}

// Page SEO API functions
export interface Page {
  name: string
  path: string
  type: 'static' | 'dynamic'
}

export interface PageSEO {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  canonicalUrl: string
}

export const fetchAllPages = async (): Promise<Page[]> => {
  try {
    const data = await apiRequest('/admin/settings/pages')
    return data.data || []
  } catch (error) {
    console.error('Error fetching pages:', error)
    throw error
  }
}

export const fetchPageSEO = async (path: string): Promise<PageSEO> => {
  try {
    // Use query parameter to avoid path encoding issues
    const encodedPath = encodeURIComponent(path)
    const data = await apiRequest(`/admin/settings/page-seo?path=${encodedPath}`)
    return data.data || {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      canonicalUrl: ''
    }
  } catch (error) {
    console.error('Error fetching page SEO:', error)
    throw error
  }
}

export const savePageSEO = async (path: string, seoData: PageSEO): Promise<void> => {
  try {
    const key = `page_seo_${path}`
    await apiRequest('/admin/settings', {
      method: 'POST',
      body: JSON.stringify({
        key,
        value: seoData,
        type: 'json',
        category: 'page_seo'
      })
    })
  } catch (error) {
    console.error('Error saving page SEO:', error)
    throw error
  }
}

export const fetchPublicPageSEO = async (path: string): Promise<PageSEO> => {
  try {
    // Use query parameter to avoid path encoding issues
    const encodedPath = encodeURIComponent(path)
    const response = await retryFetch(`${API_BASE}/settings/page-seo?path=${encodedPath}`)
    if (!response.ok) {
      throw new Error('Failed to fetch page SEO')
    }
    const data = await response.json()
    return data.data || {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      canonicalUrl: ''
    }
  } catch (error) {
    console.error('Error fetching public page SEO:', error)
    throw error
  }
}

