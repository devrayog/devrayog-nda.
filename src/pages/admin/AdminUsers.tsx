import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [premiumToggle, setPremiumToggle] = useState(false)

  useEffect(()=>{
    supabase.from('admin_settings').select('value').eq('key','premium_enabled').single().then(({data})=>setPremiumToggle(data?.value==='true'))
    load()
  },[])

  async function load() {
    const {data} = await supabase.from('profiles').select('*').order('created_at',{ascending:false}).limit(100)
    setUsers(data||[])
  }

  async function togglePremium(id:string, current:boolean) {
    await supabase.from('profiles').update({is_premium:!current}).eq('id',id); load()
  }

  async function toggleAdmin(id:string, current:boolean) {
    await supabase.from('profiles').update({is_admin:!current}).eq('id',id); load()
  }

  async function toggleGlobalPremium() {
    const newVal = !premiumToggle
    await supabase.from('admin_settings').upsert({key:'premium_enabled',value:String(newVal)})
    setPremiumToggle(newVal)
  }

  const filtered = users.filter(u=>!search||(u.name||'').toLowerCase().includes(search.toLowerCase())||(u.email||'').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6">
      <h1 className="font-bebas text-3xl text-yellow-400 tracking-wider mb-4">USER MANAGEMENT</h1>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"/>
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-400">Premium Mode</span>
          <button onClick={toggleGlobalPremium} className={`w-10 h-5 rounded-full transition-all relative ${premiumToggle?'bg-yellow-500':'bg-gray-600'}`}>
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${premiumToggle?'left-5':'left-0.5'}`}/>
          </button>
        </div>
      </div>
      {premiumToggle&&<div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 mb-4 text-xs text-yellow-400">⚡ Premium mode is ON — AI features are gated for free users</div>}
      <div className="space-y-2">
        {filtered.map(u=>(
          <div key={u.id} className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bebas shrink-0 bg-yellow-500 text-gray-900">
              {u.avatar_url?<img src={u.avatar_url} className="w-full h-full object-cover" alt=""/>:(u.name?.[0]||'?')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{u.name||'No name'} {u.is_admin&&<span className="text-[10px] bg-red-900/40 text-red-300 px-1.5 py-0.5 rounded-full">ADMIN</span>}</p>
              <p className="text-xs text-gray-400 truncate">{u.email} · {u.state} · {u.attempt} attempt</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={()=>togglePremium(u.id,u.is_premium)} className={`text-xs px-2 py-1 rounded-lg transition-all ${u.is_premium?'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30':'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                {u.is_premium?'👑 Premium':'Free'}
              </button>
              <button onClick={()=>toggleAdmin(u.id,u.is_admin)} className={`text-xs px-2 py-1 rounded-lg transition-all ${u.is_admin?'bg-red-900/40 text-red-300':'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                {u.is_admin?'Admin':'Make Admin'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}