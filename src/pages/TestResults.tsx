import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'
import { callAI, buildUserContext } from '../lib/ai'
export default function TestResults() {
  const {resultId}=useParams(); const {profile}=useAuth(); const {theme}=useTheme(); const navigate=useNavigate()
  const [result,setResult]=useState<any>(null); const [analysis,setAnalysis]=useState(''); const [loading,setLoading]=useState(true)
  useEffect(()=>{
    if(!resultId) return
    supabase.from('test_results').select('*').eq('id',resultId).single().then(async({data})=>{
      setResult(data); setLoading(false)
      if(data&&!data.ai_analysis){
        const ctx=buildUserContext(profile)
        const t=await callAI([{role:'system',content:ctx},{role:'user',content:`Test: Score=${data.score?.toFixed(1)}, Correct=${data.correct}, Wrong=${data.incorrect}, Skipped=${data.skipped}. Give brief analysis + 2 improvement tips.`}],{maxTokens:250})
        setAnalysis(t); supabase.from('test_results').update({ai_analysis:t}).eq('id',resultId)
      } else if(data?.ai_analysis) setAnalysis(data.ai_analysis)
    })
  },[resultId])
  if(loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"/></div>
  if(!result) return <div className="text-center py-20 text-gray-400">Result not found.</div>
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="font-bebas text-3xl tracking-wider mb-5" style={{color:theme.accent}}>TEST RESULTS</h1>
      <div className="rounded-2xl p-6 mb-4 text-center border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <div className="font-bebas text-5xl mb-1" style={{color:theme.accent}}>{result.score?.toFixed(1)}</div>
        <p className="text-gray-400 text-xs mb-4">Score</p>
        <div className="grid grid-cols-3 gap-4">{[{l:'Correct',v:result.correct,c:'text-green-400'},{l:'Wrong',v:result.incorrect,c:'text-red-400'},{l:'Skipped',v:result.skipped,c:'text-gray-400'}].map(s=>(
          <div key={s.l}><div className={`font-bebas text-2xl ${s.c}`}>{s.v}</div><p className="text-xs text-gray-500">{s.l}</p></div>
        ))}</div>
      </div>
      {analysis&&<div className="rounded-xl p-4 mb-4 border" style={{background:`${theme.accent}10`,borderColor:`${theme.accent}30`}}>
        <p className="font-mono text-xs tracking-widest mb-2" style={{color:theme.accent}}>🤖 AI ANALYSIS</p>
        <p className="text-gray-300 text-sm leading-relaxed">{analysis}</p>
      </div>}
      <div className="flex gap-3"><button onClick={()=>navigate('/tests')} className="flex-1 py-3 rounded-xl border text-sm text-gray-300" style={{borderColor:theme.border}}>← All Tests</button><button onClick={()=>navigate('/ai-tutor')} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Ask AI Tutor</button></div>
    </div>
  )
}