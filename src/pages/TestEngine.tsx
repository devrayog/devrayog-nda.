import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'
import { callAI, buildUserContext } from '../lib/ai'
import { Flag, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'
export default function TestEngine() {
  const {testId}=useParams(); const [sp]=useSearchParams(); const {profile}=useAuth(); const {theme}=useTheme(); const navigate=useNavigate()
  const [questions,setQuestions]=useState<any[]>([]); const [answers,setAnswers]=useState<Record<string,string>>({}); const [flagged,setFlagged]=useState<Set<string>>(new Set()); const [bookmarked,setBookmarked]=useState<Set<string>>(new Set())
  const [current,setCurrent]=useState(0); const [timeLeft,setTimeLeft]=useState(9000); const [started,setStarted]=useState(false); const [loading,setLoading]=useState(true); const [submitting,setSubmitting]=useState(false)
  const testType=sp.get('type')||'admin'; const totalTime=testType.includes('paper1')||testType.includes('paper2')?150*60:90*60
  useEffect(()=>{
    async function load(){
      if(testType==='ai'){
        const ctx=buildUserContext(profile); const raw=await callAI([{role:'system',content:ctx},{role:'user',content:'Generate 10 NDA-level MCQ questions. Return ONLY JSON array: [{"question":"","option_a":"","option_b":"","option_c":"","option_d":"","correct_option":"a","explanation":"","subject":"maths"}]. No markdown.'}],{maxTokens:2000})
        try{const p=JSON.parse(raw.replace(/```json|```/g,'').trim()); setQuestions(p.map((q:any,i:number)=>({...q,id:`ai_${i}`})))}catch{setQuestions([])}
      } else if(testId&&testId!=='new'){
        const {data}=await supabase.from('mock_test_questions').select('*, question:questions(*)').eq('test_id',testId).order('order_index')
        setQuestions(data?.map((d:any)=>d.question).filter(Boolean)||[])
      }
      setTimeLeft(totalTime); setLoading(false)
    }
    load()
  },[testId,testType])
  useEffect(()=>{
    if(!started) return
    const t=setInterval(()=>setTimeLeft(p=>{ if(p<=1){clearInterval(t);submit();return 0} return p-1 }),1000)
    return()=>clearInterval(t)
  },[started])
  const submit=useCallback(async()=>{
    if(submitting) return; setSubmitting(true)
    let correct=0,incorrect=0,skipped=0
    const cp=testType.includes('paper1')?2.5:4; const np=testType.includes('paper1')?0.833:1.333
    questions.forEach(q=>{ const a=answers[q.id]; if(!a) skipped++; else if(a===q.correct_option) correct++; else incorrect++ })
    const score=testType.includes('paper')?correct*cp-incorrect*np:(questions.length>0?(correct/questions.length)*100:0)
    const {data}=await supabase.from('test_results').insert({user_id:profile?.id,test_type:testType,score,total_questions:questions.length,correct,incorrect,skipped,time_taken:totalTime-timeLeft,answers}).select('id').single()
    if(data) navigate(`/tests/results/${data.id}`)
  },[answers,questions,profile,timeLeft,testType,submitting])
  const q=questions[current]; const mins=Math.floor(timeLeft/60); const secs=timeLeft%60
  if(loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"/></div>
  if(questions.length===0) return <div className="text-center py-20 text-gray-400"><p className="text-4xl mb-2">📝</p><p>No questions available.</p><button onClick={()=>navigate(-1)} className="mt-4 text-yellow-400 text-sm hover:underline">← Go back</button></div>
  if(!started) return (
    <div className="flex items-center justify-center h-[calc(100vh-57px)] p-4">
      <div className="max-w-sm w-full rounded-2xl p-6 text-center border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <p className="text-4xl mb-3">📝</p><h2 className="font-bebas text-2xl mb-1" style={{color:theme.accent}}>READY?</h2>
        <p className="text-gray-400 text-sm mb-1">{questions.length} questions · {Math.floor(totalTime/60)} minutes</p>
        <p className="text-xs text-gray-500 mb-4">Timer starts when you click Start.</p>
        <button onClick={()=>setStarted(true)} className="w-full py-3 rounded-xl font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start Test</button>
        <button onClick={()=>navigate(-1)} className="w-full py-2 mt-2 text-sm text-gray-400 hover:text-white">← Cancel</button>
      </div>
    </div>
  )
  return (
    <div className="flex h-[calc(100vh-57px)]" style={{background:theme.bg}}>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{background:theme.bgMid,borderColor:theme.border}}>
          <span className={`font-mono text-sm ${timeLeft<300?'text-red-400':'text-white'}`}>{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</span>
          <span className="text-xs text-gray-400">Q {current+1}/{questions.length}</span>
          <button onClick={submit} disabled={submitting} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>{submitting?'...':'Submit'}</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {q&&(<div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1"><span className="text-xs font-mono text-gray-500 uppercase">{q.subject}</span>{q.question_image_url&&<img src={q.question_image_url} className="rounded-xl mb-2 max-h-48 object-contain mt-1" alt=""/>}{q.question&&<p className="text-white font-medium mt-1 leading-relaxed">{q.question}</p>}</div>
              <div className="flex gap-1 ml-2"><button onClick={()=>setFlagged(p=>{const n=new Set(p);n.has(q.id)?n.delete(q.id):n.add(q.id);return n})} className={`p-1.5 rounded-lg transition-colors ${flagged.has(q.id)?'text-orange-400 bg-orange-900/20':'text-gray-400 hover:text-orange-400'}`}><Flag size={12}/></button>
              <button onClick={()=>{supabase.from('bookmarks').upsert({user_id:profile?.id,question_id:q.id});setBookmarked(p=>{const n=new Set(p);n.add(q.id);return n})}} className={`p-1.5 rounded-lg transition-colors ${bookmarked.has(q.id)?'text-yellow-400':'text-gray-400 hover:text-yellow-400'}`}><Bookmark size={12}/></button></div>
            </div>
            <div className="space-y-2">{(['a','b','c','d'] as const).map(opt=>(
              <button key={opt} onClick={()=>setAnswers(p=>({...p,[q.id]:opt}))} className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${answers[q.id]===opt?'border-yellow-500 bg-yellow-500/10 text-yellow-300':'border-white/10 text-gray-300 hover:border-yellow-500/30'}`}>
                <span className="font-mono text-gray-500 mr-2">{opt.toUpperCase()}.</span>{q[`option_${opt}_image_url`]?<img src={q[`option_${opt}_image_url`]} className="inline h-6 object-contain ml-1" alt=""/>:(q[`option_${opt}`]||'')}
              </button>
            ))}</div>
          </div>)}
        </div>
        <div className="flex justify-between px-4 py-2 border-t" style={{borderColor:theme.border}}>
          <button onClick={()=>setCurrent(p=>Math.max(0,p-1))} disabled={current===0} className="flex items-center gap-1 px-3 py-2 rounded-xl border text-sm disabled:opacity-30 text-gray-300" style={{borderColor:theme.border}}><ChevronLeft size={13}/>Prev</button>
          <button onClick={()=>setCurrent(p=>Math.min(questions.length-1,p+1))} disabled={current===questions.length-1} className="flex items-center gap-1 px-3 py-2 rounded-xl border text-sm disabled:opacity-30 text-gray-300" style={{borderColor:theme.border}}>Next<ChevronRight size={13}/></button>
        </div>
      </div>
      <div className="w-28 border-l p-2 hidden md:block overflow-y-auto" style={{background:theme.bgMid,borderColor:theme.border}}>
        <p className="text-[9px] font-mono text-gray-500 mb-1 px-1">QUESTIONS</p>
        <div className="grid grid-cols-4 gap-1">{questions.map((_,i)=>{ const id=questions[i]?.id; const isFlag=flagged.has(id); const isAns=!!answers[id]
          return <button key={i} onClick={()=>setCurrent(i)} className={`w-6 h-6 rounded text-[10px] font-mono transition-all ${current===i?'ring-2 ring-yellow-400':''} ${isFlag?'bg-orange-700 text-white':isAns?'bg-green-700 text-white':'bg-white/10 text-gray-400'}`}>{i+1}</button>
        })}</div>
      </div>
    </div>
  )
}