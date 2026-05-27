import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import PageHeader from '../../components/ui/PageHeader'
export default function Fitness() {
  const { theme }=useTheme(); const navigate=useNavigate()
  const items=[{to:'/fitness/running',e:'🏃',t:'Running Tracker',d:'Log runs and track pace'},{to:'/fitness/eligibility',e:'💪',t:'Am I Physically Fit?',d:'Check NDA fitness standards'},{to:'/fitness/medical',e:'🏥',t:'Medical Standards',d:'Height, weight, vision requirements'},{to:'/fitness/medical-check',e:'🔬',t:'Am I Medically Fit?',d:'Full medical eligibility check'}]
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="FITNESS" subtitle="Track runs and check NDA physical and medical standards." icon="💪" page="Fitness" image="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"/>
      <div className="grid md:grid-cols-2 gap-4">{items.map(item=>(
        <button key={item.to} onClick={()=>navigate(item.to)} className="flex items-center gap-4 p-5 rounded-xl border text-left hover:border-yellow-500/40 transition-all group" style={{background:theme.bgMid,borderColor:theme.border}}><span className="text-4xl">{item.e}</span><div><p className="font-bebas text-lg tracking-wide text-white group-hover:text-yellow-300 transition-colors">{item.t}</p><p className="text-xs text-gray-400">{item.d}</p></div></button>
      ))}</div>
    </div>
  )
}