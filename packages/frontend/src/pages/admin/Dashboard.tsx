import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../utils/api'
import './Dashboard.css'

interface Stats {
  total: number
  new: number
  contacted: number
  resolved: number
  archived: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [enquiriesData, statsData] = await Promise.all([
        apiRequest('/admin/enquiries?limit=5'),
        apiRequest('/admin/enquiries/stats/overview')
      ])
      setRecentEnquiries(enquiriesData.data)
      setStats(statsData.data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div>
          <h2>Welcome back! 👋</h2>
          <p>Here's what's happening with your enquiries today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-card-background"></div>
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.total || 0}</div>
            <div className="stat-label">Total Enquiries</div>
            <div className="stat-change positive">All time</div>
          </div>
        </div>

        <div className="stat-card stat-card-new">
          <div className="stat-card-background"></div>
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.new || 0}</div>
            <div className="stat-label">New Enquiries</div>
            <div className="stat-change positive">Requires attention</div>
          </div>
        </div>

        <div className="stat-card stat-card-contacted">
          <div className="stat-card-background"></div>
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.contacted || 0}</div>
            <div className="stat-label">Contacted</div>
            <div className="stat-change neutral">In progress</div>
          </div>
        </div>

        <div className="stat-card stat-card-resolved">
          <div className="stat-card-background"></div>
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.resolved || 0}</div>
            <div className="stat-label">Resolved</div>
            <div className="stat-change positive">Completed</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Recent Enquiries</h3>
              <p className="card-subtitle">Latest customer enquiries</p>
            </div>
            <Link to="/admin/enquiries" className="view-all-btn">
              View All
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="enquiries-list">
            {recentEnquiries.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <p>No enquiries yet</p>
                <span>New enquiries will appear here</span>
              </div>
            ) : (
              recentEnquiries.map((enquiry) => (
                <Link key={enquiry.id} to={`/admin/enquiries`} className="enquiry-item">
                  <div className="enquiry-avatar">
                    {enquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="enquiry-details">
                    <div className="enquiry-header">
                      <div className="enquiry-name">{enquiry.name}</div>
                      <span className={`status-badge ${enquiry.status}`}>{enquiry.status}</span>
                    </div>
                    <div className="enquiry-email">{enquiry.email}</div>
                    <div className="enquiry-meta">
                      <span className="enquiry-service">{enquiry.service || 'General'}</span>
                      <span className="enquiry-time">{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Quick Actions</h3>
              <p className="card-subtitle">Common tasks</p>
            </div>
          </div>
          <div className="quick-actions">
            <Link to="/admin/services" className="action-btn">
              <div className="action-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14m7-7H5"/>
                </svg>
              </div>
              <div className="action-content">
                <span className="action-title">Add New Service</span>
                <span className="action-desc">Create a new service</span>
              </div>
            </Link>
            <Link to="/admin/enquiries" className="action-btn">
              <div className="action-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div className="action-content">
                <span className="action-title">View Enquiries</span>
                <span className="action-desc">Manage all enquiries</span>
              </div>
            </Link>
            <Link to="/admin/settings" className="action-btn">
              <div className="action-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
              </div>
              <div className="action-content">
                <span className="action-title">Configure Settings</span>
                <span className="action-desc">Update site settings</span>
              </div>
            </Link>
            <button className="action-btn" onClick={() => window.open('/sitemap.xml', '_blank')}>
              <div className="action-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="action-content">
                <span className="action-title">View Sitemap</span>
                <span className="action-desc">Open sitemap.xml</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

