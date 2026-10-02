export function analyzeImage() {
  return Promise.resolve({
    detections: [
      {
        className: "Pothole",
        confidence: 92,
        severity: "High",
      },
    ],
  })
}
export function getHistory() {
  return Promise.resolve([
    {
      id: 1,
      issue: "Pothole",
      confidence: 92,
      severity: "High",
    },
  ])
}
export function getStatistics() {
  return Promise.resolve({
    totalDetections: 1,
    highSeverity: 1,
    mediumSeverity: 0,
    lowSeverity: 0,
  })
}