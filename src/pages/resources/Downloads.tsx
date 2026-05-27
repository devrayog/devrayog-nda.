import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
export default function Downloads() {
  const { theme }=useTheme(); const [items,setItems]=useState<any[]>([])
  useEffect(()=>{ supabase.from('resources').select('*').eq('type','download').eq('is_active',true).order('order_index').then(({data})=>setItems(data||[])) },[])
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="DOWNLOADS" subtitle="PDFs, formula sheets and references." icon="⬇️" page="Downloads" image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800"/>
      {items.length===0?<div className="text-center py-12 text-gray-400"><p className="text-4xl mb-2">⬇️</p><p>No downloads yet.</p></div>:
      <div className="space-y-3">{items.map(item=>(
        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div><h3 className="font-bebas tracking-wide text-white">{item.title}</h3>{item.body&&<p className="text-xs text-gray-400">{item.body}</p>}</div>
          {item.link&&<a href={item.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl text-xs font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:'#0B1628'}}>⬇️ Download</a>}
        </div>
      ))}</div>}
    </div>
  )
}