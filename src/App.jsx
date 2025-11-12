import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [title, setTitle] = useState('Mazaak Masti')
  const [scenes, setScenes] = useState([
    { text_hi: 'Namaste dosto! Aaj hum ek mazedaar kahani sunayenge.', duration: 5, mood: 'happy' },
    { text_hi: 'Ek chhotu bandar aur uski funny harkatein!', duration: 5, mood: 'happy' }
  ])
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)
  const [error, setError] = useState('')

  const addScene = () => {
    setScenes(prev => [...prev, { text_hi: '', duration: 5, mood: 'happy' }])
  }

  const updateScene = (idx, key, value) => {
    const copy = [...scenes]
    copy[idx][key] = value
    setScenes(copy)
  }

  const removeScene = (idx) => {
    setScenes(prev => prev.filter((_, i) => i !== idx))
  }

  const generate = async () => {
    setError('')
    setLoading(true)
    setVideoUrl(null)
    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, scenes })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setVideoUrl(`${API_BASE}${data.video_url}`)
    } catch (e) {
      setError(e.message || 'Error generating video')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-cyan-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-800">Hindi Cartoon Video Maker</h1>
          <p className="text-gray-600 mt-2">Apne funny Hindi dialogues se auto cartoon video banayein</p>
        </header>

        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-400" placeholder="Video title" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Scenes</h2>
              <button onClick={addScene} className="px-3 py-2 text-sm bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700">+ Add Scene</button>
            </div>
            {scenes.map((sc, idx) => (
              <div key={idx} className="p-4 rounded-lg border bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">Scene {idx+1}</span>
                  <button onClick={()=>removeScene(idx)} className="text-xs text-red-600 hover:underline">Remove</button>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600">Hindi Dialogue</label>
                    <textarea value={sc.text_hi} onChange={e=>updateScene(idx,'text_hi', e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-400" rows={3} placeholder="Yahan Hindi me scene ka dialogue likhein" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Duration (sec)</label>
                    <input type="number" min={2} max={60} value={sc.duration} onChange={e=>updateScene(idx,'duration', Number(e.target.value))} className="w-full mt-1 px-3 py-2 border rounded-md" />
                    <label className="block text-xs font-medium text-gray-600 mt-3">Mood</label>
                    <select value={sc.mood} onChange={e=>updateScene(idx,'mood', e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md">
                      <option value="happy">Happy</option>
                      <option value="sad">Sad</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={generate} disabled={loading} className="px-5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60">
              {loading ? 'Generating…' : 'Generate Video'}
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>

          {videoUrl && (
            <div className="mt-6">
              <video src={videoUrl} controls className="w-full rounded-lg shadow" />
              <div className="mt-2 text-sm text-gray-600">Video ready! Download ya share karein.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
