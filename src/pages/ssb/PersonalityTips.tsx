import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { callAI, buildUserContext } from '../../lib/ai'
import PageHeader from '../../components/ui/PageHeader'
const OLQS=['Effective Intelligence','Reasoning Ability','Organising Ability','Power of Expression','Social Adaptability','Cooperation','Sense of Responsibility','Initiative','Self Confidence','Speed of Decision','Ability to Influence the Group','Liveliness','Determination','Courage','Stamina']
export default function PersonalityTips() {
  const { theme }=useTheme(); const { profile }=useAuth()
  const [tips,setTips]=useState<any[]>([]); const [aiTip,setAiTip]=useState(''); const [loading,setLoading]=useState(false)
  useEffect(()=>{ supabase.from('personality_tips').select('*').eq('is_active',true).order('order_index').then(({data})=>setTips(data||[])) },[])
  async function getAITip(){ setLoading(true); const t=await callAI([{role:'system',content:buildUserContext(profile)},{role:'user',content:'Give 3 specific, practical tips to improve OLQs for SSB. Be direct and actionable.'}],{maxTokens:350}); setAiTip(t); setLoading(false) }
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="PERSONALITY TIPS" subtitle="Officer Like Qualities — what SSB assessors look for." icon="💡" page="Personality Tips" image="https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800"/>
      <div className="rounded-xl p-4 mb-5 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <p className="font-mono text-xs tracking-widest mb-3" style={{color:theme.accent}}>15 OFFICER LIKE QUALITIES</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">{OLQS.map((q,i)=><div key={i} className="text-xs px-2 py-1.5 rounded-lg bg-black/20 text-gray-300 flex items-center gap-1"><span style={{color:theme.accent}}>•</span>{q}</div>)}</div>
      </div>
      <button onClick={getAITip} disabled={loading} className="w-full py-3 rounded-xl font-bold mb-4 disabled:opacity-50" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>{loading?'Getting tips...':'🤖 Get Personalized AI Tips'}</button>
      {aiTip&&<div className="rounded-xl p-4 mb-4 border" style={{background:`${theme.accent}10`,borderColor:`${theme.accent}30`}}><p className="font-mono text-xs mb-2" style={{color:theme.accent}}>AI TIPS FOR YOU</p><p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{aiTip}</p></div>}
      {tips.map(t=><div key={t.id} className="rounded-xl p-4 mb-2 border" style={{background:theme.bgMid,borderColor:theme.border}}>{t.category&&<span className="text-xs font-mono px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 mb-1 inline-block">{t.category}</span>}<h3 className="font-bebas tracking-wide text-white mb-1">{t.title}</h3><p className="text-gray-400 text-sm">{t.body}</p></div>)}
    </div>
  )
}