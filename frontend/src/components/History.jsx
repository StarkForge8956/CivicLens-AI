import { useEffect, useState } from "react"
import {
  getHistory,
  deleteImage,
  deleteImages,
} from "../services/api"

const API_BASE_URL = "http://127.0.0.1:8000"

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedIds, setSelectedIds] = useState([])
  const [deleting, setDeleting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  async function loadHistory() {
    try {
      setError("")

      const data = await getHistory()

      setHistory(data)
      setSelectedIds([])
    } catch (err) {
      setError(
        err.message || "Failed to load detection history."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()

    const handleDataUpdated = () => {
      loadHistory()
    }

    window.addEventListener(
      "civiclens-data-updated",
      handleDataUpdated
    )

    return () => {
      window.removeEventListener(
        "civiclens-data-updated",
        handleDataUpdated
      )
    }
  }, [])

  const allSelected =
    history.length > 0 &&
    selectedIds.length === history.length

  function toggleSelection(imageId) {
    setSelectedIds((current) =>
      current.includes(imageId)
        ? current.filter((id) => id !== imageId)
        : [...current, imageId]
    )
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([])
      return
    }

    setSelectedIds(
      history.map((item) => item.image_id)
    )
  }

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) return

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected image${
        selectedIds.length > 1 ? "s" : ""
      }?\n\nThis will permanently remove the images, detections, and associated report data.`
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      setError("")

      await deleteImages(selectedIds)

      setHistory((current) =>
        current.filter(
          (item) =>
            !selectedIds.includes(item.image_id)
        )
      )

      setSelectedIds([])

      window.dispatchEvent(
        new Event("civiclens-data-updated")
      )
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete selected images."
      )
    } finally {
      setDeleting(false)
    }
  }

  async function handleDeleteSingle(imageId, filename) {
    const confirmed = window.confirm(
      `Delete "${filename}"?\n\nThis will permanently remove the image, detections, and associated report data.`
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      setError("")

      await deleteImage(imageId)

      setHistory((current) =>
        current.filter(
          (item) => item.image_id !== imageId
        )
      )

      setSelectedIds((current) =>
        current.filter((id) => id !== imageId)
      )

      window.dispatchEvent(
        new Event("civiclens-data-updated")
      )
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete the record."
      )
    } finally {
      setDeleting(false)
    }
  }

  function getImageUrl(item) {
    const filename =
      item.stored_filename ||
      item.filename

    if (!filename) {
      return ""
    }

    return `${API_BASE_URL}/uploads/${filename}`
  }

  return (
    <section className="history-section">
      <div className="history-header">
        <div>
          <p className="section-eyebrow">
            RECORDS
          </p>

          <h2>Detection History</h2>

          <p>
            Review previously analyzed civic
            infrastructure images.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <button
            type="button"
            className="history-bulk-delete"
            onClick={handleDeleteSelected}
            disabled={deleting}
          >
            {deleting
              ? "Deleting..."
              : `Delete Selected (${selectedIds.length})`}
          </button>
        )}
      </div>

      {error && (
        <div className="history-error">
          {error}
        </div>
      )}

      <div className="history-count">
        {loading
          ? "Loading..."
          : `${history.length} ${
              history.length === 1
                ? "record"
                : "records"
            }`}
      </div>

      <div className="history-table">
        <div className="history-table-header">
          <span className="history-checkbox">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              disabled={loading || history.length === 0}
              aria-label="Select all images"
            />
          </span>

          <span>IMAGE</span>
          <span>ISSUES</span>
          <span>SEVERITY</span>
          <span>STATUS</span>
          <span>DATE</span>
          <span>ACTION</span>
        </div>

        {loading ? (
          <div className="history-empty">
            Loading detection history...
          </div>
        ) : history.length === 0 ? (
          <div className="history-empty">
            No detection history available.
          </div>
        ) : (
          history.map((item) => {
            const imageUrl = getImageUrl(item)

            return (
              <div
                className={`history-table-row ${
                  selectedIds.includes(
                    item.image_id
                  )
                    ? "selected"
                    : ""
                }`}
                key={item.image_id}
              >
                <div className="history-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(
                      item.image_id
                    )}
                    onChange={() =>
                      toggleSelection(
                        item.image_id
                      )
                    }
                    aria-label={`Select ${item.filename}`}
                  />
                </div>

                <div className="history-image-cell">
                  <button
                    type="button"
                    className="history-image-button"
                    onClick={() =>
                      imageUrl &&
                      setPreviewImage({
                        url: imageUrl,
                        filename:
                          item.filename,
                      })
                    }
                    title="Preview image"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.filename}
                        className="history-thumbnail"
                      />
                    ) : (
                      <div className="history-image-placeholder">
                        IMG
                      </div>
                    )}
                  </button>

                  <div>
                    <strong>
                      {item.filename}
                    </strong>

                    <span>
                      Image #{item.image_id}
                    </span>
                  </div>
                </div>

                <div>
                  {item.detections?.length || 0}
                </div>

                <div>
                  <span
                    className={`severity-badge ${
                      item.severity?.toLowerCase() || ""
                    }`}
                  >
                    {item.severity || "—"}
                  </span>
                </div>

                <div>
                  {item.status || "Completed"}
                </div>

                <div>
                  {item.date || "—"}
                </div>

                <div className="history-delete">
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteSingle(
                        item.image_id,
                        item.filename
                      )
                    }
                    disabled={deleting}
                    title="Delete record"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {previewImage && (
        <div
          className="history-preview-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="history-preview-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="history-preview-header">
              <div>
                <h3>Image Preview</h3>

                <p>
                  {previewImage.filename}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewImage(null)
                }
                className="history-preview-close"
              >
                ×
              </button>
            </div>

            <div className="history-preview-image-container">
              <img
                src={previewImage.url}
                alt={previewImage.filename}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default History