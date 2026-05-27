import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'
import { callAI, buildUserContext } from '../lib/ai'

function Countdown({ examDate, mathsTime, gatTime }:{ examDate:string; mathsTime:string; gatTime:string }) {
  const [now,setNow] = useState(new Date())
  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(t) },[])
  const target = new Date(`${examDate}T${mathsTime||'10:00'}`)
  const diff = Math.max(0, target.getTime()-now.getTime())
  const d=Math.floor(diff/86400000), h=Math.floor((diff%86400000)/3600000), m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000)
  return (
    <div className="flex gap-3 justify-center">
      {[{v:d,l:'DAYS'},{v:h,l:'HOURS'},{v:m,l:'MINS'},{v:s,l:'SECS'}].map(({v,l})=>(
        <div key={l} className="text-center"><div className="font-bebas text-4xl text-white bg-black/30 rounded-xl px-4 py-2 min-w-[58px]">{String(v).padStart(2,'0')}</div><div className="font-mono text-[9px] text-gray-400 tracking-widest mt-1">{l}</div></div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { profile } = useAuth(); const { theme } = useTheme(); const navigate = useNavigate()
  const [motivation, setMotivation] = useState(''); const [streak, setStreak] = useState(0)
  const [settings, setSettings] = useState<Record<string,string>>({})

  useEffect(()=>{
    if(!profile) return
    supabase.from('admin_settings').select('key,value').then(({data})=>{ const s:Record<string,string>={}; data?.forEach(({key,value}:any)=>{ if(value) s[key]=value }); setSettings(s) })
    supabase.from('streaks').select('current_streak').eq('user_id',profile.id).single().then(({data})=>setStreak(data?.current_streak||0))
    supabase.from('activity_log').insert({user_id:profile.id,action_type:'login',page:'/dashboard'})
    const cacheKey = `dna_mot_${new Date().toDateString()}_${profile.id}`
    const cached = localStorage.getItem(cacheKey)
    if(cached){ setMotivation(cached); return }
    callAI([{role:'system',content:buildUserContext(profile,{streak:0})},{role:'user',content:'Give ONE powerful motivational line (max 15 words). Just the line.'}],{maxTokens:50}).then(t=>{ const clean=t.trim().replace(/^["']/,'').replace(/["']$/,''); setMotivation(clean); localStorage.setItem(cacheKey,clean) }).catch(()=>setMotivation('Every day you train, you get closer to the uniform. 🎖️'))
  },[profile?.id])

  const serviceImgs:Record<string,string> = { army:'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800', navy:'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800', airforce:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800' }
  const img = serviceImgs[profile?.service||'army']
  const today = new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      <div className="relative rounded-2xl overflow-hidden min-h-[90px]" style={{background:theme.bgLight}}>
        <img src={img} className="absolute inset-0 w-full h-full object-cover opacity-15" alt=""/>
        <div className="relative z-10 p-5">
          <p className="font-mono text-xs text-gray-400 tracking-widest mb-1">{today}</p>
          <h1 className="font-bebas text-3xl md:text-4xl tracking-wider text-white">WELCOME BACK, <span style={{color:theme.accent}}>{profile?.name?.split(' ')[0]?.toUpperCase()||'CADET'}!</span> {theme.serviceIcon}</h1>
          <p className="text-gray-400 text-xs">{profile?.attempt} attempt · {profile?.target_exam||'NDA 2026'} · {(profile?.service||'').toUpperCase()}</p>
        </div>
      </div>
      <div className="rounded-2xl p-5 text-center" style={{background:theme.bgMid,border:`1px solid ${theme.border}`}}>
        <p className="font-mono text-xs text-gray-400 tracking-widest mb-3">⏱️ EXAM COUNTDOWN</p>
        <Countdown examDate={settings.exam_date||'2026-09-14'} mathsTime={settings.exam_maths_time||'10:00'} gatTime={settings.exam_gat_time||'14:00'}/>
      </div>
      {motivation&&<div className="rounded-xl p-4 flex items-center gap-3" style={{background:`${theme.accent}10`,border:`1px solid ${theme.accent}30`}}>
        <span className="text-xl">⭐</span><div><p className="font-mono text-[9px] tracking-widest mb-0.5" style={{color:theme.accent}}>TODAY'S MOTIVATION</p><p className="text-white text-sm font-medium">{motivation}</p></div>
      </div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{l:'DNA SCORE',v:`${profile?.dna_score||0}%`,e:'🧬',to:'/dna-score'},{l:'STREAK',v:`${streak} days`,e:'🔥',to:'/activity'},{l:'ACCURACY',v:'—',e:'🎯',to:'/tests'},{l:'CONSISTENCY',v:'—',e:'📊',to:'/activity'}].map(s=>(
          <button key={s.l} onClick={()=>navigate(s.to)} className="rounded-xl p-4 text-center hover:scale-[1.02] transition-transform" style={{background:theme.bgMid,border:`1px solid ${theme.border}`}}>
            <div className="text-2xl mb-1">{s.e}</div><div className="font-bebas text-xl" style={{color:theme.accent}}>{s.v}</div><div className="font-mono text-[9px] text-gray-400 tracking-widest">{s.l}</div>
          </button>
        ))}
      </div>
      <div className="rounded-xl p-5" style={{background:theme.bgMid,border:`1px solid ${theme.border}`}}>
        <p className="font-mono text-xs tracking-widest mb-3" style={{color:theme.accent}}>🤖 TODAY'S AI PLAN</p>
        <p className="text-gray-400 text-sm mb-3">Complete your profile and take your first test to get a personalized daily plan.</p>
        <div className="flex gap-2"><button onClick={()=>navigate('/ai-tutor')} className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Ask AI Tutor</button><button onClick={()=>navigate('/tests')} className="flex-1 py-2.5 rounded-xl text-sm border font-medium text-gray-300 hover:bg-white/5" style={{borderColor:theme.border}}>Take First Test</button></div>
      </div>
      <div>
        <p className="font-mono text-xs tracking-widest mb-3" style={{color:theme.accent}}>QUICK ACCESS</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{to:'/study/maths',l:'Maths Hub',img:'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300'},{to:'/ssb',l:'SSB Prep',img:'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=300'},{to:'/current-affairs',l:'Current Affairs',img:'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300'},{to:'/tests',l:'Mock Tests',img:'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=300'}].map(item=>(
            <button key={item.to} onClick={()=>navigate(item.to)} className="relative rounded-xl overflow-hidden h-20 hover:scale-[1.02] transition-transform">
              <img src={item.img} className="absolute inset-0 w-full h-full object-cover" alt=""/><div className="absolute inset-0 bg-black/50"/><div className="absolute inset-0 flex items-end p-2"><span className="font-bebas text-xs tracking-wide text-white">{item.l}</span></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}