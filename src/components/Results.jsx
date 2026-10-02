import { useEffect, useState } from "react"
import { analyzeImage } from "../services/mockApi"

function Results() {
  const [detections, setDetections] = useState([])

  useEffect(() => {
    analyzeImage().then((data) => {
      setDetections(data.detections)
    })
  }, [])

  return (
    <section>
      <h2>Detection Results</h2>

      {detections.map((detection, index) => (
        <div key={index}>
          <h3>Detected Issue</h3>

          <p>Class: {detection.className}</p>
          <p>Confidence: {detection.confidence}%</p>
          <p>Severity: {detection.severity}</p>
        </div>
      ))}
    </section>
  )
}

export default Results