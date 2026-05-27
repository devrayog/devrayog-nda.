import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
import { ChevronDown } from 'lucide-react'
export default function FAQ() {
  const { theme }=useTheme(); const [faqs,setFaqs]=useState<any[]>([]); const [open,setOpen]=useState<string|null>(null)
  const [fb,setFb]=useState({msg:'',rating:0,name:'',email:''}); const [sending,setSending]=useState(false); const [sent,setSent]=useState(false)
  useEffect(()=>{ supabase.from('faqs').select('*').eq('is_active',true).order('order_index').then(({data})=>setFaqs(data||[])) },[])
  async function send(e:React.FormEvent){ e.preventDefault(); setSending(true); await supabase.from('feedback').insert({name:fb.name,email:fb.email,message:fb.msg,rating:fb.rating,is_public_guest:true}); setSending(false); setSent(true) }
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="FAQ" subtitle="Common NDA questions answered." icon="❓" page="FAQ" image="https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=800"/>
      <div className="space-y-2 mb-8">{faqs.map(f=>(
        <div key={f.id} className="rounded-xl border overflow-hidden" style={{borderColor:theme.border}}>
          <button onClick={()=>setOpen(open===f.id?null:f.id)} className="w-full flex items-center justify-between px-4 py-3 text-left" style={{background:theme.bgMid}}><span className="text-sm font-medium text-white">{f.question}</span><ChevronDown size={14} className={`text-gray-400 transition-transform ${open===f.id?'rotate-180':''}`}/></button>
          {open===f.id&&<div className="px-4 py-3 text-sm text-gray-300 leading-relaxed" style={{background:theme.bg}}>{f.answer}</div>}
        </div>
      ))}</div>
      <div className="rounded-xl p-5 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <h3 className="font-bebas text-xl mb-3" style={{color:theme.accent}}>SEND FEEDBACK</h3>
        {sent?<p className="text-green-400 text-sm">Thank you for your feedback!</p>:(
          <form onSubmit={send} className="space-y-3">
            <div className="flex gap-1">{[1,2,3,4,5].map(r=><button key={r} type="button" onClick={()=>setFb(p=>({...p,rating:r}))} className={`text-2xl transition-transform hover:scale-110 ${fb.rating>=r?'text-yellow-400':'text-gray-600'}`}>★</button>)}</div>
            <input type="text" value={fb.name} onChange={e=>setFb(p=>({...p,name:e.target.value}))} placeholder="Your name" className="w-full bg-black/30 border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none" style={{borderColor:theme.border}}/>
            <input type="email" value={fb.email} onChange={e=>setFb(p=>({...p,email:e.target.value}))} placeholder="your@email.com" className="w-full bg-black/30 border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none" style={{borderColor:theme.border}}/>
            <textarea value={fb.msg} onChange={e=>setFb(p=>({...p,msg:e.target.value}))} placeholder="Your message..." rows={3} required className="w-full bg-black/30 border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none resize-none" style={{borderColor:theme.border}}/>
            <button type="submit" disabled={sending} className="w-full py-2.5 rounded-xl font-bold text-sm disabled:opacity-50" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>{sending?'Sending...':'Send Feedback'}</button>
          </form>
        )}
      </div>
    </div>
  )
}