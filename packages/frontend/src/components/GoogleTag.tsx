import { useEffect, useState } from 'react'

const GoogleTag = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) return

    // Load Google Tag Manager and Analytics from settings
    const loadAnalytics = async () => {
      try {
        // Use retry logic for this request
        const retryFetch = async (url: string, maxRetries = 3, delay = 1000): Promise<Response | null> => {
          for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
              const response = await fetch(url)
              if (response.ok || response.status !== 503) return response
              if (response.status === 503 && attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)))
                continue
              }
              return null
            } catch (error: any) {
              if (attempt < maxRetries && (error?.code === 'ECONNREFUSED' || error?.message?.includes('Failed to fetch'))) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)))
                continue
              }
              return null
            }
          }
          return null
        }
        
        const response = await retryFetch('/api/admin/settings?category=analytics')
        if (!response || !response.ok) return
        
        const data = await response.json()
        
        // Google Tag Manager
        if (data.data?.google_tag_manager_id) {
          const gtmId = data.data.google_tag_manager_id.trim()
          if (gtmId && gtmId.startsWith('GTM-')) {
            // GTM Script
            const gtmScript = document.createElement('script')
            gtmScript.innerHTML = `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `
            document.head.appendChild(gtmScript)

            // GTM Noscript
            const gtmNoscript = document.createElement('noscript')
            gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
            document.body.insertBefore(gtmNoscript, document.body.firstChild)
          }
        }

        // Google Analytics
        if (data.data?.google_analytics_id) {
          const gaId = data.data.google_analytics_id.trim()
          if (gaId && (gaId.startsWith('G-') || gaId.startsWith('UA-'))) {
            const gaScript = document.createElement('script')
            gaScript.async = true
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
            document.head.appendChild(gaScript)

            const gaConfig = document.createElement('script')
            gaConfig.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `
            document.head.appendChild(gaConfig)
          }
        }

        setLoaded(true)
      } catch (error) {
        // Silently fail - settings might not be accessible
        console.debug('Analytics settings not available')
      }
    }

    loadAnalytics()
  }, [loaded])

  return null
}

export default GoogleTag

