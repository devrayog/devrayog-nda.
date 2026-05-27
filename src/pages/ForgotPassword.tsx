import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
export default function ForgotPassword() {
  const [email,setEmail]=useState(''); const [done,setDone]=useState(false); const [loading,setLoading]=useState(false)
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:'#0B1628'}}>
      <div className="w-full max-w-sm bg-[#112040] rounded-2xl p-6 border border-yellow-500/10">
        <h1 className="font-bebas text-2xl text-yellow-400 mb-4">RESET PASSWORD</h1>
        {done?<p className="text-green-400 text-sm">Check your email for reset link.</p>:(
          <form onSubmit={async(e)=>{e.preventDefault();setLoading(true);await supabase.auth.resetPasswordForEmail(email);setLoading(false);setDone(true)}} className="space-y-3">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required className="w-full bg-black/30 border border-yellow-500/20 focus:border-yellow-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none"/>
            <button disabled={loading} className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 text-[#0B1628] text-sm">{loading?'Sending...':'Send Reset Link'}</button>
          </form>
        )}
        <p className="mt-3 text-xs text-center"><Link to="/login" className="text-yellow-400">← Back to Login</Link></p>
      </div>
    </div>
  )
}