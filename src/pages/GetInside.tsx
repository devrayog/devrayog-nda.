import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../contexts/ThemeContext'
const STATES=['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Other']
export default function GetInside() {
  const navigate=useNavigate(); const {setServiceTheme}=useTheme()
  const [step,setStep]=useState<1|2|3>(1); const [loading,setLoading]=useState(false); const [err,setErr]=useState('')
  const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const [pw2,setPw2]=useState('')
  const [form,setForm]=useState({name:'',username:'',state:'',gender:'male' as any,service:'army' as any,attempt:'1st' as any,target_exam:'',written_cleared:false,ssb_appeared:false,medium:'hindi' as any,challenge:'',study_hours:'3-4'})
  const I="w-full bg-black/30 border rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-500 transition-colors"
  async function create(){ if(pw!==pw2){setErr("Passwords don't match");return}; if(pw.length<8){setErr("Min 8 characters");return}; setLoading(true); setErr('')
    const {data:a,error:ae}=await supabase.auth.signUp({email,password:pw}); if(ae){setErr(ae.message);setLoading(false);return}
    if(a.user){ await supabase.from('profiles').upsert({id:a.user.id,email,...form}); setServiceTheme(form.service,form.gender) }
    setLoading(false); navigate('/dashboard') }
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:'#0B1628'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-5"><div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center font-bebas text-lg" style={{background:'linear-gradient(135deg,#C9A84C,#E8C96A)',color:'#0B1628'}}>DNA</div><h1 className="font-bebas text-2xl text-yellow-400 tracking-wider">CREATE ACCOUNT</h1><p className="text-xs text-gray-400 font-mono">Step {step} of 3</p></div>
        <div className="flex gap-1.5 mb-4">{[1,2,3].map(s=><div key={s} className={`flex-1 h-1 rounded-full transition-all ${s<=step?'bg-gradient-to-r from-yellow-500 to-yellow-300':'bg-white/10'}`}/>)}</div>
        <div className="bg-[#112040] rounded-2xl p-5 border border-yellow-500/10">
          {err&&<p className="text-red-400 text-xs mb-3 bg-red-900/20 px-3 py-2 rounded-lg">{err}</p>}
          {step===1&&(<div className="space-y-3">
            <h2 className="font-bebas text-lg text-yellow-400">BASIC INFO</h2>
            {[{k:'name',l:'Full Name',t:'text',p:'Your name'},{k:'username',l:'Username',t:'text',p:'@username'}].map(f=>(
              <div key={f.k}><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-1">{f.l.toUpperCase()}</label>
              <input type={f.t} value={(form as any)[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} className={I} style={{borderColor:'rgba(201,168,76,0.2)'}}/></div>
            ))}
            <div><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-1">EMAIL</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" className={I} style={{borderColor:'rgba(201,168,76,0.2)'}}/></div>
            <div><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-1">STATE</label>
            <select value={form.state} onChange={e=>setForm(p=>({...p,state:e.target.value}))} className={I} style={{borderColor:'rgba(201,168,76,0.2)',backgroundColor:'#0B1628'}}><option value="">Select</option>{STATES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-1">GENDER</label>
            <div className="grid grid-cols-2 gap-2">{['male','female'].map(g=><button key={g} type="button" onClick={()=>setForm(p=>({...p,gender:g}))} className={`py-2.5 rounded-xl border text-sm capitalize transition-all ${form.gender===g?'border-yellow-500 bg-yellow-500/10 text-yellow-300':'border-yellow-500/20 text-gray-400'}`}>{g==='male'?'🪖 Male':'💗 Female'}</button>)}</div></div>
            <button onClick={()=>{if(!form.name||!email){setErr('Name & email required');return};setErr('');setStep(2)}} className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 text-[#0B1628]">Continue →</button>
          </div>)}
          {step===2&&(<div className="space-y-3">
            <h2 className="font-bebas text-lg text-yellow-400">YOUR JOURNEY</h2>
            <div><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-2">ATTEMPT</label>
            <div className="grid grid-cols-2 gap-2">{[{v:'1st',e:'🎯'},{v:'2nd',e:'🔄'},{v:'3rd',e:'💪'},{v:'4th+',e:'🦾'}].map(a=><button key={a.v} type="button" onClick={()=>setForm(p=>({...p,attempt:a.v}))} className={`py-2.5 rounded-xl border text-sm transition-all ${form.attempt===a.v?'border-yellow-500 bg-yellow-500/10 text-yellow-300':'border-yellow-500/20 text-gray-400'}`}>{a.e} {a.v}</button>)}</div></div>
            <div><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-2">SERVICE</label>
            <div className="grid grid-cols-3 gap-2">{[{v:'army',e:'🪖',l:'Army'},{v:'navy',e:'⚓',l:'Navy'},{v:'airforce',e:'✈️',l:'Air Force'}].map(s=><button key={s.v} type="button" onClick={()=>setForm(p=>({...p,service:s.v}))} className={`py-2.5 rounded-xl border text-xs transition-all ${form.service===s.v?'border-yellow-500 bg-yellow-500/10 text-yellow-300':'border-yellow-500/20 text-gray-400'}`}>{s.e} {s.l}</button>)}</div></div>
            <div><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-2">STUDY MEDIUM</label>
            <div className="grid grid-cols-2 gap-2">{[{v:'hindi',l:'🇮🇳 Hinglish'},{v:'english',l:'🇬🇧 English'}].map(m=><button key={m.v} type="button" onClick={()=>setForm(p=>({...p,medium:m.v}))} className={`py-2.5 rounded-xl border text-sm transition-all ${form.medium===m.v?'border-yellow-500 bg-yellow-500/10 text-yellow-300':'border-yellow-500/20 text-gray-400'}`}>{m.l}</button>)}</div></div>
            <div className="grid grid-cols-3 gap-2">{[{v:'1-2',l:'1-2 hrs'},{v:'3-4',l:'3-4 hrs'},{v:'5+',l:'5+ hrs'}].map(t=><button key={t.v} type="button" onClick={()=>setForm(p=>({...p,study_hours:t.v}))} className={`py-2 rounded-xl border text-xs transition-all ${form.study_hours===t.v?'border-yellow-500 bg-yellow-500/10 text-yellow-300':'border-yellow-500/20 text-gray-400'}`}>{t.l}</button>)}</div>
            <div className="flex gap-2"><button onClick={()=>setStep(1)} className="flex-1 py-2.5 rounded-xl border text-sm text-gray-300" style={{borderColor:'rgba(201,168,76,0.2)'}}>← Back</button><button onClick={()=>setStep(3)} className="flex-1 py-2.5 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 text-[#0B1628] text-sm">Continue →</button></div>
          </div>)}
          {step===3&&(<div className="space-y-3">
            <h2 className="font-bebas text-lg text-yellow-400">SET PASSWORD</h2>
            {[{v:pw,s:setPw,l:'Password',p:'Min 8 characters'},{v:pw2,s:setPw2,l:'Confirm Password',p:'Repeat password'}].map((f,i)=>(
              <div key={i}><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-1">{f.l.toUpperCase()}</label>
              <input type="password" value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} className={I} style={{borderColor:'rgba(201,168,76,0.2)'}}/></div>
            ))}
            <div className="flex gap-2"><button onClick={()=>setStep(2)} className="flex-1 py-2.5 rounded-xl border text-sm text-gray-300" style={{borderColor:'rgba(201,168,76,0.2)'}}>← Back</button>
            <button onClick={create} disabled={loading} className="flex-1 py-2.5 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 text-[#0B1628] text-sm disabled:opacity-50">{loading?'Creating...':'🎖️ Create'}</button></div>
          </div>)}
        </div>
        <p className="text-center text-xs text-gray-500 mt-3">Have account? <Link to="/login" className="text-yellow-400">Login</Link></p>
      </div>
    </div>
  )
}