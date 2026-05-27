import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
export default function AdminWaitlist() {
  const [entries,setEntries]=useState<any[]>([]); const [filter,setFilter]=useState({status:'',attempt:''}); const [loading,setLoading]=useState(true)
  async function load(){
    setLoading(true)
    let q=supabase.from('waitlist').select('*').order('created_at',{ascending:false})
    if(filter.status) q=q.eq('status',filter.status)
    if(filter.attempt) q=q.eq('current_attempt',filter.attempt)
    const {data}=await q; setEntries(data||[]); setLoading(false)
  }
  useEffect(()=>{load()},[filter])
  useEffect(()=>{
    const ch=supabase.channel('waitlist-live').on('postgres_changes',{event:'INSERT',schema:'public',table:'waitlist'},()=>load()).subscribe()
    return()=>{ supabase.removeChannel(ch) }
  },[])
  async function updateStatus(id:string,status:string){ await supabase.from('waitlist').update({status}).eq('id',id); load() }
  function exportCSV(){
    const headers=['name','email','phone','whatsapp','location','state','current_attempt','target_exam','status','diagnostic_score','created_at']
    const rows=entries.map(e=>headers.map(h=>JSON.stringify((e as any)[h]||'')).join(','))
    const csv=[headers.join(','),...rows].join('\n')
    const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='waitlist.csv'; a.click()
  }
  const statusColors:Record<string,string>={pending:'bg-yellow-900/40 text-yellow-300',approved:'bg-green-900/40 text-green-300',rejected:'bg-red-900/40 text-red-300'}
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bebas text-3xl text-yellow-400 tracking-wider">WAITLIST ({entries.length})</h1>
        <button onClick={exportCSV} className="px-4 py-2 rounded-lg text-xs font-bold bg-yellow-500 text-gray-900">📥 Export CSV</button>
      </div>
      <div className="flex gap-2 mb-4">
        {[{k:'status',opts:['','pending','approved','rejected'],l:'Status'},{k:'attempt',opts:['','1st','2nd','3rd','4th+'],l:'Attempt'}].map(f=>(
          <select key={f.k} value={(filter as any)[f.k]} onChange={e=>setFilter(p=>({...p,[f.k]:e.target.value}))} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white outline-none">
            {f.opts.map(o=><option key={o} value={o}>{o||'All '+f.l}</option>)}
          </select>
        ))}
      </div>
      {loading?<p className="text-gray-400 text-sm">Loading...</p>:
      <div className="space-y-3">{entries.map(e=>(
        <div key={e.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bebas text-lg text-white">{e.name} <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[e.status]||'bg-gray-700 text-gray-400'}`}>{e.status}</span></p>
              <p className="text-xs text-gray-400">{e.email} · {e.phone} · {e.state}</p>
              <p className="text-xs text-gray-500">{e.current_attempt} attempt · {e.target_exam} · Score: {e.diagnostic_score?.toFixed(0)||'—'}%</p>
              <p className="text-xs text-gray-600">{new Date(e.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <div className="flex gap-1">
                <button onClick={()=>navigator.clipboard.writeText(e.email)} className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300 hover:bg-gray-600">📋</button>
                {e.whatsapp&&<button onClick={()=>window.open('https://wa.me/'+e.whatsapp.replace(/\D/g,''),'_blank')} className="text-xs px-2 py-1 bg-green-900/50 rounded text-green-300">📱</button>}
              </div>
              <select value={e.status} onChange={ev=>updateStatus(e.id,ev.target.value)} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white outline-none">
                <option value="pending">pending</option><option value="approved">approved</option><option value="rejected">rejected</option>
              </select>
            </div>
          </div>
        </div>
      ))}</div>}
    </div>
  )
}