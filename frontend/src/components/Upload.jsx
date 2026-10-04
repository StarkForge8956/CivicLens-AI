import { useState } from "react"
import { uploadImage } from "../services/api"

function Upload({ onAnalysisComplete }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [address, setAddress] = useState("")
  const [isGettingLocation, setIsGettingLocation] =
    useState(false)

  const handleImageChange = (event) => {
    const file = event.target.files[0]

    setError("")
    setResult("")

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.")
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

    const handleGetLocation = () => {
    setError("")

    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by this browser."
      )
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        setLatitude(lat.toFixed(6))
        setLongitude(lon.toFixed(6))

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          )

          if (!response.ok) {
            throw new Error(
              "Unable to retrieve the address."
            )
          }

          const data = await response.json()

          setAddress(
            data.display_name ||
              `${lat.toFixed(6)}, ${lon.toFixed(6)}`
          )
        } catch (error) {
          console.error(
            "Reverse geocoding failed:",
            error
          )

          setAddress(
            `${lat.toFixed(6)}, ${lon.toFixed(6)}`
          )
        } finally {
          setIsGettingLocation(false)
        }
      },
      (locationError) => {
        setIsGettingLocation(false)

        if (locationError.code === 1) {
          setError(
            "Location permission was denied. Please allow location access or enter the coordinates manually."
          )
        } else if (locationError.code === 2) {
          setError(
            "Your location could not be determined."
          )
        } else if (locationError.code === 3) {
          setError(
            "Location request timed out. Please try again."
          )
        } else {
          setError(
            "Unable to retrieve your current location."
          )
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError(
        "Please select an image before analyzing."
      )
      return
    }

    setError("")
    setIsAnalyzing(true)
    setResult(null)

    try {
      const data = await uploadImage(selectedFile, {
        latitude:
          latitude !== ""
            ? Number(latitude)
            : undefined,

        longitude:
          longitude !== ""
            ? Number(longitude)
            : undefined,

        address: address.trim() || undefined,
      })

      setResult(data)
      onAnalysisComplete(data)
      window.dispatchEvent(
       new Event("civiclens-data-updated")
      ) 

    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while analyzing the image."
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <section className="upload-section">
      <div className="upload-header">
        <div>
          <p className="section-eyebrow">
            AI ANALYSIS
          </p>

          <h2>Upload & Analyze</h2>

          <p>
            Upload a civic infrastructure image and let
            CivicLens AI identify potential issues.
          </p>
        </div>
      </div>

      <div className="upload-panel">
        {!previewUrl ? (
          <label className="upload-dropzone">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <div className="upload-icon">
              ↑
            </div>

            <h3>Upload an image</h3>

            <p>
              Click here to select an image of a road,
              street, garbage area, or other civic
              infrastructure.
            </p>

            <span className="upload-hint">
              JPG, JPEG, PNG • Image files only
            </span>
          </label>
        ) : (
          <div className="selected-image-area">
            <div className="selected-image-header">
              <div>
                <h3>Selected Image</h3>

                <p>
                  {selectedFile?.name}
                </p>
              </div>

              <label className="change-image-button">
                Change Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="preview-container">
              <img
                src={previewUrl}
                alt="Selected civic infrastructure"
              />
            </div>

            <div className="upload-location-panel">
              <div className="upload-location-header">
                <div>
                  <span className="upload-location-label">
                    LOCATION
                  </span>

                  <h3>Where was this image captured?</h3>

                  <p>
                    Add the image location so CivicLens can
                    associate detected issues with a
                    geographic record.
                  </p>
                </div>

                <button
                  type="button"
                  className="get-location-button"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation
                    ? "Getting Location..."
                    : "Use Current Location"}
                </button>
              </div>

              <div className="location-fields">
                <div className="location-field">
                  <label htmlFor="latitude">
                    Latitude
                  </label>

                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g. 28.984500"
                    value={latitude}
                    onChange={(event) =>
                      setLatitude(event.target.value)
                    }
                  />
                </div>

                <div className="location-field">
                  <label htmlFor="longitude">
                    Longitude
                  </label>

                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g. 77.706400"
                    value={longitude}
                    onChange={(event) =>
                      setLongitude(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="location-field">
                <label htmlFor="address">
                  Address / Locality
                </label>

                <input
                  id="address"
                  type="text"
                  placeholder="e.g. Meerut, Uttar Pradesh"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                />
              </div>

              {latitude && longitude && (
                <div className="location-success">
                  <span>✓</span>

                  <div>
                    <strong>
                      Location added
                    </strong>

                    <p>
                      {latitude}, {longitude}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="analysis-actions">
              <button
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span className="loading-spinner"></span>
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    Analyze Image
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="upload-error">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="upload-success">
          <div>
            <span className="success-icon">
              ✓
            </span>
          </div>

          <div>
            <strong>
              Analysis completed successfully
            </strong>

            <p>
              {result.detections?.length ?? 0} civic issue
              {result.detections?.length === 1
                ? ""
                : "s"} detected.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default Upload