import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { fetchPublicPageSEO, PageSEO } from '../utils/api'

interface SEOHeadProps {
  defaultTitle?: string
  defaultDescription?: string
}

const SEOHead = ({ defaultTitle, defaultDescription }: SEOHeadProps) => {
  const location = useLocation()
  const [seoData, setSeoData] = useState<PageSEO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const path = location.pathname
        const data = await fetchPublicPageSEO(path)
        setSeoData(data)
      } catch (error) {
        console.error('Error loading SEO data:', error)
        setSeoData(null)
      } finally {
        setLoading(false)
      }
    }

    loadSEO()
  }, [location.pathname])

  if (loading || !seoData) {
    // Use defaults while loading or if no SEO data
    return (
      <Helmet>
        {defaultTitle && <title>{defaultTitle}</title>}
        {defaultDescription && <meta name="description" content={defaultDescription} />}
      </Helmet>
    )
  }

  const {
    metaTitle,
    metaDescription,
    metaKeywords,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl
  } = seoData

  // Use SEO data if available, otherwise use defaults
  const title = metaTitle || defaultTitle || 'TechMorpho IT Solutions'
  const description = metaDescription || defaultDescription || 'Innovative IT solutions and digital excellence'
  const keywords = metaKeywords || ''
  const ogTitleValue = ogTitle || title
  const ogDescriptionValue = ogDescription || description
  const ogImageValue = ogImage || ''
  const canonical = canonicalUrl || window.location.href

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitleValue} />
      <meta property="og:description" content={ogDescriptionValue} />
      {ogImageValue && <meta property="og:image" content={ogImageValue} />}
      <meta property="og:url" content={canonical} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitleValue} />
      <meta name="twitter:description" content={ogDescriptionValue} />
      {ogImageValue && <meta name="twitter:image" content={ogImageValue} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
    </Helmet>
  )
}

export default SEOHead

