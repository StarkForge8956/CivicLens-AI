import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Dashboard from "./components/Dashboard"
import Upload from "./components/Upload"
import Results from "./components/Results"
import DetectionDetails from "./components/DetectionDetails"
import History from "./components/History"
import Statistics from "./components/Statistics"

function App() {
  return (
    <div>
      <Sidebar />

      <Header />

      <main>
        <Dashboard />
        <Upload />
        <Results />
        <DetectionDetails />
        <History />
        <Statistics />
      </main>
    </div>
  )
}

export default App