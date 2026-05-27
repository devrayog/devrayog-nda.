import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
const DEFAULTS=['Trying to appear perfect instead of being genuine','Not maintaining eye contact and confident posture','Giving bookish answers instead of real experiences','Being a follower in GD instead of contributing ideas','Overthinking WAT/SRT — instinct matters','Poor self-awareness in SDT answers']
export default function ScreenOut() {
  const { theme }=useTheme(); const [content,setContent]=useState<any[]>([])
  useEffect(()=>{ supabase.from('screenout_content').select('*').eq('is_active',true).order('order_index').then(({data})=>setContent(data||[])) },[])
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="SCREEN-OUT ANALYSIS" subtitle="Real insights from someone who got screened out — and came back." icon="🔍" page="Screen-out Analysis" image="https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800"/>
      <div className="rounded-xl overflow-hidden mb-5 border" style={{borderColor:theme.border}}>
        <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" className="w-full h-36 object-cover opacity-60" alt=""/>
        <div className="p-4" style={{background:theme.bgMid}}><p className="text-gray-300 text-sm leading-relaxed italic">"I got screened out once — not because I wasn't good enough, but because I didn't know what they were really looking for."</p><p className="text-xs text-gray-500 mt-1 font-mono">— Devanshu Sharma, Founder</p></div>
      </div>
      {(content.length>0?content.map(c=>(
        <div key={c.id} className="rounded-xl p-4 mb-2 border" style={{background:theme.bgMid,borderColor:theme.border}}><h3 className="font-bebas tracking-wide mb-1" style={{color:theme.accent}}>{c.title}</h3><p className="text-gray-400 text-sm">{c.body}</p></div>
      )):DEFAULTS.map((r,i)=>(
        <div key={i} className="flex gap-3 px-4 py-3 rounded-xl border mb-2" style={{background:theme.bgMid,borderColor:theme.border}}><span className="text-red-400">⚠️</span><p className="text-gray-300 text-sm">{r}</p></div>
      )))}
    </div>
  )
}