import { useEffect, useState } from "react"
import { getHistory } from "../services/api"

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory()
        setHistory(data)
      } catch (err) {
        setError(
          err.message || "Failed to load detection history."
        )
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  return (
    <section className="history-section">
      <div className="history-header">
        <div>
          <p className="section-eyebrow">CIVIC RECORDS</p>

          <h2>Detection History</h2>

          <p>
            Review previously analyzed images and detected
            infrastructure issues.
          </p>
        </div>

        <div className="history-count">
          <strong>{history.length}</strong>
          <span>Images Analyzed</span>
        </div>
      </div>

      {loading && (
        <div className="history-empty">
          <p>Loading detection history...</p>
        </div>
      )}

      {error && (
        <div className="history-error">
          {error}
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="history-empty">
          <div className="history-empty-icon">◷</div>

          <h3>No previous detections</h3>

          <p>
            Analyze an image to create your first civic
            infrastructure record.
          </p>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="history-table">
          <div className="history-table-header">
            <span>IMAGE</span>
            <span>ISSUES</span>
            <span>SEVERITY</span>
            <span>STATUS</span>
            <span>DATE</span>
          </div>

          {history.map((item) => {
            const detections = item.detections || []

            const highestSeverity = detections.some(
              (detection) => detection.severity === "High"
            )
              ? "High"
              : detections.some(
                    (detection) =>
                      detection.severity === "Medium"
                  )
                ? "Medium"
                : detections.length > 0
                  ? "Low"
                  : "None"

            const severityClass =
              highestSeverity.toLowerCase()

            const date = item.upload_time
              ? new Date(item.upload_time).toLocaleString()
              : "—"

            return (
              <div
                className="history-row"
                key={item.image_id}
              >
                <div className="history-image-info">
                  <div className="history-image-icon">
                    ◫
                  </div>

                  <div>
                    <strong>
                      {item.filename}
                    </strong>

                    <span>
                      Image #{item.image_id}
                    </span>
                  </div>
                </div>

                <div className="history-issues">
                  <strong>
                    {item.detection_count}
                  </strong>

                  <span>
                    {item.detection_count === 1
                      ? "issue"
                      : "issues"}
                  </span>
                </div>

                <div>
                  <span
                    className={`history-severity ${severityClass}`}
                  >
                    {highestSeverity}
                  </span>
                </div>

                <div>
                  <span className="history-status">
                    {item.status}
                  </span>
                </div>

                <div className="history-date">
                  {date}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default History