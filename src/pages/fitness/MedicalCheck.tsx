import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import PageHeader from '../../components/ui/PageHeader'
export default function MedicalCheck() {
  const { theme }=useTheme()
  const [form,setForm]=useState({gender:'male',height:'',weight:'',vision:'6/6',lenses:'none'}); const [result,setResult]=useState<any>(null)
  function check(){
    const h=parseFloat(form.height)||0, w=parseFloat(form.weight)||0
    const minH=form.gender==='female'?152:157; const hOk=h>=minH
    const bmi=h>0?w/((h/100)**2):0; const bmiOk=bmi>=18.5&&bmi<=24.9
    const vOk=form.vision!=='Worse than 6/18'; const lOk=form.lenses!=='high'
    setResult({eligible:hOk&&bmiOk&&vOk&&lOk,items:[{l:'Height',ok:hOk,v:`${h}cm (min ${minH}cm)`},{l:'BMI',ok:bmiOk,v:`${bmi.toFixed(1)} (18.5–24.9)`},{l:'Vision',ok:vOk,v:form.vision},{l:'Lenses',ok:lOk,v:form.lenses}]})
  }
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <PageHeader title="AM I MEDICALLY FIT?" subtitle="Complete medical eligibility check for NDA." icon="🔬" page="Medical Check" image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"/>
      <div className="rounded-xl p-5 mb-5 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div><label className="block text-xs font-mono text-gray-400 mb-1">GENDER</label><select value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))} className="w-full bg-black/30 border rounded-xl px-3 py-2 text-sm text-white outline-none" style={{borderColor:theme.border,backgroundColor:'#0B1628'}}><option value="male">Male</option><option value="female">Female</option></select></div>
          {[{k:'height',l:'Height (cm)',p:'170'},{k:'weight',l:'Weight (kg)',p:'65'}].map(f=>(
            <div key={f.k}><label className="block text-xs font-mono text-gray-400 mb-1">{f.l.toUpperCase()}</label><input type="number" value={(form as any)[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} className="w-full bg-black/30 border rounded-xl px-3 py-2 text-sm text-white outline-none" style={{borderColor:theme.border}}/></div>
          ))}
          <div><label className="block text-xs font-mono text-gray-400 mb-1">EYESIGHT (BETTER EYE)</label><select value={form.vision} onChange={e=>setForm(p=>({...p,vision:e.target.value}))} className="w-full bg-black/30 border rounded-xl px-3 py-2 text-sm text-white outline-none" style={{borderColor:theme.border,backgroundColor:'#0B1628'}}>
            {['6/6 (Perfect)','6/9','6/12','6/18','Worse than 6/18'].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
          <div><label className="block text-xs font-mono text-gray-400 mb-1">CORRECTIVE LENSES</label><select value={form.lenses} onChange={e=>setForm(p=>({...p,lenses:e.target.value}))} className="w-full bg-black/30 border rounded-xl px-3 py-2 text-sm text-white outline-none" style={{borderColor:theme.border,backgroundColor:'#0B1628'}}>
            {[{v:'none',l:'No glasses'},{v:'mild',l:'Mild (up to ±3.5)'},{v:'high',l:'High (above ±3.5)'},{v:'lasik',l:'Had LASIK'}].map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>
        </div>
        <button onClick={check} className="w-full py-3 rounded-xl font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>CHECK MY ELIGIBILITY →</button>
      </div>
      {result&&<div>
        <div className={`rounded-xl p-4 mb-4 text-center border ${result.eligible?'border-green-500/30 bg-green-900/10':'border-red-500/30 bg-red-900/10'}`}><p className="font-bebas text-2xl">{result.eligible?'✅ LIKELY ELIGIBLE':'⚠️ SOME CONCERNS'}</p><p className="text-xs text-gray-400 mt-1">{result.eligible?'Consult a doctor for official confirmation.':'Review flagged areas and consult a doctor.'}</p></div>
        {result.items.map((item:any,i:number)=>(
          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl border mb-2" style={{background:theme.bgMid,borderColor:item.ok?'rgba(74,201,122,0.2)':'rgba(201,74,74,0.2)'}}><div><p className="text-sm font-medium text-white">{item.l}</p><p className="text-xs text-gray-400">{item.v}</p></div><span className={item.ok?'text-green-400':'text-red-400'}>{item.ok?'✓ OK':'✗ Check'}</span></div>
        ))}
        <p className="text-xs text-gray-500 text-center mt-2">Reference only. Consult a registered doctor for official assessment.</p>
      </div>}
    </div>
  )
}