import { useState } from "react"

function Upload() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const handleImageChange = (event) => {
    const file = event.target.files[0]

    setError("")

    if (file) {
      setSelectedImage(URL.createObjectURL(file))
    }
  }

  const handleAnalyze = () => {
    if (!selectedImage) {
      setError("Please select an image before analyzing.")
      return
    }

    setError("")
    setIsAnalyzing(true)

    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <section>
      <h2>Upload / Analyze</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      <p>Select an image of a civic area to analyze.</p>

      {error && <p>{error}</p>}

      {selectedImage && (
        <div>
          <h3>Image Preview</h3>

          <img
            src={selectedImage}
            alt="Selected civic area"
            width="300"
          />

          <br />

          <button onClick={handleAnalyze}>
            {isAnalyzing ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>
      )}
    </section>
  )
}

export default Upload