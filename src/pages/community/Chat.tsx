import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import { Send } from 'lucide-react'
export default function Chat() {
  const { profile }=useAuth(); const { theme }=useTheme()
  const [messages,setMessages]=useState<any[]>([]); const [input,setInput]=useState(''); const [room,setRoom]=useState('global')
  const bottomRef=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    supabase.from('chat_messages').select('*,user:profiles(name,avatar_url)').eq('room_id',room).order('created_at',{ascending:true}).limit(50).then(({data})=>setMessages(data||[]))
    const ch=supabase.channel(`chat:${room}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages',filter:`room_id=eq.${room}`},p=>setMessages(prev=>[...prev,p.new])).subscribe()
    return()=>{ supabase.removeChannel(ch) }
  },[room])
  useEffect(()=>bottomRef.current?.scrollIntoView({behavior:'smooth'}),[messages])
  async function send(){ if(!input.trim()||!profile?.id) return; await supabase.from('chat_messages').insert({room_id:room,user_id:profile.id,message:input}); setInput('') }
  return (
    <div className="flex flex-col h-[calc(100vh-57px)]" style={{background:theme.bg}}>
      <div className="flex gap-2 px-4 py-2 border-b" style={{background:theme.bgMid,borderColor:theme.border}}>
        {[{k:'global',l:'🌍 Global'},{k:'army',l:'🪖 Army'},{k:'navy',l:'⚓ Navy'},{k:'airforce',l:'✈️ Air Force'}].map(r=>(
          <button key={r.k} onClick={()=>setRoom(r.k)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${room===r.k?'text-[#0B1628] font-bold':'text-gray-400 border'}`} style={room===r.k?{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`}:{borderColor:theme.border}}>{r.l}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m=>(
          <div key={m.id} className={`flex gap-2 ${m.user_id===profile?.id?'flex-row-reverse':''}`}>
            <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center font-bebas text-xs shrink-0" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>{m.user?.avatar_url?<img src={m.user.avatar_url} className="w-full h-full object-cover" alt=""/>:(m.user?.name?.[0]||'?')}</div>
            <div className={`max-w-[70%] ${m.user_id===profile?.id?'items-end':''}`}>
              <p className={`text-[10px] font-mono text-gray-500 mb-0.5 ${m.user_id===profile?.id?'text-right':''}`}>{m.user?.name}</p>
              <div className="px-3 py-2 rounded-2xl text-sm" style={m.user_id===profile?.id?{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}:{background:theme.bgMid,color:'white',border:`1px solid ${theme.border}`}}>{m.message}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
      <div className="p-3 border-t flex gap-2" style={{borderColor:theme.border,background:theme.bgMid}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type a message..." className="flex-1 bg-black/30 border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none" style={{borderColor:theme.border}}/>
        <button onClick={send} className="p-2.5 rounded-xl" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`}}><Send size={14} className="text-[#0B1628]"/></button>
      </div>
    </div>
  )
}