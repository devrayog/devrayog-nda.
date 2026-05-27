import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import PageHeader from '../../components/ui/PageHeader'
export default function Resources() {
  const { theme }=useTheme(); const navigate=useNavigate()
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="RESOURCES" subtitle="Books, videos, downloads and FAQs." icon="📦" page="Resources" image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800"/>
      <div className="grid md:grid-cols-2 gap-4">{[{to:'/resources/books',e:'📚',t:'Recommended Books',d:'Curated reading list'},{to:'/resources/videos',e:'🎥',t:'Video Lectures',d:'Curated videos per subject'},{to:'/resources/downloads',e:'⬇️',t:'Downloads',d:'PDFs and references'},{to:'/faq',e:'❓',t:'FAQ',d:'Common NDA questions'}].map(r=>(
        <button key={r.to} onClick={()=>navigate(r.to)} className="flex items-center gap-4 p-5 rounded-xl border text-left hover:border-yellow-500/40 transition-all group" style={{background:theme.bgMid,borderColor:theme.border}}><span className="text-4xl">{r.e}</span><div><p className="font-bebas text-lg tracking-wide text-white group-hover:text-yellow-300 transition-colors">{r.t}</p><p className="text-xs text-gray-400">{r.d}</p></div></button>
      ))}</div>
    </div>
  )
}