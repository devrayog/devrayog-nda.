import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
const STATES=['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Other']
const EXAMS=['NDA 2 2026 — Sep 2026','NDA 1 2027 — Apr 2027','NDA 2 2027 — Sep 2027','NDA 1 2028 — Apr 2028','NDA 2 2028 — Sep 2028','NDA 1 2029 — Apr 2029','NDA 2 2029 — Sep 2029','NDA 1 2030 — Apr 2030','NDA 2 2030 — Sep 2030']
export default function Waitlist() {
  const navigate=useNavigate(); const [step,setStep]=useState<1|2|3>(1)
  const [form,setForm]=useState({name:'',email:'',phone:'',whatsapp:'',location:'',state:'',current_attempt:'',target_exam:''})
  const [diagQs,setDiagQs]=useState<any[]>([]); const [answers,setAnswers]=useState<Record<string,string>>({})
  const [current,setCurrent]=useState(0); const [loading,setLoading]=useState(false); const [err,setErr]=useState(''); const [entryId,setEntryId]=useState('')
  useEffect(()=>{ supabase.from('diagnostic_questions').select('id,question,option_a,option_b,option_c,option_d,subject').eq('is_active',true).order('order_index').then(({data})=>setDiagQs(data||[])) },[])
  async function submitForm(e:React.FormEvent){ e.preventDefault(); if(!form.name||!form.email){setErr('Name and email required');return}; setLoading(true); setErr('')
    const {data,error}=await supabase.from('waitlist').insert({...form}).select('id').single(); setLoading(false)
    if(error){setErr(error.message);return}; setEntryId(data.id); diagQs.length>0?setStep(2):setStep(3) }
  async function submitDiag(){ await supabase.from('waitlist').update({diagnostic_answers:answers}).eq('id',entryId); setStep(3) }
  const q=diagQs[current]
  const C="bg-[#0B1628] min-h-screen flex items-center justify-center p-4"
  const INPUT="w-full bg-black/30 border rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-500 transition-colors"
  const CARD="bg-[#112040] rounded-2xl p-6 border border-yellow-500/10 w-full max-w-lg"
  const BTN="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 text-[#0B1628]"
  return (
    <div className={C}><div className="w-full max-w-lg">
      <div className="text-center mb-6"><div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center font-bebas text-lg" style={{background:'linear-gradient(135deg,#C9A84C,#E8C96A)',color:'#0B1628'}}>DNA</div>
        <h1 className="font-bebas text-2xl tracking-widest text-yellow-400">DEVRAYOG NDA AI</h1></div>
      {step===1&&(<div className={CARD}>
        <h2 className="font-bebas text-2xl text-yellow-400 mb-1">JOIN THE WAITLIST</h2>
        <p className="text-gray-400 text-xs mb-4">We'll send credentials within 48-72 hours via WhatsApp/email. 🇮🇳</p>
        {err&&<p className="text-red-400 text-xs mb-3 bg-red-900/20 px-3 py-2 rounded-lg">{err}</p>}
        <form onSubmit={submitForm} className="space-y-3">
          {[{k:'name',l:'Full Name *',p:'Your name',t:'text'},{k:'email',l:'Email *',p:'email@example.com',t:'email'},{k:'phone',l:'Phone',p:'+91 XXXXX',t:'tel'},{k:'whatsapp',l:'WhatsApp',p:'+91 XXXXX',t:'tel'},{k:'location',l:'City',p:'Your city',t:'text'}].map(f=>(
            <div key={f.k}><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-1">{f.l.toUpperCase()}</label>
            <input type={f.t} placeholder={f.p} value={(form as any)[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} className={INPUT}/></div>
          ))}
          <div><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-1">STATE</label>
          <select value={form.state} onChange={e=>setForm(p=>({...p,state:e.target.value}))} className={INPUT} style={{backgroundColor:'#000'}}><option value="">Select</option>{STATES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-1">ATTEMPT</label>
            <select value={form.current_attempt} onChange={e=>setForm(p=>({...p,current_attempt:e.target.value}))} className={INPUT} style={{backgroundColor:'#000'}}><option value="">Select</option>{['1st','2nd','3rd','4th+'].map(a=><option key={a} value={a}>{a}</option>)}</select></div>
            <div><label className="block text-xs font-mono text-yellow-500/70 tracking-widest mb-1">TARGET EXAM</label>
            <select value={form.target_exam} onChange={e=>setForm(p=>({...p,target_exam:e.target.value}))} className={INPUT} style={{backgroundColor:'#000'}}><option value="">Select</option>{EXAMS.map(ex=><option key={ex} value={ex}>{ex}</option>)}</select></div>
          </div>
          <button type="submit" disabled={loading} className={BTN+" disabled:opacity-50"}>{loading?'Submitting...':(diagQs.length>0?'Continue to Test →':'🎖️ JOIN WAITLIST')}</button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-3">Have access? <Link to="/login" className="text-yellow-400">Login</Link></p>
      </div>)}
      {step===2&&q&&(<div className={CARD}>
        <div className="flex justify-between mb-3"><h2 className="font-bebas text-xl text-yellow-400">QUICK ASSESSMENT</h2><span className="font-mono text-xs text-gray-400">{current+1}/{diagQs.length}</span></div>
        <div className="w-full bg-black/30 rounded-full h-1 mb-4"><div className="h-1 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all" style={{width:`${((current+1)/diagQs.length)*100}%`}}/></div>
        <p className="text-xs font-mono text-yellow-500/60 uppercase mb-1">{q.subject}</p>
        <p className="text-white mb-3 leading-relaxed">{q.question}</p>
        <div className="space-y-2 mb-4">{(['a','b','c','d'] as const).map(o=>(
          <button key={o} onClick={()=>setAnswers(p=>({...p,[q.id]:o}))} className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${answers[q.id]===o?'border-yellow-500 bg-yellow-500/10 text-yellow-300':'border-white/10 text-gray-300 hover:border-yellow-500/30'}`}>
            <span className="font-mono text-gray-500 mr-1">{o.toUpperCase()}.</span>{(q as any)[`option_${o}`]}
          </button>
        ))}</div>
        <div className="flex gap-2">
          {current>0&&<button onClick={()=>setCurrent(p=>p-1)} className="flex-1 py-2.5 rounded-xl border text-sm text-gray-300" style={{borderColor:'rgba(201,168,76,0.2)'}}>← Back</button>}
          <button onClick={()=>{ if(current<diagQs.length-1) setCurrent(p=>p+1); else submitDiag() }} className={`flex-1 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-yellow-500 to-yellow-300 text-[#0B1628]`}>
            {current<diagQs.length-1?'Next →':'Submit ✓'}
          </button>
        </div>
      </div>)}
      {step===3&&(<div className={CARD+" text-center"}>
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl" style={{background:'linear-gradient(135deg,#C9A84C,#E8C96A)'}}>🎖️</div>
        <h2 className="font-bebas text-3xl text-yellow-400 mb-2">YOU'RE ON THE LIST!</h2>
        <p className="text-gray-300 text-sm mb-4">Within <span className="text-white font-medium">48-72 hours</span>, you'll receive login credentials via WhatsApp or email. Jai Hind! 🇮🇳</p>
        <button onClick={()=>navigate('/')} className={BTN}>Back to Home</button>
      </div>)}
    </div></div>
  )
}