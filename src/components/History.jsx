import { useEffect, useState } from "react"
import { getHistory } from "../services/mockApi"

function History() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    getHistory().then((data) => {
      setHistory(data)
    })
  }, [])

  return (
    <section>
      <h2>History</h2>

      {history.length === 0 ? (
        <p>No previous detections available.</p>
      ) : (
        history.map((item) => (
          <div key={item.id}>
            <p>Issue: {item.issue}</p>
            <p>Confidence: {item.confidence}%</p>
            <p>Severity: {item.severity}</p>
          </div>
        ))
      )}
    </section>
  )
}

export default History