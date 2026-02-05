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
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.total || 0}</div>
            <div className="stat-label">Total Enquiries</div>
          </div>
        </div>

        <div className="stat-card new">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.new || 0}</div>
            <div className="stat-label">New Enquiries</div>
          </div>
        </div>

        <div className="stat-card contacted">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.contacted || 0}</div>
            <div className="stat-label">Contacted</div>
          </div>
        </div>

        <div className="stat-card resolved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.resolved || 0}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Enquiries</h3>
            <Link to="/admin/enquiries" className="view-all">View All →</Link>
          </div>
          <div className="enquiries-list">
            {recentEnquiries.length === 0 ? (
              <div className="empty-state">No enquiries yet</div>
            ) : (
              recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="enquiry-item">
                  <div className="enquiry-header">
                    <div className="enquiry-name">{enquiry.name}</div>
                    <span className={`status-badge ${enquiry.status}`}>{enquiry.status}</span>
                  </div>
                  <div className="enquiry-email">{enquiry.email}</div>
                  <div className="enquiry-service">Service: {enquiry.service}</div>
                  <div className="enquiry-time">{new Date(enquiry.createdAt).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/admin/services" className="action-btn">
              <span className="action-icon">➕</span>
              <span>Add New Service</span>
            </Link>
            <Link to="/admin/enquiries" className="action-btn">
              <span className="action-icon">📧</span>
              <span>View Enquiries</span>
            </Link>
            <Link to="/admin/settings" className="action-btn">
              <span className="action-icon">⚙️</span>
              <span>Configure Settings</span>
            </Link>
            <button className="action-btn" onClick={() => window.open('/sitemap.xml', '_blank')}>
              <span className="action-icon">🗺️</span>
              <span>View Sitemap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

