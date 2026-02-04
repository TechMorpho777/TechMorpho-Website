import { useEffect, useState } from 'react'
import { apiRequest } from '../../utils/api'
import './Enquiries.css'

interface Enquiry {
  id: string
  name: string
  email: string
  phone?: string
  service: string
  message: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)

  useEffect(() => {
    loadEnquiries()
  }, [statusFilter])

  const loadEnquiries = async () => {
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
      const data = await apiRequest(`/admin/enquiries${params}`)
      setEnquiries(data.data)
    } catch (error) {
      console.error('Error loading enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string, notes?: string) => {
    try {
      await apiRequest(`/admin/enquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes })
      })
      loadEnquiries()
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status, notes: notes || selectedEnquiry.notes })
      }
    } catch (error: any) {
      alert(error.message || 'Error updating status')
    }
  }

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return

    try {
      await apiRequest(`/admin/enquiries/${id}`, { method: 'DELETE' })
      loadEnquiries()
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null)
      }
    } catch (error: any) {
      alert(error.message || 'Error deleting enquiry')
    }
  }

  if (loading) {
    return <div className="loading">Loading enquiries...</div>
  }

  return (
    <div className="admin-enquiries">
      <div className="enquiries-header">
        <div className="filter-tabs">
          {['all', 'new', 'contacted', 'resolved', 'archived'].map(status => (
            <button
              key={status}
              className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="enquiries-grid">
        <div className="enquiries-list">
          {enquiries.length === 0 ? (
            <div className="empty-state">No enquiries found</div>
          ) : (
            enquiries.map(enquiry => (
              <div
                key={enquiry.id}
                className={`enquiry-card ${selectedEnquiry?.id === enquiry.id ? 'selected' : ''}`}
                onClick={() => setSelectedEnquiry(enquiry)}
              >
                <div className="enquiry-card-header">
                  <div className="enquiry-name">{enquiry.name}</div>
                  <span className={`status-badge ${enquiry.status}`}>{enquiry.status}</span>
                </div>
                <div className="enquiry-email">{enquiry.email}</div>
                <div className="enquiry-service">{enquiry.service}</div>
                <div className="enquiry-time">{new Date(enquiry.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>

        {selectedEnquiry && (
          <div className="enquiry-detail">
            <div className="detail-header">
              <h3>Enquiry Details</h3>
              <button onClick={() => setSelectedEnquiry(null)} className="btn-close">×</button>
            </div>

            <div className="detail-content">
              <div className="detail-section">
                <label>Name</label>
                <div className="detail-value">{selectedEnquiry.name}</div>
              </div>

              <div className="detail-section">
                <label>Email</label>
                <div className="detail-value">
                  <a href={`mailto:${selectedEnquiry.email}`}>{selectedEnquiry.email}</a>
                </div>
              </div>

              {selectedEnquiry.phone && (
                <div className="detail-section">
                  <label>Phone</label>
                  <div className="detail-value">
                    <a href={`tel:${selectedEnquiry.phone}`}>{selectedEnquiry.phone}</a>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <label>Service</label>
                <div className="detail-value">{selectedEnquiry.service}</div>
              </div>

              <div className="detail-section">
                <label>Message</label>
                <div className="detail-value message-text">{selectedEnquiry.message}</div>
              </div>

              <div className="detail-section">
                <label>Status</label>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => updateStatus(selectedEnquiry.id, e.target.value)}
                  className="status-select"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="detail-section">
                <label>Notes</label>
                <textarea
                  value={selectedEnquiry.notes || ''}
                  onChange={(e) => {
                    const updated = { ...selectedEnquiry, notes: e.target.value }
                    setSelectedEnquiry(updated)
                  }}
                  onBlur={() => updateStatus(selectedEnquiry.id, selectedEnquiry.status, selectedEnquiry.notes)}
                  className="notes-textarea"
                  placeholder="Add internal notes..."
                  rows={4}
                />
              </div>

              <div className="detail-actions">
                <button
                  onClick={() => deleteEnquiry(selectedEnquiry.id)}
                  className="btn-delete"
                >
                  Delete Enquiry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Enquiries

