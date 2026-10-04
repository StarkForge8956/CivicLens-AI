const API_BASE_URL = "http://127.0.0.1:8000/api"

export async function uploadImage(file, location = {}) {
  const formData = new FormData()

  formData.append("image", file)

  if (location.latitude !== undefined && location.latitude !== null) {
    formData.append("latitude", location.latitude)
  }

  if (location.longitude !== undefined && location.longitude !== null) {
    formData.append("longitude", location.longitude)
  }

  if (location.address) {
    formData.append("address", location.address)
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || "Failed to upload image.")
  }

  return response.json()
}

export async function getHistory() {
  const response = await fetch(`${API_BASE_URL}/images`)

  if (!response.ok) {
    throw new Error("Failed to fetch image history.")
  }

  return response.json()
}

export async function getStatistics() {
  const response = await fetch(`${API_BASE_URL}/detections`)

  if (!response.ok) {
    throw new Error("Failed to fetch detection statistics.")
  }

  return response.json()
}

export async function getImageResult(imageId) {
  const response = await fetch(
    `${API_BASE_URL}/images/${imageId}/result`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch image results.")
  }

  return response.json()
}
export async function createIncidentReport(detectionId) {
  const response = await fetch(
    `${API_BASE_URL}/incident-reports/${detectionId}`,
    {
      method: "POST",
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.detail || "Failed to create incident report."
    )
  }

  return response.json()
}

export async function getIncidentReport(reportId) {
  const response = await fetch(
    `${API_BASE_URL}/incident-reports/${reportId}`
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.detail || "Failed to fetch incident report."
    )
  }

  return response.json()
}
export async function submitIncidentReport(reportId) {
  const response = await fetch(
    `${API_BASE_URL}/incident-reports/${reportId}/submit`,
    {
      method: "POST",
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))

    throw new Error(
      errorData.detail || "Failed to submit incident report."
    )
  }

  return response.json()
}
export async function deleteImage(imageId) {
  const response = await fetch(
    `${API_BASE_URL}/images/${imageId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete image.");
  }

  return response.json();
}
export async function deleteImages(imageIds) {
  const response = await fetch(
    `${API_BASE_URL}/images/bulk`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imageIds),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to delete selected images.")
  }

  return response.json()
}