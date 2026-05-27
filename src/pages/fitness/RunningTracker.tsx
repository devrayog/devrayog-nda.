import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
export default function RunningTracker() {
  const { profile }=useAuth(); const { theme }=useTheme()
  const [runs,setRuns]=useState<any[]>([]); const [form,setForm]=useState({dist:'',mins:'',notes:''}); const [logging,setLogging]=useState(false)
  const load=()=>{ if(profile?.id) supabase.from('run_logs').select('*').eq('user_id',profile.id).order('logged_at',{ascending:false}).limit(20).then(({data})=>setRuns(data||[])) }
  useEffect(()=>load(),[profile?.id])
  async function logRun(e:React.FormEvent){ e.preventDefault(); if(!profile?.id) return; setLogging(true)
    const d=parseFloat(form.dist), t=parseFloat(form.mins), pace=t/d
    await supabase.from('run_logs').insert({user_id:profile.id,distance_km:d,duration_minutes:t,pace,notes:form.notes})
    setForm({dist:'',mins:'',notes:''}); setLogging(false); load() }
  const total=runs.reduce((s,r)=>s+(r.distance_km||0),0); const best=runs.length>0?Math.min(...runs.map(r=>r.pace||99)):0
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="RUNNING TRACKER" subtitle="Track your daily runs." icon="🏃" page="Running Tracker" image="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"/>
      <div className="grid grid-cols-3 gap-3 mb-5">{[{l:'Total Runs',v:runs.length},{l:'Total Distance',v:`${total.toFixed(1)}km`},{l:'Best Pace',v:best>0?`${best.toFixed(1)} min/km`:'—'}].map(s=>(
        <div key={s.l} className="text-center rounded-xl p-3 border" style={{background:theme.bgMid,borderColor:theme.border}}><p className="font-bebas text-xl" style={{color:theme.accent}}>{s.v}</p><p className="text-[10px] font-mono text-gray-400">{s.l}</p></div>
      ))}</div>
      <div className="rounded-xl p-4 mb-5 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <h3 className="font-bebas text-lg mb-3" style={{color:theme.accent}}>LOG A RUN</h3>
        <form onSubmit={logRun} className="grid grid-cols-2 gap-3">
          {[{k:'dist',l:'Distance (km)',p:'1.6'},{k:'mins',l:'Time (minutes)',p:'8'}].map(f=>(
            <div key={f.k}><label className="block text-xs font-mono text-gray-400 mb-1">{f.l}</label><input type="number" step="0.1" value={(form as any)[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} required className="w-full bg-black/30 border rounded-xl px-3 py-2 text-sm text-white outline-none" style={{borderColor:theme.border}}/></div>
          ))}
          <div className="col-span-2"><label className="block text-xs font-mono text-gray-400 mb-1">Notes</label><input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="How did it feel?" className="w-full bg-black/30 border rounded-xl px-3 py-2 text-sm text-white outline-none" style={{borderColor:theme.border}}/></div>
          <button type="submit" disabled={logging} className="col-span-2 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>{logging?'Logging...':'Log Run'}</button>
        </form>
      </div>
      <div className="space-y-2">{runs.map(r=>(
        <div key={r.id} className="flex justify-between px-4 py-3 rounded-xl border" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div><p className="font-bebas text-lg text-white">{r.distance_km}km</p><p className="text-xs text-gray-400">{new Date(r.logged_at).toLocaleDateString('en-IN')} · {r.notes}</p></div>
          <div className="text-right"><p className="text-sm text-white">{r.duration_minutes} min</p><p className="text-xs text-gray-400">{r.pace?.toFixed(1)} min/km</p></div>
        </div>
      ))}</div>
    </div>
  )
}