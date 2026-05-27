import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
export default function Videos() {
  const { theme }=useTheme(); const [items,setItems]=useState<any[]>([])
  useEffect(()=>{ supabase.from('resources').select('*').eq('type','video').eq('is_active',true).order('order_index').then(({data})=>setItems(data||[])) },[])
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="VIDEO LECTURES" subtitle="Curated video content for NDA preparation." icon="🎥" page="Videos" image="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800"/>
      {items.length===0?<div className="text-center py-12 text-gray-400"><p className="text-4xl mb-2">🎥</p><p>No videos added yet.</p></div>:
      <div className="space-y-3">{items.map(item=>(
        <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl border" style={{background:theme.bgMid,borderColor:theme.border}}>
          {item.image_url&&<img src={item.image_url} className="w-20 h-14 object-cover rounded-lg shrink-0" alt=""/>}
          <div className="flex-1"><h3 className="font-bebas tracking-wide text-white mb-0.5">{item.title}</h3>{item.body&&<p className="text-xs text-gray-400 mb-2">{item.body}</p>}{item.link&&<a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold" style={{color:theme.accent}}>▶ Watch</a>}</div>
        </div>
      ))}</div>}
    </div>
  )
}