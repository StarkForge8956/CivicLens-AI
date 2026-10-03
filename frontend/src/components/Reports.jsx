import { useState } from "react"

const API_ORIGIN = "http://127.0.0.1:8000"

function Reports() {
  const [showModal, setShowModal] = useState(false)
  const [reportType, setReportType] = useState("csv")
  const [fileName, setFileName] = useState("CivicLens_Report")
  const [error, setError] = useState("")

  const openDownloadModal = (type) => {
    setReportType(type)
    setFileName(
      type === "csv"
        ? "CivicLens_Report"
        : "CivicLens_Report"
    )
    setError("")
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setError("")
  }

  const handleDownload = async () => {
    const cleanedName = fileName.trim()

    if (!cleanedName) {
      setError("Please enter a file name.")
      return
    }

    const safeName = cleanedName
      .replace(/[<>:"/\\|?*]/g, "")
      .trim()

    if (!safeName) {
      setError("Please enter a valid file name.")
      return
    }

    try {
      const response = await fetch(
        `${API_ORIGIN}/api/reports/${reportType}`
      )

      if (!response.ok) {
        throw new Error("Failed to generate report.")
      }

      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = url
      link.download = `${safeName}.${reportType}`

      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)

      closeModal()
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while downloading the report."
      )
    }
  }

  return (
    <>
      <section className="reports-section">
        <div className="reports-header">
          <div>
            <p className="section-eyebrow">DATA EXPORT</p>

            <h2>Reports & Exports</h2>

            <p>
              Generate downloadable reports from CivicLens-AI
              detection records.
            </p>
          </div>
        </div>

        <div className="reports-grid">
          <div className="report-card">
            <div className="report-card-icon csv">
              CSV
            </div>

            <div className="report-card-content">
              <span className="report-card-label">
                DATA REPORT
              </span>

              <h3>CSV Report</h3>

              <p>
                Export all analyzed images and AI detection
                records in spreadsheet-compatible CSV format.
              </p>

              <div className="report-features">
                <span>✓ Detection type</span>
                <span>✓ Confidence score</span>
                <span>✓ Severity</span>
                <span>✓ Location & coordinates</span>
                <span>✓ Bounding boxes</span>
              </div>

              <button
                className="report-download-button"
                onClick={() => openDownloadModal("csv")}
              >
                Download CSV
                <span>↓</span>
              </button>
            </div>
          </div>

          <div className="report-card">
            <div className="report-card-icon pdf">
              PDF
            </div>

            <div className="report-card-content">
              <span className="report-card-label">
                FORMATTED REPORT
              </span>

              <h3>PDF Report</h3>

              <p>
                Generate a formatted report containing
                detected issues, confidence, severity and
                location information.
              </p>

              <div className="report-features">
                <span>✓ Detection summary</span>
                <span>✓ Confidence scores</span>
                <span>✓ Severity classification</span>
                <span>✓ Location information</span>
                <span>✓ Professional format</span>
              </div>

              <button
                className="report-download-button"
                onClick={() => openDownloadModal("pdf")}
              >
                Download PDF
                <span>↓</span>
              </button>
            </div>
          </div>
        </div>

        <div className="reports-info-panel">
          <div className="reports-info-icon">
            ✓
          </div>

          <div>
            <h3>Report Contents</h3>

            <p>
              Reports are generated directly from the CivicLens-AI
              database and include the latest analyzed records.
            </p>

            <div className="reports-info-list">
              <span>✓ Analyzed images</span>
              <span>✓ Civic issue detections</span>
              <span>✓ AI confidence scores</span>
              <span>✓ Severity levels</span>
              <span>✓ GPS coordinates</span>
              <span>✓ Upload timestamps</span>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div
          className="report-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="report-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="report-modal-header">
              <div>
                <span className="report-modal-label">
                  EXPORT REPORT
                </span>

                <h3>
                  Download{" "}
                  {reportType.toUpperCase()} Report
                </h3>
              </div>

              <button
                className="report-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="report-modal-body">
              <label htmlFor="report-file-name">
                File name
              </label>

              <div className="filename-input-wrapper">
                <input
                  id="report-file-name"
                  type="text"
                  value={fileName}
                  onChange={(event) =>
                    setFileName(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleDownload()
                    }
                  }}
                  autoFocus
                />

                <span>
                  .{reportType}
                </span>
              </div>

              {error && (
                <p className="report-modal-error">
                  {error}
                </p>
              )}
            </div>

            <div className="report-modal-actions">
              <button
                className="report-cancel-button"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="report-confirm-button"
                onClick={handleDownload}
              >
                Download
                <span>↓</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Reports