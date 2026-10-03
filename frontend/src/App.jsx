import { useState } from "react"
import "./App.css"

import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Dashboard from "./components/Dashboard"
import Upload from "./components/Upload"
import Results from "./components/Results"
import DetectionDetails from "./components/DetectionDetails"
import History from "./components/History"
import Statistics from "./components/Statistics"
import Reports from "./components/Reports"
import MapView from "./components/MapView"

function App() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleNavigate = (section) => {
    setActiveSection(section)

    const element = document.getElementById(section)

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <div>
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggle={() =>
          setSidebarCollapsed(!sidebarCollapsed)
        }
      />

      <Header collapsed={sidebarCollapsed} />

      <main>
        <div id="dashboard">
          <Dashboard />
        </div>

        <div id="upload">
          <Upload
            onAnalysisComplete={setAnalysisResult}
          />
        </div>

        <div id="results">
          <Results result={analysisResult} />
        </div>

        <div id="history">
          <History />
        </div>

        <div id="statistics">
          <Statistics />
        </div>

        <div id="map">
          <MapView />
        </div>

        <div id="reports">
          <Reports />
        </div>

        <DetectionDetails result={analysisResult} />
      </main>
    </div>
  )
}

export default App