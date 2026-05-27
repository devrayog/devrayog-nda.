import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
export default function SRT() {
  const { theme } = useTheme()
  const [sets,setSets]=useState<any[]>([]); const [selected,setSelected]=useState<any>(null)
  const [phase,setPhase]=useState<'list'|'rules'|'running'|'done'>('list')
  const [idx,setIdx]=useState(0); const [timer,setTimer]=useState(30)
  useEffect(()=>{ supabase.from('ssb_srt_sets').select('*').eq('is_active',true).then(({data})=>setSets(data||[])) },[])
  useEffect(()=>{
    if(phase!=='running'||!selected) return
    setTimer(30)
    const sits=selected.situations||[]
    const t=setInterval(()=>setTimer(p=>{
      if(p<=1){ clearInterval(t); if(idx<sits.length-1){ setIdx(i=>i+1) } else setPhase('done'); return 30 } return p-1
    }),1000)
    return()=>clearInterval(t)
  },[phase,idx,selected])
  const sits=selected?.situations||[]; const sit=sits[idx]
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="SRT PRACTICE" subtitle="60 situations — 30 seconds each" icon="⚡" page="SRT" image="https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800"/>
      {phase==='list'&&<div>{sets.length===0?<p className="text-center text-gray-400 py-10">No SRT sets yet.</p>:sets.map(s=>(
        <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl border mb-2" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div><p className="font-bebas tracking-wide text-white">{s.title}</p><p className="text-xs text-gray-400">{(s.situations||[]).length} situations</p></div>
          <button onClick={()=>{setSelected(s);setPhase('rules')}} className="px-4 py-2 rounded-xl text-xs font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start</button>
        </div>
      ))}</div>}
      {phase==='rules'&&<div className="rounded-xl p-5 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <h2 className="font-bebas text-2xl mb-3" style={{color:theme.accent}}>SRT RULES</h2>
        <ul className="space-y-2 text-sm text-gray-300 mb-5">{['60 real-life situations appear.','30 seconds to write your reaction.','Write what you WOULD DO, not what you SHOULD.','Be specific and action-oriented.','Show leadership, initiative, composure.'].map((r,i)=><li key={i} className="flex gap-2"><span style={{color:theme.accent}}>›</span>{r}</li>)}</ul>
        <div className="flex gap-2"><button onClick={()=>setPhase('list')} className="flex-1 py-2.5 rounded-xl border text-sm text-gray-300" style={{borderColor:theme.border}}>Cancel</button><button onClick={()=>{setPhase('running');setIdx(0)}} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start SRT</button></div>
      </div>}
      {phase==='running'&&sit&&<div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-gray-400">{idx+1}/{sits.length}</span>
          <div className="font-bebas text-3xl" style={{color:timer<=10?'#ef4444':theme.accent}}>{timer}s</div>
        </div>
        <div className="rounded-xl p-5 border mb-3" style={{background:theme.bgMid,borderColor:theme.border}}>
          {sit.image_url&&<img src={sit.image_url} className="w-full max-h-40 object-contain rounded-lg mb-3" alt=""/>}
          <p className="text-white leading-relaxed">{sit.text||sit}</p>
        </div>
        <div className="w-full bg-black/30 rounded-full h-1"><div className="h-1 rounded-full transition-all" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,width:`${(timer/30)*100}%`}}/></div>
        <p className="text-xs text-gray-500 mt-1 text-center">Write your response on paper</p>
      </div>}
      {phase==='done'&&<div className="text-center py-12 rounded-xl border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <p className="text-5xl mb-3">✅</p><h2 className="font-bebas text-2xl mb-2" style={{color:theme.accent}}>SRT COMPLETE!</h2>
        <button onClick={()=>{setPhase('list');setSelected(null);setIdx(0)}} className="px-6 py-3 rounded-xl font-bold text-sm mt-2" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Back to Sets</button>
      </div>}
    </div>
  )
}