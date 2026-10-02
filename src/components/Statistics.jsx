import { useEffect, useState } from "react"
import { getStatistics } from "../services/mockApi"

function Statistics() {
  const [statistics, setStatistics] = useState(null)

  useEffect(() => {
    getStatistics().then((data) => {
      setStatistics(data)
    })
  }, [])

  if (!statistics) {
    return (
      <section>
        <h2>Statistics</h2>
        <p>Loading statistics...</p>
      </section>
    )
  }

  return (
    <section>
      <h2>Statistics</h2>

      <p>Total Detections: {statistics.totalDetections}</p>
      <p>High Severity: {statistics.highSeverity}</p>
      <p>Medium Severity: {statistics.mediumSeverity}</p>
      <p>Low Severity: {statistics.lowSeverity}</p>
    </section>
  )
}

export default Statistics