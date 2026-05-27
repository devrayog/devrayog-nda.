import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { streamAI, buildUserContext } from '../lib/ai'
import { supabase } from '../lib/supabase'
import { Send, Upload, Trash2, Bot } from 'lucide-react'
interface Msg { role:'user'|'assistant'; content:string }
export default function AITutor() {
  const { profile } = useAuth(); const { theme } = useTheme()
  const [msgs, setMsgs] = useState<Msg[]>([]); const [input, setInput] = useState(''); const [streaming, setStreaming] = useState(false); const [streak, setStreak] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null); const fileRef = useRef<HTMLInputElement>(null)
  useEffect(()=>{
    const saved = localStorage.getItem(`dna_chat_${profile?.id}`); if(saved) setMsgs(JSON.parse(saved))
    if(profile?.id) supabase.from('streaks').select('current_streak').eq('user_id',profile.id).single().then(({data})=>setStreak(data?.current_streak||0))
  },[profile?.id])
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}); if(profile?.id&&msgs.length) localStorage.setItem(`dna_chat_${profile.id}`,JSON.stringify(msgs.slice(-50))) },[msgs])
  async function send() {
    if(!input.trim()||streaming) return
    const userMsg:Msg={role:'user',content:input}; const newMsgs=[...msgs,userMsg]; setMsgs(newMsgs); setInput(''); setStreaming(true)
    const sys = buildUserContext(profile,{streak}); const aiMsgs=[{role:'system' as const,content:sys},...newMsgs.slice(-10).map(m=>({role:m.role,content:m.content}))]
    let resp=''; setMsgs(p=>[...p,{role:'assistant',content:''}])
    await streamAI(aiMsgs, chunk=>{ resp+=chunk; setMsgs(p=>{ const c=[...p]; c[c.length-1]={role:'assistant',content:resp}; return c }) }, ()=>setStreaming(false))
  }
  async function handleFile(e:React.ChangeEvent<HTMLInputElement>) {
    const file=e.target.files?.[0]; if(!file) return
    const reader=new FileReader(); reader.onload=()=>{ const text=reader.result as string; setInput(p=>p+`
[File: ${file.name}]
${text.slice(0,2000)}`) }; reader.readAsText(file)
  }
  return (
    <div className="flex flex-col h-[calc(100vh-57px)]" style={{background:theme.bg}}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{background:theme.bgMid,borderColor:theme.border}}>
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`}}><Bot size={16} className="text-[#0B1628]"/></div><div><h1 className="font-bebas text-base tracking-wider" style={{color:theme.accent}}>DNA AI TUTOR</h1><p className="text-[10px] text-gray-400">Personalized for {profile?.name?.split(' ')[0]||'you'}</p></div></div>
        <button onClick={()=>{ setMsgs([]); localStorage.removeItem(`dna_chat_${profile?.id}`) }} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400"><Trash2 size={14}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.length===0&&(<div className="text-center py-12">
          <img src="https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=200" className="w-24 h-24 object-cover rounded-full mx-auto mb-3 opacity-60" alt=""/>
          <h2 className="font-bebas text-xl mb-2" style={{color:theme.accent}}>YOUR AI MENTOR IS READY</h2>
          <p className="text-gray-400 text-xs mb-4">Ask anything — Maths, SSB, Current Affairs, or strategy.</p>
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">{['Give me 5 hard Maths questions','How to prepare for PPDT?','Explain Integration','Tips for SSB interview'].map(s=>(
            <button key={s} onClick={()=>setInput(s)} className="px-2 py-2 rounded-xl text-xs text-left border hover:bg-white/5 text-gray-300" style={{borderColor:theme.border}}>{s}</button>
          ))}</div>
        </div>)}
        {msgs.map((msg,i)=>(
          <div key={i} className={`flex ${msg.role==='user'?'justify-end':'justify-start'} gap-2`}>
            {msg.role==='assistant'&&<div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`}}><Bot size={10} className="text-[#0B1628]"/></div>}
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${msg.role==='user'?'rounded-br-sm':'rounded-bl-sm'}`} style={msg.role==='user'?{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:'#0B1628'}:{background:theme.bgMid,color:'white',border:`1px solid ${theme.border}`}}>
              {msg.content||((streaming&&i===msgs.length-1)?<span className="animate-pulse">●●●</span>:'')}
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
      <div className="p-3 border-t" style={{borderColor:theme.border,background:theme.bgMid}}>
        <div className="flex gap-2 items-end">
          <input ref={fileRef} type="file" className="hidden" onChange={handleFile} accept=".txt,.pdf,.doc"/>
          <button onClick={()=>fileRef.current?.click()} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 shrink-0"><Upload size={14}/></button>
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()} }} placeholder="Ask your AI tutor anything..." rows={1} className="flex-1 bg-black/30 border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none resize-none focus:border-yellow-500" style={{borderColor:theme.border}}/>
          <button onClick={send} disabled={streaming||!input.trim()} className="p-2 rounded-xl disabled:opacity-50 shrink-0" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`}}><Send size={14} className="text-[#0B1628]"/></button>
        </div>
        <p className="text-[10px] text-gray-600 mt-1 text-center font-mono">AI may make mistakes. Verify important information.</p>
      </div>
    </div>
  )
}