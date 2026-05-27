import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
export default function SDT() {
  const { theme } = useTheme()
  const [sets,setSets]=useState<any[]>([]); const [selected,setSelected]=useState<any>(null)
  const [phase,setPhase]=useState<'list'|'rules'|'running'|'done'>('list')
  const [idx,setIdx]=useState(0); const [timer,setTimer]=useState(180)
  useEffect(()=>{ supabase.from('ssb_sdt_sets').select('*').eq('is_active',true).then(({data})=>setSets(data||[])) },[])
  useEffect(()=>{
    if(phase!=='running'||!selected) return
    setTimer(180)
    const qs=selected.questions||[]
    const t=setInterval(()=>setTimer(p=>{
      if(p<=1){ clearInterval(t); if(idx<qs.length-1){ setIdx(i=>i+1) } else setPhase('done'); return 180 } return p-1
    }),1000)
    return()=>clearInterval(t)
  },[phase,idx,selected])
  const qs=selected?.questions||[]; const q=qs[idx]
  const fmt=(t:number)=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="SDT PRACTICE" subtitle="5 questions — 3 minutes each" icon="✍️" page="SDT" image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800"/>
      {phase==='list'&&<div>{sets.length===0?<p className="text-center text-gray-400 py-10">No SDT sets yet.</p>:sets.map(s=>(
        <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl border mb-2" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div><p className="font-bebas tracking-wide text-white">{s.title}</p><p className="text-xs text-gray-400">{(s.questions||[]).length} questions</p></div>
          <button onClick={()=>{setSelected(s);setPhase('rules')}} className="px-4 py-2 rounded-xl text-xs font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start</button>
        </div>
      ))}</div>}
      {phase==='rules'&&<div className="rounded-xl p-5 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <h2 className="font-bebas text-2xl mb-3" style={{color:theme.accent}}>SDT RULES</h2>
        <ul className="space-y-2 text-sm text-gray-300 mb-5">{['5 self-description questions appear.','3 minutes per question.','Be honest and specific.','Describe yourself as others see you too.','Show self-awareness and growth mindset.'].map((r,i)=><li key={i} className="flex gap-2"><span style={{color:theme.accent}}>›</span>{r}</li>)}</ul>
        <div className="flex gap-2"><button onClick={()=>setPhase('list')} className="flex-1 py-2.5 rounded-xl border text-sm text-gray-300" style={{borderColor:theme.border}}>Cancel</button><button onClick={()=>{setPhase('running');setIdx(0)}} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start SDT</button></div>
      </div>}
      {phase==='running'&&q&&<div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-gray-400">Q{idx+1}/{qs.length}</span>
          <div className="font-bebas text-3xl" style={{color:timer<=30?'#ef4444':theme.accent}}>{fmt(timer)}</div>
        </div>
        <div className="rounded-xl p-5 border mb-3" style={{background:theme.bgMid,borderColor:theme.border}}>
          {q.image_url&&<img src={q.image_url} className="w-full max-h-40 object-contain rounded-lg mb-3" alt=""/>}
          <p className="text-white leading-relaxed text-lg">{q.text||q}</p>
        </div>
        <div className="w-full bg-black/30 rounded-full h-1"><div className="h-1 rounded-full transition-all" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,width:`${(timer/180)*100}%`}}/></div>
      </div>}
      {phase==='done'&&<div className="text-center py-12 rounded-xl border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <p className="text-5xl mb-3">✅</p><h2 className="font-bebas text-2xl mb-2" style={{color:theme.accent}}>SDT COMPLETE!</h2>
        <button onClick={()=>{setPhase('list');setSelected(null);setIdx(0)}} className="px-6 py-3 rounded-xl font-bold text-sm mt-2" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Back to Sets</button>
      </div>}
    </div>
  )
}