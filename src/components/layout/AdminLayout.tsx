import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
const NAV=['/admin','/admin/waitlist','/admin/users','/admin/topics','/admin/current-affairs','/admin/pyq','/admin/mock-tests','/admin/diagnostic','/admin/ssb','/admin/oir','/admin/formulas','/admin/vocabulary','/admin/daily-tasks','/admin/success-stories','/admin/mentors','/admin/resources','/admin/faq','/admin/announcements','/admin/broadcast','/admin/feedback','/admin/reports','/admin/blogs','/admin/girls-nda','/admin/personality','/admin/screenout','/admin/fitness','/admin/medical','/admin/guide','/admin/premium-settings','/admin/page-toggles','/admin/countdown','/admin/seo','/admin/ai','/admin/settings']
const LABELS: Record<string,string> = {'/admin':'📊 Dashboard','/admin/waitlist':'📋 Waitlist','/admin/users':'👥 Users','/admin/topics':'📚 Topics & MCQs','/admin/current-affairs':'📰 Current Affairs','/admin/pyq':'📄 PYQ','/admin/mock-tests':'📝 Mock Tests','/admin/diagnostic':'🧪 Diagnostic Qs','/admin/ssb':'🛡️ SSB Sets','/admin/oir':'🧠 OIR Questions','/admin/formulas':'🔢 Formulas','/admin/vocabulary':'💬 Vocabulary','/admin/daily-tasks':'✅ Daily Tasks','/admin/success-stories':'⭐ Success Stories','/admin/mentors':'🎓 Mentors','/admin/resources':'📦 Resources','/admin/faq':'❓ FAQ','/admin/announcements':'📢 Announcements','/admin/broadcast':'📡 Broadcast','/admin/feedback':'💬 Feedback','/admin/reports':'🚨 Reports','/admin/blogs':'✍️ Blogs','/admin/girls-nda':'💗 Girls NDA','/admin/personality':'💡 Personality','/admin/screenout':'🔍 Screenout','/admin/fitness':'💪 Fitness','/admin/medical':'🏥 Medical','/admin/guide':'📖 Guide','/admin/premium-settings':'👑 Premium','/admin/page-toggles':'🔀 Page Toggles','/admin/countdown':'⏱️ Countdown','/admin/seo':'🔍 SEO','/admin/ai':'🤖 Admin AI','/admin/settings':'⚙️ Settings'}
export default function AdminLayout() {
  const { signOut } = useAuth(); const navigate = useNavigate()
  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <aside className="w-52 flex flex-col bg-gray-900 border-r border-gray-800 overflow-y-auto shrink-0">
        <div className="px-4 py-3 border-b border-gray-800"><div className="font-bebas text-base tracking-widest text-yellow-400">ADMIN PANEL</div><div className="text-xs text-gray-500">Devrayog NDA AI</div></div>
        <nav className="flex-1 py-2 px-2 space-y-0.5">
          {NAV.map(to=>(
            <NavLink key={to} to={to} end={to==='/admin'}
              className={({isActive})=>`flex items-center px-3 py-1.5 rounded-lg text-xs transition-all ${isActive?'bg-yellow-400 text-gray-900 font-bold':'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              {LABELS[to]||to}
            </NavLink>
          ))}
          <button onClick={signOut} className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-900/20 mt-2">🚪 Sign Out</button>
        </nav>
        <div className="px-4 py-3 border-t border-gray-800"><button onClick={()=>navigate('/dashboard')} className="text-xs text-gray-500 hover:text-white">← Back to App</button></div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-950"><Outlet/></main>
    </div>
  )
}