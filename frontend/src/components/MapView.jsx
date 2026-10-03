import { useEffect, useMemo, useState } from "react"

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet"

import { divIcon } from "leaflet"

const API_BASE_URL = "http://127.0.0.1:8000/api"

const DEFAULT_CENTER = [28.9845, 77.7064]

const civicMarkerIcon = divIcon({
  className: "civic-marker-wrapper",
  html: `
    <div class="civic-map-marker">
      <div class="civic-map-marker-dot"></div>
    </div>
  `,
  iconSize: [34, 42],
  iconAnchor: [17, 42],
  popupAnchor: [0, -42],
})

function MapController({ locations }) {
  const map = useMap()

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()

      if (locations.length === 0) {
        map.setView(DEFAULT_CENTER, 12, {
          animate: false,
        })

        return
      }

      if (locations.length === 1) {
        map.setView(
          [
            Number(locations[0].latitude),
            Number(locations[0].longitude),
          ],
          13,
          {
            animate: false,
          }
        )

        return
      }

      const bounds = locations.map((location) => [
        Number(location.latitude),
        Number(location.longitude),
      ])

      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: false,
      })
    }, 150)

    return () => clearTimeout(timer)
  }, [map, locations])

  return null
}

function MapView() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadMapData() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/map`
        )

        if (!response.ok) {
          throw new Error("Failed to load map data.")
        }

        const data = await response.json()

        setLocations(data)
      } catch (err) {
        setError(
          err.message ||
            "Failed to load civic issue locations."
        )
      } finally {
        setLoading(false)
      }
    }

    loadMapData()
  }, [])

  const validLocations = useMemo(() => {
    return locations.filter(
      (location) =>
        location.latitude !== null &&
        location.longitude !== null &&
        Number.isFinite(Number(location.latitude)) &&
        Number.isFinite(Number(location.longitude))
    )
  }, [locations])

  return (
    <section className="map-section">
      <div className="map-header">
        <div>
          <p className="section-eyebrow">
            GEOLOCATION
          </p>

          <h2>Civic Issue Map</h2>

          <p>
            View analyzed infrastructure issues based on
            their recorded geographic locations.
          </p>
        </div>

        <div className="map-location-count">
          <strong>{validLocations.length}</strong>

          <span>Located Records</span>
        </div>
      </div>

      {loading && (
        <div className="map-empty">
          <div className="map-empty-icon">
            ◉
          </div>

          <h3>Loading map data...</h3>

          <p>
            Retrieving civic issue locations from the
            CivicLens database.
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="map-error">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        validLocations.length === 0 && (
          <div className="map-empty">
            <div className="map-empty-icon">
              ◉
            </div>

            <h3>No locations available</h3>

            <p>
              Analyze an image with location information
              to display it on the civic issue map.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        validLocations.length > 0 && (
          <>
            <div className="civic-map-container">
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={13}
                minZoom={5}
                maxZoom={19}
                scrollWheelZoom={true}
                wheelPxPerZoomLevel={180}
                wheelDebounceTime={80}
                className="civic-map"
              >
                <MapController
                  locations={validLocations}
                />

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {validLocations.map((location) => (
                  <Marker
                    key={location.image_id}
                    position={[
                      Number(location.latitude),
                      Number(location.longitude),
                    ]}
                    icon={civicMarkerIcon}
                  >
                    <Popup>
                      <div className="map-popup">
                        <strong>
                          Image #{location.image_id}
                        </strong>

                        <span>
                          {location.address ||
                            "Address not provided"}
                        </span>

                        <span>
                          Lat: {location.latitude}
                        </span>

                        <span>
                          Lon: {location.longitude}
                        </span>

                        <div className="map-popup-detections">
                          {location.detections?.length >
                          0 ? (
                            location.detections.map(
                              (detection, index) => (
                                <div
                                  key={index}
                                >
                                  <strong>
                                    {
                                      detection.class_name
                                    }
                                  </strong>

                                  <span>
                                    {(
                                      detection.confidence *
                                      100
                                    ).toFixed(1)}
                                    % confidence
                                  </span>

                                  <span
                                    className={`severity-badge ${
                                      detection.severity?.toLowerCase()
                                    }`}
                                  >
                                    {
                                      detection.severity
                                    }
                                  </span>
                                </div>
                              )
                            )
                          ) : (
                            <span>
                              No detections
                            </span>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="map-data-panel">
              <div className="map-panel-header">
                <div>
                  <h3>
                    Located Infrastructure Records
                  </h3>

                  <p>
                    Click a map marker to view detailed
                    information about the record.
                  </p>
                </div>
              </div>

              <div className="map-location-list">
                {validLocations.map((location) => (
                  <div
                    className="map-location-card"
                    key={location.image_id}
                  >
                    <div className="map-marker-icon">
                      ◉
                    </div>

                    <div className="map-location-info">
                      <div className="map-location-title">
                        <strong>
                          Image #{location.image_id}
                        </strong>

                        <span className="history-status processed">
                          {location.status}
                        </span>
                      </div>

                      <p>
                        {location.address ||
                          "Address not provided"}
                      </p>

                      <div className="map-coordinates">
                        <span>
                          Lat: {location.latitude}
                        </span>

                        <span>
                          Lon: {location.longitude}
                        </span>
                      </div>

                      <div className="map-detections">
                        {location.detections?.length >
                        0 ? (
                          location.detections.map(
                            (detection, index) => (
                              <span
                                className={`severity-badge ${
                                  detection.severity?.toLowerCase()
                                }`}
                                key={index}
                              >
                                {detection.class_name}
                              </span>
                            )
                          )
                        ) : (
                          <span className="map-no-detection">
                            No detections
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
    </section>
  )
}

export default MapView