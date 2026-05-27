import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { callAI, buildUserContext } from '../../lib/ai'
import PageHeader from '../../components/ui/PageHeader'
export default function OIR() {
  const { theme } = useTheme(); const { profile } = useAuth()
  const [sets,setSets]=useState<any[]>([]); const [questions,setQuestions]=useState<any[]>([]); const [answers,setAnswers]=useState<Record<string,string>>({}); const [revealed,setRevealed]=useState(false); const [tab,setTab]=useState<'admin'|'ai'>('admin'); const [generating,setGenerating]=useState(false)
  useEffect(()=>{ supabase.from('ssb_oir_sets').select('*,ssb_oir_questions(*)').eq('is_active',true).then(({data})=>setSets(data||[])) },[])
  async function genAI(){ setGenerating(true); setAnswers({}); setRevealed(false)
    const raw=await callAI([{role:'system',content:buildUserContext(profile)},{role:'user',content:'Generate 10 OIR questions for SSB. Return ONLY JSON: [{"question":"","option_a":"","option_b":"","option_c":"","option_d":"","correct_option":"a","explanation":""}]. No markdown.'}],{maxTokens:2000})
    try{setQuestions(JSON.parse(raw.replace(/```json|```/g,'').trim()).map((q:any,i:number)=>({...q,id:`ai_${i}`})))}catch{setQuestions([])}
    setGenerating(false) }
  const score=revealed?questions.filter(q=>answers[q.id]===q.correct_option).length:0
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="OIR PRACTICE" subtitle="Officer Intelligence Rating — Verbal & Non-verbal Reasoning" icon="🧠" page="OIR" image="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800"/>
      <div className="flex gap-2 mb-4">{[{k:'admin',l:'📋 Admin Sets'},{k:'ai',l:'🤖 AI Generated'}].map(t=>(
        <button key={t.k} onClick={()=>{setTab(t.k as any);setQuestions([]);setAnswers({});setRevealed(false)}} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab===t.k?'text-[#0B1628] font-bold':'text-gray-400 border'}`} style={tab===t.k?{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`}:{borderColor:theme.border}}>{t.l}</button>
      ))}</div>
      {tab==='admin'&&questions.length===0&&<div className="space-y-2">{sets.length===0?<p className="text-center text-gray-400 py-8">No OIR sets yet.</p>:sets.map(s=>(
        <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div><p className="font-bebas tracking-wide text-white">{s.title}</p><p className="text-xs text-gray-400">{s.ssb_oir_questions?.length||0} questions</p></div>
          <button onClick={()=>{setQuestions(s.ssb_oir_questions||[]);setAnswers({});setRevealed(false)}} className="px-4 py-2 rounded-xl text-xs font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start</button>
        </div>
      ))}</div>}
      {tab==='ai'&&questions.length===0&&<div className="text-center py-8"><button onClick={genAI} disabled={generating} className="px-6 py-3 rounded-xl font-bold disabled:opacity-50" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>{generating?'Generating...':'🤖 Generate OIR Test'}</button></div>}
      {questions.length>0&&(
        <div>
          {revealed&&<div className="rounded-xl p-4 mb-4 text-center border" style={{background:`${theme.accent}10`,borderColor:`${theme.accent}30`}}><p className="font-bebas text-2xl" style={{color:theme.accent}}>{score}/{questions.length} Correct</p></div>}
          {questions.map((q,i)=>(
            <div key={q.id} className="rounded-xl p-4 mb-3 border" style={{background:theme.bgMid,borderColor:theme.border}}>
              <p className="text-white text-sm mb-3"><span className="font-mono text-gray-500 mr-1">Q{i+1}.</span>{q.question}</p>
              <div className="grid grid-cols-2 gap-2">{(['a','b','c','d'] as const).map(o=>(
                <button key={o} onClick={()=>!revealed&&setAnswers(p=>({...p,[q.id]:o}))} className={`text-left px-3 py-2 rounded-xl border text-xs transition-all ${revealed?(o===q.correct_option?'border-green-500 bg-green-900/30 text-green-300':answers[q.id]===o?'border-red-500 bg-red-900/30 text-red-300':'border-white/10 text-gray-400 opacity-40'):(answers[q.id]===o?'border-yellow-500 bg-yellow-900/20 text-yellow-300':'border-white/10 text-gray-300 hover:border-yellow-500/30')}`}>
                  <span className="font-mono text-gray-500 mr-1">{o.toUpperCase()}.</span>{q[`option_${o}`]}
                </button>
              ))}</div>
              {revealed&&q.explanation&&<p className="mt-2 text-xs text-gray-400 bg-black/20 px-3 py-1.5 rounded-lg"><span className="text-green-400 mr-1">Explanation:</span>{q.explanation}</p>}
            </div>
          ))}
          {!revealed&&<button onClick={()=>setRevealed(true)} className="w-full py-3 rounded-xl font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Submit & See Results</button>}
          {revealed&&<button onClick={()=>{setQuestions([]);setAnswers({});setRevealed(false)}} className="w-full py-2.5 rounded-xl border text-sm text-gray-300 mt-2" style={{borderColor:theme.border}}>Try Another</button>}
        </div>
      )}
    </div>
  )
}