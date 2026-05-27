import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
export default function Mentors() {
  const { theme }=useTheme(); const [mentors,setMentors]=useState<any[]>([])
  useEffect(()=>{ supabase.from('mentors').select('*').eq('is_active',true).order('order_index').then(({data})=>setMentors(data||[])) },[])
  function book(m:any){ const txt=encodeURIComponent(`Hi ${m.name}, I found you on Devrayog NDA AI. I'd like to book a session for ${m.specialization}.`); window.open(`https://wa.me/${m.whatsapp_number}?text=${txt}`,'_blank') }
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="MENTORS" subtitle="Connect with NDA-cleared officers and experienced mentors." icon="🎓" page="Mentors" image="https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800"/>
      {mentors.length===0?<div className="text-center py-12 text-gray-400"><p className="text-4xl mb-2">🎓</p><p>Mentors coming soon.</p></div>:
      <div className="grid md:grid-cols-2 gap-4">{mentors.map(m=>(
        <div key={m.id} className="rounded-xl border overflow-hidden" style={{borderColor:theme.border}}>
          {m.image_url&&<img src={m.image_url} className="w-full h-32 object-cover" alt=""/>}
          <div className="p-4" style={{background:theme.bgMid}}><div className="flex items-start justify-between mb-1"><h3 className="font-bebas text-lg text-white">{m.name}</h3>{m.service&&<span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">{m.service}</span>}</div>{m.bio&&<p className="text-xs text-gray-400 mb-2">{m.bio}</p>}{m.specialization&&<p className="text-xs font-mono text-yellow-400/70 mb-3">{m.specialization}</p>}
          <button onClick={()=>book(m)} className="w-full py-2.5 rounded-xl text-sm font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>📱 Book via WhatsApp</button></div>
        </div>
      ))}</div>}
    </div>
  )
}