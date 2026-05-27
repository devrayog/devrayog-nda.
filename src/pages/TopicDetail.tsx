import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'
import { callAI, buildUserContext } from '../lib/ai'
import { Bookmark, Flag, ChevronLeft } from 'lucide-react'
export default function TopicDetail() {
  const { topicId } = useParams(); const { profile } = useAuth(); const { theme } = useTheme(); const navigate = useNavigate()
  const [topic, setTopic] = useState<any>(null); const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<Record<string,string>>({}) ; const [revealed, setRevealed] = useState<Record<string,boolean>>({})
  const [aiExplain, setAiExplain] = useState(''); const [loadingAI, setLoadingAI] = useState(false)
  const [reportQ, setReportQ] = useState<string|null>(null); const [reportMsg, setReportMsg] = useState('')
  useEffect(()=>{
    if(!topicId) return
    supabase.from('topics').select('*').eq('id',topicId).single().then(({data})=>setTopic(data))
    supabase.from('questions').select('*').eq('topic_id',topicId).eq('is_active',true).eq('approved_by_admin',true).limit(20).then(({data})=>setQuestions(data||[]))
    if(profile?.id) supabase.from('activity_log').insert({user_id:profile.id,action_type:'topic_visit',page:`/study/topic/${topicId}`})
  },[topicId,profile?.id])
  async function getAI(){ setLoadingAI(true); const t=await callAI([{role:'system',content:buildUserContext(profile)},{role:'user',content:`Explain "${topic?.title}" for NDA exam. Be concise and practical. Focus on what matters most.`}],{maxTokens:500}); setAiExplain(t); setLoadingAI(false) }
  async function bookmark(id:string){ if(!profile?.id) return; await supabase.from('bookmarks').upsert({user_id:profile.id,question_id:id}) }
  async function addError(id:string){ if(!profile?.id) return; await supabase.from('error_log').upsert({user_id:profile.id,question_id:id}) }
  async function report(id:string){ await supabase.from('question_reports').insert({user_id:profile?.id,question_id:id,issue:reportMsg}); setReportQ(null); setReportMsg(''); alert('Reported!') }
  if(!topic) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"/></div>
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <button onClick={()=>navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4"><ChevronLeft size={14}/>Back</button>
      <div className="relative rounded-xl overflow-hidden mb-5" style={{background:theme.bgLight,minHeight:80}}>
        {topic.image_url&&<img src={topic.image_url} className="absolute inset-0 w-full h-full object-cover opacity-20" alt=""/>}
        <div className="relative z-10 p-5"><span className="text-xs font-mono text-gray-400 uppercase">{topic.subject}</span><h1 className="font-bebas text-3xl tracking-wider mt-0.5" style={{color:theme.accent}}>{topic.title}</h1>{topic.subtopics?.length>0&&<p className="text-xs text-gray-400 mt-1">{topic.subtopics.join(' · ')}</p>}</div>
      </div>
      <div className="rounded-xl p-4 mb-5 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <div className="flex items-center justify-between mb-2"><span className="font-mono text-xs tracking-widest" style={{color:theme.accent}}>🤖 AI EXPLANATION</span>
          {!aiExplain&&<button onClick={getAI} disabled={loadingAI} className="text-xs px-3 py-1.5 rounded-lg font-bold disabled:opacity-50" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>{loadingAI?'Loading...':'Generate'}</button>}
        </div>
        {aiExplain?<p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{aiExplain}</p>:<p className="text-gray-500 text-xs">Click Generate to get AI explanation.</p>}
      </div>
      <h2 className="font-bebas text-xl tracking-wider mb-3" style={{color:theme.accent}}>PRACTICE QUESTIONS</h2>
      {questions.length===0?<div className="text-center py-8 text-gray-400">No questions yet.</div>:questions.map((q,i)=>(
        <div key={q.id} className="rounded-xl p-4 mb-3 border" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div className="flex justify-between items-start gap-2 mb-3">
            <div className="flex-1"><span className="text-xs font-mono text-gray-500 mr-1">Q{i+1}.</span>{q.question_image_url&&<img src={q.question_image_url} className="rounded-lg mb-2 max-h-40 object-contain" alt=""/>}{q.question&&<span className="text-white text-sm">{q.question}</span>}</div>
            <div className="flex gap-1"><button onClick={()=>bookmark(q.id)} title="Bookmark" className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-yellow-400"><Bookmark size={12}/></button><button onClick={()=>addError(q.id)} className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-red-400 text-xs">❌</button><button onClick={()=>setReportQ(q.id)} className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-orange-400"><Flag size={12}/></button></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">{(['a','b','c','d'] as const).map(opt=>(
            <button key={opt} onClick={()=>{setAnswers(p=>({...p,[q.id]:opt}));setRevealed(p=>({...p,[q.id]:true}))}} className={`text-left px-3 py-2 rounded-xl border text-xs transition-all ${revealed[q.id]?(opt===q.correct_option?'border-green-500 bg-green-900/30 text-green-300':answers[q.id]===opt?'border-red-500 bg-red-900/30 text-red-300':'border-white/10 text-gray-400 opacity-40'):(answers[q.id]===opt?'border-yellow-500 bg-yellow-900/20 text-yellow-300':'border-white/10 text-gray-300 hover:border-yellow-500/30')}`}>
              <span className="font-mono text-gray-500 mr-1">{opt.toUpperCase()}.</span>{q[`option_${opt}_image_url`]?<img src={q[`option_${opt}_image_url`]} className="inline h-6 object-contain ml-1" alt=""/>:(q[`option_${opt}`]||'')}
            </button>
          ))}</div>
          {revealed[q.id]&&q.explanation&&<p className="text-xs text-gray-300 bg-black/20 px-3 py-2 rounded-lg mt-1"><span className="text-green-400 font-mono mr-1">Explanation:</span>{q.explanation}</p>}
          {!revealed[q.id]&&<button onClick={()=>setRevealed(p=>({...p,[q.id]:true}))} className="text-xs text-gray-500 hover:text-white mt-1">Reveal answer</button>}
        </div>
      ))}
      {reportQ&&(<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className="rounded-xl p-5 max-w-sm w-full" style={{background:theme.bgMid,border:`1px solid ${theme.border}`}}>
        <h3 className="font-bebas text-lg mb-2" style={{color:theme.accent}}>REPORT QUESTION</h3>
        <textarea value={reportMsg} onChange={e=>setReportMsg(e.target.value)} rows={3} placeholder="Describe the issue..." className="w-full bg-black/30 border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none resize-none mb-3" style={{borderColor:theme.border}}/>
        <div className="flex gap-2"><button onClick={()=>setReportQ(null)} className="flex-1 py-2 rounded-lg border text-sm text-gray-300" style={{borderColor:theme.border}}>Cancel</button><button onClick={()=>report(reportQ)} className="flex-1 py-2 rounded-lg text-sm font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Report</button></div>
      </div></div>)}
    </div>
  )
}