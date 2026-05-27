import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
export default function StudyPartners() {
  const { profile }=useAuth(); const { theme }=useTheme()
  const [partners,setPartners]=useState<any[]>([]); const [state,setState]=useState(''); const [attempt,setAttempt]=useState(''); const [registered,setRegistered]=useState(false)
  useEffect(()=>{
    supabase.from('study_partner_profiles').select('*,user:profiles(name,avatar_url,state,attempt,service,dna_score)').eq('is_looking',true).then(({data})=>{
      let list=data||[]; if(state) list=list.filter((p:any)=>p.user?.state===state); if(attempt) list=list.filter((p:any)=>p.user?.attempt===attempt); setPartners(list)
    })
  },[state,attempt])
  async function register(){ if(!profile?.id) return; await supabase.from('study_partner_profiles').upsert({user_id:profile.id,is_looking:true}); setRegistered(true) }
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="STUDY PARTNERS" subtitle="Find accountability partners by state and attempt." icon="🤝" page="Study Partners" image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800"/>
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <select value={state} onChange={e=>setState(e.target.value)} className="bg-black/30 border rounded-xl px-3 py-2 text-sm text-white outline-none" style={{borderColor:theme.border}}><option value="">All States</option>{['Delhi','Rajasthan','UP','Bihar','Haryana','MP'].map(s=><option key={s} value={s}>{s}</option>)}</select>
        <select value={attempt} onChange={e=>setAttempt(e.target.value)} className="bg-black/30 border rounded-xl px-3 py-2 text-sm text-white outline-none" style={{borderColor:theme.border}}><option value="">All Attempts</option>{['1st','2nd','3rd','4th+'].map(a=><option key={a} value={a}>{a}</option>)}</select>
        {!registered&&<button onClick={register} className="px-4 py-2 rounded-xl text-sm font-bold ml-auto" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>+ Register</button>}
      </div>
      <p className="text-xs text-gray-500 mb-3 font-mono">{partners.length} candidates found</p>
      <div className="space-y-2">{partners.map(p=>(
        <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bebas shrink-0" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>{p.user?.avatar_url?<img src={p.user.avatar_url} className="w-full h-full object-cover" alt=""/>:(p.user?.name?.[0]||'?')}</div>
          <div className="flex-1"><p className="text-sm font-medium text-white">{p.user?.name||'Anonymous'}</p><div className="flex gap-1 mt-0.5 flex-wrap">{[p.user?.state,p.user?.attempt&&`${p.user.attempt} attempt`,p.user?.service].filter(Boolean).map((t,i)=><span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-gray-400">{t}</span>)}</div></div>
          <div className="text-right"><p className="font-bebas text-lg" style={{color:theme.accent}}>{p.user?.dna_score||0}%</p><p className="text-[10px] text-gray-500">DNA</p></div>
        </div>
      ))}</div>
    </div>
  )
}