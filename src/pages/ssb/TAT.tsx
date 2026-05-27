import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
export default function TAT() {
  const { theme } = useTheme()
  const [sets,setSets]=useState<any[]>([]); const [selected,setSelected]=useState<any>(null)
  const [phase,setPhase]=useState<'list'|'rules'|'running'|'done'>('list')
  const [idx,setIdx]=useState(0); const [showPhoto,setShowPhoto]=useState(true); const [timer,setTimer]=useState(30)
  useEffect(()=>{ supabase.from('ssb_tat_sets').select('*').eq('is_active',true).then(({data})=>setSets(data||[])) },[])
  useEffect(()=>{
    if(phase!=='running'||!selected) return
    const dur = showPhoto?30:240; setTimer(dur)
    const t=setInterval(()=>setTimer(p=>{
      if(p<=1){ clearInterval(t)
        if(showPhoto){ setShowPhoto(false) }
        else { const photos=selected.photos||[]; if(idx<photos.length-1){ setIdx(i=>i+1); setShowPhoto(true) } else setPhase('done') }
        return showPhoto?30:240
      } return p-1
    }),1000)
    return()=>clearInterval(t)
  },[phase,showPhoto,idx,selected])
  const photos=selected?.photos||[]
  const fmt=(t:number)=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="TAT PRACTICE" subtitle="12 photos — 30 sec view + 4 min write each" icon="🎭" page="TAT" image="https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800"/>
      {phase==='list'&&<div>{sets.length===0?<p className="text-center text-gray-400 py-10">No TAT sets yet.</p>:sets.map(s=>(
        <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl border mb-2" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div><p className="font-bebas tracking-wide text-white">{s.title}</p><p className="text-xs text-gray-400">{(s.photos||[]).length} photos</p></div>
          <button onClick={()=>{setSelected(s);setPhase('rules')}} className="px-4 py-2 rounded-xl text-xs font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start</button>
        </div>
      ))}</div>}
      {phase==='rules'&&<div className="rounded-xl p-5 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <h2 className="font-bebas text-2xl mb-3" style={{color:theme.accent}}>TAT RULES</h2>
        <ul className="space-y-2 text-sm text-gray-300 mb-5">{['12 photos appear one by one.','Each photo shown for 30 seconds.','After each photo, write a story in 4 minutes.','Write stories on paper.','Make each story unique and original.','Hero should show positive OLQs.'].map((r,i)=><li key={i} className="flex gap-2"><span style={{color:theme.accent}}>›</span>{r}</li>)}</ul>
        <div className="flex gap-2"><button onClick={()=>setPhase('list')} className="flex-1 py-2.5 rounded-xl border text-sm text-gray-300" style={{borderColor:theme.border}}>Cancel</button><button onClick={()=>{setPhase('running');setIdx(0);setShowPhoto(true)}} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start TAT</button></div>
      </div>}
      {phase==='running'&&<div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-gray-400">Photo {idx+1}/{photos.length}</span>
          <div className="font-bebas text-3xl" style={{color:theme.accent}}>{fmt(timer)}</div>
          <span className="font-mono text-xs text-gray-400">{showPhoto?'VIEW':'WRITE'}</span>
        </div>
        {showPhoto&&photos[idx]?<img src={photos[idx]} className="w-full max-h-80 object-contain rounded-xl border" style={{borderColor:theme.border}} alt="TAT"/>:
        <div className="flex flex-col items-center justify-center h-64 rounded-xl border" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div className="w-16 h-16 rounded-full border-4 animate-spin mb-3" style={{borderColor:theme.accent,borderTopColor:'transparent'}}/>
          <p className="font-bebas text-xl text-white">WRITE YOUR STORY</p>
          <p className="text-gray-400 text-sm mt-1">{fmt(timer)} remaining</p>
        </div>}
      </div>}
      {phase==='done'&&<div className="text-center py-12 rounded-xl border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <p className="text-5xl mb-3">✅</p><h2 className="font-bebas text-2xl mb-2" style={{color:theme.accent}}>TAT COMPLETE!</h2>
        <button onClick={()=>{setPhase('list');setSelected(null);setIdx(0)}} className="px-6 py-3 rounded-xl font-bold text-sm mt-2" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Back to Sets</button>
      </div>}
    </div>
  )
}