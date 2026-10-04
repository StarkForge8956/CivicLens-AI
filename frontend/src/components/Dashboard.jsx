import { useEffect, useState } from "react"
import { getHistory } from "../services/api"

function Dashboard() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  async function loadDashboardData() {
    try {
      const data = await getHistory()
      setImages(data)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  loadDashboardData()

  window.addEventListener(
    "civiclens-data-updated",
    loadDashboardData
  )

  return () => {
    window.removeEventListener(
      "civiclens-data-updated",
      loadDashboardData
    )
  }
}, [])

  const allDetections = images.flatMap(
    (image) => image.detections || []
  )

  const totalDetections = allDetections.length

  const highSeverity = allDetections.filter(
    (detection) => detection.severity === "High"
  ).length

  const mediumSeverity = allDetections.filter(
    (detection) => detection.severity === "Medium"
  ).length

  const lowSeverity = allDetections.filter(
    (detection) => detection.severity === "Low"
  ).length

  const recentDetections = allDetections.slice(-5).reverse()

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">CIVICLENS AI</p>

          <h2>Infrastructure Dashboard</h2>

          <p className="dashboard-subtitle">
            Monitor and analyze civic infrastructure issues using AI.
          </p>
        </div>

        <div className="dashboard-status">
          <span className="status-dot"></span>
          CivicLens-AI Online
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="stat-card">
          <div className="stat-icon">◉</div>

          <div>
            <p>Total Detections</p>

            <h3>
              {loading ? "..." : totalDetections}
            </h3>

            <span>Issues found in uploads</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">!</div>

          <div>
            <p>High Severity</p>

            <h3>
              {loading ? "..." : highSeverity}
            </h3>

            <span>Requires attention</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">◈</div>

          <div>
            <p>Images Analyzed</p>

            <h3>
              {loading ? "..." : images.length}
            </h3>

            <span>Processed by AI</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>

          <div>
            <p>System Status</p>

            <h3>Online</h3>

            <span>Model ready</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Detections</h3>

              <p>
                Latest civic issues identified by the AI system.
              </p>
            </div>

            <button className="panel-action">
              View All
            </button>
          </div>

          {recentDetections.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⌁</div>

              <h4>No detections yet</h4>

              <p>
                Upload an image to begin monitoring civic
                infrastructure.
              </p>
            </div>
          ) : (
            <div className="recent-detections">
              {recentDetections.map((detection, index) => (
                <div
                  className="detection-row"
                  key={index}
                >
                  <div>
                    <strong>
                      {detection.class_name}
                    </strong>

                    <span>
                      {(detection.confidence * 100).toFixed(1)}%
                      confidence
                    </span>
                  </div>

                  <span
                    className={`severity-badge ${detection.severity?.toLowerCase()}`}
                  >
                    {detection.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Severity Overview</h3>

              <p>
                Distribution of detected issues.
              </p>
            </div>
          </div>

          <div className="severity-list">
            <div className="severity-row">
              <span>
                <i className="severity-dot high"></i>
                High
              </span>

              <strong>{highSeverity}</strong>
            </div>

            <div className="severity-row">
              <span>
                <i className="severity-dot medium"></i>
                Medium
              </span>

              <strong>{mediumSeverity}</strong>
            </div>

            <div className="severity-row">
              <span>
                <i className="severity-dot low"></i>
                Low
              </span>

              <strong>{lowSeverity}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard