import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
export default function WAT() {
  const { theme } = useTheme()
  const [sets,setSets]=useState<any[]>([]); const [selected,setSelected]=useState<any>(null)
  const [phase,setPhase]=useState<'list'|'rules'|'running'|'done'>('list')
  const [idx,setIdx]=useState(0); const [timer,setTimer]=useState(15)
  useEffect(()=>{ supabase.from('ssb_wat_sets').select('*').eq('is_active',true).then(({data})=>setSets(data||[])) },[])
  useEffect(()=>{
    if(phase!=='running'||!selected) return
    setTimer(15)
    const words=selected.words||[]
    const t=setInterval(()=>setTimer(p=>{
      if(p<=1){ clearInterval(t); if(idx<words.length-1){ setIdx(i=>i+1) } else setPhase('done'); return 15 } return p-1
    }),1000)
    return()=>clearInterval(t)
  },[phase,idx,selected])
  const words=selected?.words||[]
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="WAT PRACTICE" subtitle="60 words — 15 seconds each" icon="💭" page="WAT" image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800"/>
      {phase==='list'&&<div>{sets.length===0?<p className="text-center text-gray-400 py-10">No WAT sets yet.</p>:sets.map(s=>(
        <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl border mb-2" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div><p className="font-bebas tracking-wide text-white">{s.title}</p><p className="text-xs text-gray-400">{(s.words||[]).length} words</p></div>
          <button onClick={()=>{setSelected(s);setPhase('rules')}} className="px-4 py-2 rounded-xl text-xs font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start</button>
        </div>
      ))}</div>}
      {phase==='rules'&&<div className="rounded-xl p-5 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <h2 className="font-bebas text-2xl mb-3" style={{color:theme.accent}}>WAT RULES</h2>
        <ul className="space-y-2 text-sm text-gray-300 mb-5">{['60 words appear one by one.','15 seconds per word.','Write first sentence that comes to mind.','Reflect positive OLQs.','React instinctively — no overthinking.'].map((r,i)=><li key={i} className="flex gap-2"><span style={{color:theme.accent}}>›</span>{r}</li>)}</ul>
        <div className="flex gap-2"><button onClick={()=>setPhase('list')} className="flex-1 py-2.5 rounded-xl border text-sm text-gray-300" style={{borderColor:theme.border}}>Cancel</button><button onClick={()=>{setPhase('running');setIdx(0)}} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start WAT</button></div>
      </div>}
      {phase==='running'&&<div className="text-center py-12">
        <div className="text-xs font-mono text-gray-400 mb-2">{idx+1}/{words.length}</div>
        <div className="font-bebas text-7xl text-white mb-4">{words[idx]}</div>
        <div className="font-bebas text-4xl mb-3" style={{color:timer<=5?'#ef4444':theme.accent}}>{timer}</div>
        <div className="w-full bg-black/30 rounded-full h-1 max-w-xs mx-auto"><div className="h-1 rounded-full transition-all" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,width:`${(timer/15)*100}%`}}/></div>
      </div>}
      {phase==='done'&&<div className="text-center py-12 rounded-xl border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <p className="text-5xl mb-3">✅</p><h2 className="font-bebas text-2xl mb-2" style={{color:theme.accent}}>WAT COMPLETE!</h2>
        <button onClick={()=>{setPhase('list');setSelected(null);setIdx(0)}} className="px-6 py-3 rounded-xl font-bold text-sm mt-2" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Back to Sets</button>
      </div>}
    </div>
  )
}