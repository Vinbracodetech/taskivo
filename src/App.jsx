import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Home() {
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#A8FF3E', fontSize: '40px', fontFamily: 'sans-serif' }}>Landing works</h1>
    </div>
  )
}

function Login() {
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#ffffff', fontSize: '40px', fontFamily: 'sans-serif' }}>Login works</h1>
    </div>
  )
}

function Dashboard() {
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#ffffff', fontSize: '40px', fontFamily: 'sans-serif' }}>Dashboard works</h1>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
