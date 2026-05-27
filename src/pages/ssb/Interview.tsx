import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
export default function Interview() {
  const { theme }=useTheme(); const navigate=useNavigate()
  useEffect(()=>{ const t=setTimeout(()=>navigate('/dashboard'),10000); return()=>clearTimeout(t) },[])
  return (
    <div className="flex items-center justify-center h-[calc(100vh-57px)] p-4">
      <div className="text-center max-w-md">
        <img src="https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=300" className="w-32 h-32 object-cover rounded-full mx-auto mb-5 opacity-70" alt=""/>
        <h1 className="font-bebas text-4xl tracking-wider mb-2" style={{color:theme.accent}}>SSB INTERVIEW</h1>
        <p className="font-bebas text-2xl text-white mb-3">COMING SOON</p>
        <p className="text-gray-400 text-sm mb-4">"True leaders are forged in preparation, not just in battle."</p>
        <p className="text-xs text-gray-500">Redirecting to dashboard in 10 seconds...</p>
        <button onClick={()=>navigate('/dashboard')} className="mt-4 px-6 py-2 rounded-xl text-sm font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Go to Dashboard</button>
      </div>
    </div>
  )
}