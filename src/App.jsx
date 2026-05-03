import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Home() {
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#A8FF3E', fontSize: '40px', fontFamily: 'sans-serif' }}>Router works</h1>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
