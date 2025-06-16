import { useState } from "react"
import { HiUpload, HiLightningBolt } from "react-icons/hi"
import { IoCarSport } from "react-icons/io5"
import { MdClose } from "react-icons/md"

function App() {
  const [image, setImage] = useState(null)
  const [imageSrc, setImageSrc] = useState("")
  const [carDetected, setCarDetected] = useState(null)
  const [numCars, setNumCars] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)

    const reader = new FileReader()
    reader.onloadend = () => setImageSrc(reader.result)
    reader.readAsDataURL(file)

    setCarDetected(null)
    setNumCars(0)
  }

  const handleSubmit = async () => {
    if (!image) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append("image", image)

    try {
      const res = await fetch("http://localhost:5000/detect", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setCarDetected(data.car_detected)
      setNumCars(data.num_cars)
    } catch (err) {
      console.error("Error detecting car:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fillOpacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/10">
              <IoCarSport className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Car Detector
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload an image and let our advanced detecter vehicles with precision and speed
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl">
            {/* Upload Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <label className="relative cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                    <HiUpload className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">Choose Image</span>
                  </div>
                </label>

                <button
                  onClick={handleSubmit}
                  disabled={!image || isLoading}
                  className="flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-purple-500/25 disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <HiLightningBolt className="w-5 h-5" />
                      <span>Detect Cars</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Image Display */}
            {imageSrc && (
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src={imageSrc || "/placeholder.svg"}
                    alt="Uploaded"
                    className="w-full h-auto max-h-96 object-contain bg-slate-900/50"
                  />

                  {/* Detection Result Overlay */}
                  {carDetected !== null && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div
                        className={`
                        backdrop-blur-md rounded-xl p-4 border
                        ${carDetected
                            ? "bg-emerald-500/20 border-emerald-400/50 shadow-lg shadow-emerald-500/25"
                            : "bg-red-500/20 border-red-400/50 shadow-lg shadow-red-500/25"
                          }
                      `}
                      >
                        <div className="flex items-center gap-3">
                          {carDetected ? (
                            <>
                              <div className="p-2 rounded-lg bg-emerald-500/30">
                                <IoCarSport className="w-5 h-5 text-emerald-300" />
                              </div>
                              <div>
                                <p className="text-emerald-200 font-semibold">Vehicle Detected!</p>
                                <p className="text-emerald-300/80 text-sm">
                                  Found {numCars} car{numCars !== 1 ? "s" : ""} in the image
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="p-2 rounded-lg bg-red-500/30">
                                <MdClose className="w-5 h-5 text-red-300" />
                              </div>
                              <div>
                                <p className="text-red-200 font-semibold">No Vehicles Found</p>
                                <p className="text-red-300/80 text-sm">Try uploading a different image</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!imageSrc && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
                  <HiUpload className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Upload an Image</h3>
                <p className="text-slate-400">Select an image file to start detecting vehicles</p>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  )
}

export default App
