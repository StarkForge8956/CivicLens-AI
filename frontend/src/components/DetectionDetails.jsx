function DetectionDetails({ result }) {
  const detections = result?.detections || []

  return (
    <section id="detection-details" className="detection-details-section">
      <div className="results-header">
        <div>
          <p className="section-eyebrow">DETECTION DETAILS</p>

          <h2>Detection Details</h2>

          <p>
            Detailed AI analysis of the detected civic infrastructure
            issues.
          </p>
        </div>

        {result && (
          <div className="results-count">
            <strong>{detections.length}</strong>
            <span>
              {detections.length === 1
                ? "Issue Detected"
                : "Issues Detected"}
            </span>
          </div>
        )}
      </div>

      {!result && (
        <div className="results-empty">
          <h3>No detection details available</h3>

          <p>
            Upload and analyze an image to view detailed detection
            information.
          </p>
        </div>
      )}

      {result && detections.length === 0 && (
        <div className="no-detections">
          <div>
            <strong>No civic issues detected</strong>

            <p>
              CivicLens AI did not identify any supported issues in
              this image.
            </p>
          </div>
        </div>
      )}

      {detections.length > 0 && (
        <div className="detection-details-grid">
          {detections.map((detection, index) => {
            const confidence = detection.confidence * 100

            const severityClass =
              detection.severity?.toLowerCase() || "low"

            return (
              <div
                className="detection-detail-card"
                key={detection.id || index}
              >
                <div className="detection-detail-header">
                  <div>
                    <span className="issue-label">
                      DETECTED ISSUE {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{detection.class_name}</h3>
                  </div>

                  <span
                    className={`severity-badge ${severityClass}`}
                  >
                    {detection.severity || "Low"}
                  </span>
                </div>

                <div className="detail-row">
                  <span>AI Confidence</span>
                  <strong>{confidence.toFixed(1)}%</strong>
                </div>

                {detection.bbox && (
                  <div className="detail-row">
                    <span>Bounding Box</span>

                    <strong>
                      {Math.round(detection.bbox.x1)},{" "}
                      {Math.round(detection.bbox.y1)}
                      {" → "}
                      {Math.round(detection.bbox.x2)},{" "}
                      {Math.round(detection.bbox.y2)}
                    </strong>
                  </div>
                )}

                {detection.class_id !== undefined && (
                  <div className="detail-row">
                    <span>Class ID</span>
                    <strong>{detection.class_id}</strong>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default DetectionDetails