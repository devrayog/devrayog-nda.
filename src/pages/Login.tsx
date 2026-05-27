import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
export default function Login() {
  const navigate=useNavigate(); const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const [loading,setLoading]=useState(false); const [err,setErr]=useState('')
  async function login(e:React.FormEvent){ e.preventDefault(); setErr(''); setLoading(true)
    const {data,error}=await supabase.auth.signInWithPassword({email,password:pw}); setLoading(false)
    if(error){setErr(error.message);return}
    const {data:p}=await supabase.from('profiles').select('is_admin').eq('id',data.user.id).single()
    navigate(p?.is_admin?'/admin':'/dashboard') }
  const I="w-full bg-black/30 border rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-500 transition-colors"
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:'#0B1628'}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6"><div className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center font-bebas text-xl" style={{background:'linear-gradient(135deg,#C9A84C,#E8C96A)',color:'#0B1628'}}>DNA</div>
          <h1 className="font-bebas text-2xl tracking-wider text-yellow-400">WELCOME BACK</h1></div>
        <div className="bg-[#112040] rounded-2xl p-6 border border-yellow-500/10">
          {err&&<p className="text-red-400 text-xs mb-3 bg-red-900/20 px-3 py-2 rounded-lg">{err}</p>}
          <form onSubmit={login} className="space-y-3">
            <div><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-1">EMAIL</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required className={I} style={{borderColor:'rgba(201,168,76,0.2)'}}/></div>
            <div><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-1">PASSWORD</label><input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" required className={I} style={{borderColor:'rgba(201,168,76,0.2)'}}/></div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 text-[#0B1628] disabled:opacity-50">{loading?'Logging in...':'🎖️ LOGIN'}</button>
          </form>
          <div className="flex justify-between mt-3 text-xs"><Link to="/forgot-password" className="text-yellow-400/70 hover:text-yellow-400">Forgot password?</Link><Link to="/signup" className="text-yellow-400/70 hover:text-yellow-400">Join waitlist</Link></div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">Have invite link? <Link to="/get-inside" className="text-yellow-400">/get-inside</Link></p>
      </div>
    </div>
  )
}