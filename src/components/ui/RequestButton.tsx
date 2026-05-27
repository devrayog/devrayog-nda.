import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../contexts/ThemeContext'
export default function RequestButton({ page }:{ page:string }) {
  const { profile } = useAuth(); const { theme } = useTheme()
  const [open,setOpen] = useState(false); const [msg,setMsg] = useState(''); const [done,setDone] = useState(false)
  async function submit() {
    if(!msg.trim()) return
    await supabase.from('feedback').insert({ user_id:profile?.id, message:`[REQUEST - ${page}] ${msg}`, name:profile?.name, email:profile?.email })
    setDone(true); setTimeout(()=>{ setOpen(false); setDone(false); setMsg('') },2000)
  }
  return (
    <>
      <button onClick={()=>setOpen(true)} className="text-xs px-3 py-1.5 rounded-lg font-mono" style={{background:`${theme.accent}20`,color:theme.accent,border:`1px solid ${theme.accent}40`}}>+ Request</button>
      {open&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="rounded-xl p-5 max-w-sm w-full" style={{background:theme.bgMid,border:`1px solid ${theme.border}`}}>
            <h3 className="font-bebas text-lg mb-2" style={{color:theme.accent}}>REQUEST ADDITION — {page}</h3>
            {done?<p className="text-green-400 text-sm text-center py-4">✅ Request sent!</p>:(
              <>
                <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={3} placeholder="Describe what you want added..." className="w-full bg-black/30 border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none resize-none mb-3" style={{borderColor:theme.border}}/>
                <div className="flex gap-2">
                  <button onClick={()=>setOpen(false)} className="flex-1 py-2 rounded-lg border text-sm text-gray-300" style={{borderColor:theme.border}}>Cancel</button>
                  <button onClick={submit} disabled={!msg.trim()} className="flex-1 py-2 rounded-lg text-sm font-bold disabled:opacity-50" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Send</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}