import { useEffect, useState } from "react"
import { getStatistics } from "../services/api"

function Statistics() {
  const [detections, setDetections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadStatistics() {
      try {
        const data = await getStatistics()
        setDetections(data)
      } catch (err) {
        setError(
          err.message || "Failed to load statistics."
        )
      } finally {
        setLoading(false)
      }
    }

    loadStatistics()
  }, [])

  if (loading) {
    return (
      <section className="statistics-section">
        <p className="section-eyebrow">SYSTEM ANALYTICS</p>
        <h2>Statistics</h2>

        <div className="statistics-loading">
          Loading statistics...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="statistics-section">
        <p className="section-eyebrow">SYSTEM ANALYTICS</p>
        <h2>Statistics</h2>

        <div className="statistics-error">
          {error}
        </div>
      </section>
    )
  }

  const totalDetections = detections.length

  const highSeverity = detections.filter(
    (detection) => detection.severity === "High"
  ).length

  const mediumSeverity = detections.filter(
    (detection) => detection.severity === "Medium"
  ).length

  const lowSeverity = detections.filter(
    (detection) => detection.severity === "Low"
  ).length

  const potholes = detections.filter(
    (detection) => detection.class_name === "pothole"
  ).length

  const manholes = detections.filter(
    (detection) => detection.class_name === "manhole"
  ).length

  const garbageBins = detections.filter(
    (detection) => detection.class_name === "garbage_bin"
  ).length

  const garbageOverflow = detections.filter(
    (detection) =>
      detection.class_name === "garbage_overflow"
  ).length

  const maxIssueCount = Math.max(
    potholes,
    manholes,
    garbageBins,
    garbageOverflow,
    1
  )

  return (
    <section className="statistics-section">
      <div className="statistics-header">
        <div>
          <p className="section-eyebrow">
            SYSTEM ANALYTICS
          </p>

          <h2>Statistics & Analytics</h2>

          <p>
            Overview of civic issues identified by CivicLens AI.
          </p>
        </div>

        <div className="statistics-total">
          <strong>{totalDetections}</strong>
          <span>Total Detections</span>
        </div>
      </div>

      <div className="statistics-cards">
        <div className="statistics-card blue">
          <span>Total Detections</span>
          <strong>{totalDetections}</strong>
        </div>

        <div className="statistics-card red">
          <span>High Severity</span>
          <strong>{highSeverity}</strong>
        </div>

        <div className="statistics-card orange">
          <span>Medium Severity</span>
          <strong>{mediumSeverity}</strong>
        </div>

        <div className="statistics-card green">
          <span>Low Severity</span>
          <strong>{lowSeverity}</strong>
        </div>
      </div>

      <div className="statistics-grid">
        <div className="statistics-panel">
          <div className="statistics-panel-header">
            <div>
              <h3>Issues by Category</h3>

              <p>
                Distribution of detected infrastructure issues.
              </p>
            </div>
          </div>

          <div className="category-bars">
            <div className="category-row">
              <div className="category-label">
                <span>Potholes</span>
                <strong>{potholes}</strong>
              </div>

              <div className="category-bar">
                <div
                  style={{
                    width: `${(potholes / maxIssueCount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="category-row">
              <div className="category-label">
                <span>Manholes</span>
                <strong>{manholes}</strong>
              </div>

              <div className="category-bar">
                <div
                  style={{
                    width: `${(manholes / maxIssueCount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="category-row">
              <div className="category-label">
                <span>Garbage Bins</span>
                <strong>{garbageBins}</strong>
              </div>

              <div className="category-bar">
                <div
                  style={{
                    width: `${(garbageBins / maxIssueCount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="category-row">
              <div className="category-label">
                <span>Garbage Overflow</span>
                <strong>{garbageOverflow}</strong>
              </div>

              <div className="category-bar">
                <div
                  style={{
                    width: `${(garbageOverflow / maxIssueCount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="statistics-panel">
          <div className="statistics-panel-header">
            <div>
              <h3>Severity Distribution</h3>

              <p>
                Current severity classification.
              </p>
            </div>
          </div>

          <div className="severity-statistics">
            <div className="severity-stat-row">
              <div>
                <span className="severity-stat-dot high"></span>
                High
              </div>

              <strong>{highSeverity}</strong>
            </div>

            <div className="severity-stat-row">
              <div>
                <span className="severity-stat-dot medium"></span>
                Medium
              </div>

              <strong>{mediumSeverity}</strong>
            </div>

            <div className="severity-stat-row">
              <div>
                <span className="severity-stat-dot low"></span>
                Low
              </div>

              <strong>{lowSeverity}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Statistics