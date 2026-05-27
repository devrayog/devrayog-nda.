import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import PageHeader from '../../components/ui/PageHeader'
const ITEMS=[{to:'/ssb/oir',icon:'🧠',t:'OIR Practice',d:'Officer Intelligence Rating'},{to:'/ssb/ppdt',icon:'🖼️',t:'PPDT',d:'Picture Perception & Discussion'},{to:'/ssb/tat',icon:'🎭',t:'TAT',d:'Thematic Apperception Test — 12 photos'},{to:'/ssb/wat',icon:'💭',t:'WAT',d:'Word Association Test — 60 words'},{to:'/ssb/srt',icon:'⚡',t:'SRT',d:'Situation Reaction Test — 60 situations'},{to:'/ssb/sdt',icon:'✍️',t:'SDT',d:'Self Description Test — 5 questions'},{to:'/ssb/gd',icon:'👥',t:'Group Discussion',d:'Practice GD — Coming Soon'},{to:'/ssb/interview',icon:'🎤',t:'Interview',d:'Personal Interview — Coming Soon'},{to:'/ssb/personality',icon:'💡',t:'Personality Tips',d:'OLQs and body language'},{to:'/ssb/screenout',icon:'🔍',t:'Screen-out Analysis',d:'Why candidates fail SSB'}]
export default function SSBOverview() {
  const { theme } = useTheme(); const navigate = useNavigate()
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageHeader title="SSB PREP" subtitle="Complete SSB preparation — interactive practice for every stage." icon="🛡️" page="SSB Overview" image="https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800"/>
      <div className="grid md:grid-cols-2 gap-3">
        {ITEMS.map(item=>(
          <button key={item.to} onClick={()=>navigate(item.to)} className="flex items-center gap-3 p-4 rounded-xl border text-left hover:border-yellow-500/40 transition-all group" style={{background:theme.bgMid,borderColor:theme.border}}>
            <span className="text-3xl">{item.icon}</span>
            <div><p className="font-bebas tracking-wide text-white group-hover:text-yellow-300 transition-colors">{item.t}</p><p className="text-xs text-gray-400">{item.d}</p></div>
          </button>
        ))}
      </div>
    </div>
  )
}