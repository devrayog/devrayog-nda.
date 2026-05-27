import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { callAI, buildUserContext } from '../../lib/ai'
import PageHeader from '../../components/ui/PageHeader'
type Phase='list'|'rules'|'photo'|'writing'|'upload'|'done'
export default function PPDT() {
  const { theme }=useTheme(); const { profile }=useAuth()
  const [sets,setSets]=useState<any[]>([]); const [selected,setSelected]=useState<any>(null); const [phase,setPhase]=useState<Phase>('list')
  const [photoTime,setPhotoTime]=useState(30); const [writingTime,setWritingTime]=useState(240)
  const [storyFile,setStoryFile]=useState<File|null>(null); const [analysis,setAnalysis]=useState(''); const [analyzing,setAnalyzing]=useState(false)
  useEffect(()=>{ supabase.from('ssb_ppdt_sets').select('*').eq('is_active',true).then(({data})=>setSets(data||[])) },[])
  useEffect(()=>{
    if(phase==='photo'){ const t=setInterval(()=>setPhotoTime(p=>{ if(p<=1){clearInterval(t);setPhase('writing');setWritingTime(240);return 0} return p-1 }),1000); return()=>clearInterval(t) }
    if(phase==='writing'){ const t=setInterval(()=>setWritingTime(p=>{ if(p<=1){clearInterval(t);setPhase('upload');return 0} return p-1 }),1000); return()=>clearInterval(t) }
  },[phase])
  async function analyze(){ setAnalyzing(true)
    const t=await callAI([{role:'system',content:buildUserContext(profile)},{role:'user',content:'Analyze this PPDT story attempt. Give: 1) Rating /10, 2) Original or clichéd?, 3) Key strengths, 4) Improvements. Keep brief. Add disclaimer this is practice only.'}],{maxTokens:350})
    setAnalysis(t); setAnalyzing(false) }
  const f=(t:number)=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="PPDT PRACTICE" subtitle="Picture Perception & Discussion Test" icon="🖼️" page="PPDT" image="https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800"/>
      {phase==='list'&&<div>{sets.length===0?<p className="text-center text-gray-400 py-10">No PPDT sets yet.</p>:sets.map(s=>(
        <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl border mb-2" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div><p className="font-bebas tracking-wide text-white">{s.title}</p><p className="text-xs text-gray-400">30 sec photo · 4 min write</p></div>
          <button onClick={()=>{setSelected(s);setPhase('rules')}} className="px-4 py-2 rounded-xl text-xs font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start</button>
        </div>
      ))}</div>}
      {phase==='rules'&&<div className="rounded-xl p-5 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <h2 className="font-bebas text-2xl mb-3" style={{color:theme.accent}}>PPDT RULES</h2>
        <ul className="space-y-2 text-sm text-gray-300 mb-5">{['Photo visible for 30 seconds — observe carefully.','After photo disappears, write a story in 4 minutes.','Story must have a beginning, middle, and end.','Write on paper — you will photograph it after.','Make it original — avoid clichéd army/war themes.','Hero should show positive OLQs.'].map((r,i)=><li key={i} className="flex gap-2"><span style={{color:theme.accent}}>›</span>{r}</li>)}</ul>
        <div className="flex gap-2"><button onClick={()=>setPhase('list')} className="flex-1 py-2.5 rounded-xl border text-sm text-gray-300" style={{borderColor:theme.border}}>Cancel</button><button onClick={()=>{setPhase('photo');setPhotoTime(30)}} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>I Agree — Start</button></div>
      </div>}
      {phase==='photo'&&selected&&<div className="text-center"><div className="font-bebas text-5xl mb-2" style={{color:theme.accent}}>{f(photoTime)}</div><p className="text-sm text-gray-400 mb-3">Study the photo carefully</p><img src={selected.image_url} className="w-full max-h-96 object-contain rounded-xl border" style={{borderColor:theme.border}} alt="PPDT"/></div>}
      {phase==='writing'&&<div className="text-center py-16"><div className="font-bebas text-5xl mb-3" style={{color:theme.accent}}>{f(writingTime)}</div><p className="text-sm text-gray-400 mb-6">Write your story on paper now</p><div className="w-20 h-20 rounded-full border-4 animate-spin mx-auto" style={{borderColor:theme.accent,borderTopColor:'transparent'}}/></div>}
      {phase==='upload'&&<div className="rounded-xl p-6 border text-center" style={{background:theme.bgMid,borderColor:theme.border}}>
        <p className="text-4xl mb-3">📸</p><h2 className="font-bebas text-xl mb-2" style={{color:theme.accent}}>UPLOAD YOUR STORY</h2>
        <p className="text-gray-400 text-sm mb-4">Photograph what you wrote and upload for AI analysis.</p>
        <label className="cursor-pointer block mb-4"><div className="border-2 border-dashed rounded-xl p-6 hover:border-yellow-500 transition-colors" style={{borderColor:theme.border}}>{storyFile?<p className="text-green-400">✓ {storyFile.name}</p>:<p className="text-gray-400 text-sm">Click to upload photo of your story</p>}</div><input type="file" accept="image/*" className="hidden" onChange={e=>setStoryFile(e.target.files?.[0]||null)}/></label>
        <button onClick={analyze} disabled={!storyFile||analyzing} className="w-full py-3 rounded-xl font-bold disabled:opacity-50 mb-3" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>{analyzing?'Analyzing...':'🤖 Get AI Analysis'}</button>
        {analysis&&<div className="text-left p-4 rounded-xl border mb-3" style={{background:`${theme.accent}10`,borderColor:`${theme.accent}30`}}><p className="font-mono text-xs mb-2" style={{color:theme.accent}}>AI ANALYSIS</p><p className="text-gray-300 text-sm leading-relaxed">{analysis}</p><p className="text-xs text-gray-500 mt-2">⚠️ Practice analysis only — not official SSB assessment.</p></div>}
        {analysis&&<button onClick={()=>{setPhase('list');setSelected(null);setAnalysis('');setStoryFile(null)}} className="w-full py-2.5 rounded-xl border text-sm text-gray-300" style={{borderColor:theme.border}}>Back to Sets</button>}
      </div>}
    </div>
  )
}