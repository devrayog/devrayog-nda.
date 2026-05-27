import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
const IMGS = ['https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=1600&q=80','https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=1600&q=80','https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80']
export default function Landing() {
  const navigate = useNavigate(); const [hi, setHi] = useState(0); const [cnt, setCnt] = useState(0)
  useEffect(()=>{ const t=setInterval(()=>setHi(p=>(p+1)%IMGS.length),5000); return()=>clearInterval(t) },[])
  useEffect(()=>{ supabase.from('waitlist').select('id',{count:'exact',head:true}).then(({count})=>setCnt(count||0)) },[])
  return (
    <div className="min-h-screen" style={{background:'#0B1628',color:'#F0EDE6'}}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{background:'rgba(11,22,40,0.95)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(201,168,76,0.1)'}}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bebas text-sm" style={{background:'linear-gradient(135deg,#C9A84C,#E8C96A)',color:'#0B1628'}}>DNA</div>
          <span className="font-bebas text-base tracking-widest text-yellow-400">DEVRAYOG NDA AI</span>
        </div>
        <div className="flex gap-3">
          <button onClick={()=>navigate('/login')} className="text-sm text-gray-400 hover:text-white">Login</button>
          <button onClick={()=>navigate('/signup')} className="px-4 py-2 rounded-lg font-bold text-sm" style={{background:'linear-gradient(135deg,#C9A84C,#E8C96A)',color:'#0B1628'}}>Join Waitlist</button>
        </div>
      </nav>
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <img src={IMGS[hi]} className="absolute inset-0 w-full h-full object-cover opacity-25 transition-all duration-1000" alt="NDA"/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to bottom,rgba(11,22,40,0.5),rgba(11,22,40,0.4),#0B1628)'}}/>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 rounded-full mb-6 font-mono text-xs tracking-widest" style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',color:'#C9A84C'}}>🇮🇳 INDIA'S FIRST AI-POWERED NDA PREP PLATFORM</div>
          <h1 className="font-bebas text-6xl md:text-8xl tracking-wider mb-4 leading-none">
            <span style={{color:'white'}}>NDA IN </span>
            <span style={{background:'linear-gradient(135deg,#C9A84C,#E8C96A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>YOUR DNA</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">AI that knows you — your weaknesses, your attempt, your journey. Complete Written + SSB prep.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>navigate('/signup')} className="px-8 py-4 rounded-xl font-bold text-lg tracking-wider hover:scale-105 transition-transform" style={{background:'linear-gradient(135deg,#C9A84C,#E8C96A)',color:'#0B1628'}}>🎖️ JOIN THE WAITLIST</button>
            <button onClick={()=>navigate('/login')} className="px-8 py-4 rounded-xl font-bold text-lg border hover:bg-white/5 transition-colors" style={{borderColor:'rgba(201,168,76,0.3)',color:'#C9A84C'}}>Already have access?</button>
          </div>
          {cnt>0&&<p className="mt-5 text-gray-500 text-sm font-mono">{cnt} cadets on waitlist</p>}
        </div>
      </div>
      <div className="px-4 py-16 max-w-6xl mx-auto">
        <h2 className="font-bebas text-4xl text-center text-yellow-400 mb-10 tracking-wider">WHY DEVRAYOG NDA AI?</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[{img:'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=400',t:'Personalized AI Tutor',d:'Knows your name, attempt, weaknesses. Every response tailored for you.'},
            {img:'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=400',t:'Complete SSB Prep',d:'PPDT, TAT, WAT, SRT, SDT — full interactive SSB practice.'},
            {img:'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400',t:'Real NDA Mock Tests',d:'Exact format — Paper 1 (120 Maths) + Paper 2 (150 GAT) with negative marking.'},
            {img:'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',t:'Daily Current Affairs',d:'AI-curated news from NDA perspective. Never miss what matters.'},
            {img:'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',t:'Hindi & English Both',d:'Full Hinglish support. No language barrier.'},
            {img:'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400',t:'Screen-out Analysis',d:'Built by someone who got screened out — real insights, not theory.'}
          ].map((f,i)=>(
            <div key={i} className="rounded-xl overflow-hidden group" style={{border:'1px solid rgba(201,168,76,0.1)'}}>
              <img src={f.img} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" alt={f.t}/>
              <div className="p-4" style={{background:'#112040'}}><h3 className="font-bebas text-base text-yellow-400 tracking-wide mb-1">{f.t}</h3><p className="text-gray-400 text-xs">{f.d}</p></div>
            </div>
          ))}
        </div>
      </div>
      <footer className="border-t px-6 py-6" style={{borderColor:'rgba(201,168,76,0.1)'}}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div><div className="font-bebas text-base text-yellow-400 tracking-widest">DEVRAYOG NDA AI</div><p className="text-xs text-gray-500">NDA in DNA</p></div>
          <div className="flex gap-4 text-xs text-gray-500">{['/guide','/blogs','/contact'].map(p=><a key={p} href={p} className="hover:text-white capitalize">{p.slice(1)}</a>)}</div>
          <p className="text-xs text-gray-600">Made with ❤️ in collaboration with <a href="https://v0-devrayog.vercel.app" target="_blank" rel="noopener noreferrer" className="text-yellow-500 underline">Devrayog AI</a></p>
        </div>
      </footer>
    </div>
  )
}