import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import PageHeader from '../../components/ui/PageHeader'
export default function FitnessEligibility() {
  const { theme }=useTheme()
  const [form,setForm]=useState({run:'',pushups:'',pullups:'',situps:''}); const [result,setResult]=useState<any>(null)
  function check(){
    const run=parseFloat(form.run)||999,pu=parseInt(form.pushups)||0,pl=parseInt(form.pullups)||0,su=parseInt(form.situps)||0
    setResult({run:{val:run,pass:run<=450,status:run<360?'Excellent':run<390?'Very Good':run<420?'Good':run<450?'Average':'Below Standard'},
      pushups:{val:pu,pass:pu>=20,status:pu>=40?'Excellent':pu>=30?'Good':pu>=20?'Pass':'Below Standard'},
      pullups:{val:pl,pass:pl>=8,status:pl>=12?'Excellent':pl>=10?'Good':pl>=8?'Pass':'Below Standard'},
      situps:{val:su,pass:su>=30,status:su>=50?'Excellent':su>=40?'Good':su>=30?'Pass':'Below Standard'}})
  }
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <PageHeader title="AM I PHYSICALLY FIT?" subtitle="Check NDA fitness standards." icon="✅" page="Fitness Check" image="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"/>
      <div className="rounded-xl p-5 mb-5 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <div className="grid grid-cols-2 gap-3 mb-4">{[{k:'run',l:'1.6km Run (seconds)',p:'450'},{k:'pushups',l:'Push-ups',p:'25'},{k:'pullups',l:'Pull-ups',p:'10'},{k:'situps',l:'Sit-ups (2 min)',p:'35'}].map(f=>(
          <div key={f.k}><label className="block text-xs font-mono text-gray-400 mb-1">{f.l}</label><input type="number" value={(form as any)[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} className="w-full bg-black/30 border rounded-xl px-3 py-2 text-sm text-white outline-none" style={{borderColor:theme.border}}/></div>
        ))}</div>
        <button onClick={check} className="w-full py-3 rounded-xl font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>CHECK MY FITNESS LEVEL →</button>
      </div>
      {result&&<div className="space-y-2 mb-5">{Object.entries(result).map(([key,val]:any)=>(
        <div key={key} className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{background:theme.bgMid,borderColor:val.pass?'rgba(74,201,122,0.3)':'rgba(201,74,74,0.3)'}}>
          <div><p className="font-bebas tracking-wide text-white capitalize">{key.replace('run','1.6km Run')}</p><p className="text-xs text-gray-400">{val.status}</p></div>
          <span className={val.pass?'text-green-400':'text-red-400'}>{val.pass?'✓ Pass':'✗ Improve'}</span>
        </div>
      ))}</div>}
    </div>
  )
}