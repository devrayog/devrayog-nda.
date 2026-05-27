import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
export default function SuccessStories() {
  const { theme }=useTheme(); const [stories,setStories]=useState<any[]>([])
  useEffect(()=>{ supabase.from('success_stories').select('*').eq('is_active',true).order('order_index').then(({data})=>setStories(data||[])) },[])
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="SUCCESS STORIES" subtitle="Real journeys. Real officers." icon="⭐" page="Success Stories" image="https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800"/>
      {stories.length===0?<div className="text-center py-12 text-gray-400"><p className="text-4xl mb-2">⭐</p><p>Success stories coming soon.</p></div>:
      <div className="grid md:grid-cols-2 gap-4">{stories.map(s=>(
        <div key={s.id} className="rounded-xl border overflow-hidden" style={{borderColor:theme.border}}>
          {s.image_url&&<img src={s.image_url} className="w-full h-40 object-cover" alt=""/>}
          <div className="p-4" style={{background:theme.bgMid}}><div className="flex items-center gap-2 mb-2"><h3 className="font-bebas text-lg text-white">{s.name}</h3>{s.service&&<span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">{s.service}</span>}{s.year&&<span className="text-xs text-gray-500">{s.year}</span>}</div><p className="text-gray-400 text-sm">{s.story}</p></div>
        </div>
      ))}</div>}
    </div>
  )
}