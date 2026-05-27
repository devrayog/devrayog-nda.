import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import { Menu, X, Sun, Moon, Bell, LogOut, ChevronDown, ChevronRight, Shield } from 'lucide-react'

const NAV = [
  { s:'MAIN', items:[{to:'/dashboard',l:'🏠 Dashboard'},{to:'/ai-tutor',l:'🤖 AI Tutor'},{to:'/notifications',l:'🔔 Notifications'},{to:'/achievements',l:'🏆 Achievements'},{to:'/activity',l:'📊 Activity Log'},{to:'/dna-score',l:'🧬 DNA Score'},{to:'/premium',l:'👑 Premium'},{to:'/install',l:'📲 Install App'}] },
  { s:'STUDY', c:true, items:[{to:'/study-plan',l:'📅 Study Plan'},{to:'/study/maths',l:'📐 Maths Hub'},{to:'/study/gat',l:'🌍 GAT/GK Hub'},{to:'/study/english',l:'📖 English Hub'},{to:'/current-affairs',l:'📰 Current Affairs'},{to:'/pyq',l:'📋 PYQ Papers'},{to:'/notes',l:'📝 Notes'},{to:'/bookmarks',l:'🔖 Bookmarks'},{to:'/revision',l:'🔄 Revision'},{to:'/formulas',l:'🔢 Formulas'},{to:'/vocabulary',l:'💬 Vocabulary'}] },
  { s:'TESTS', c:true, items:[{to:'/tests',l:'📝 Mock Tests'},{to:'/daily-challenge',l:'⚡ Daily Challenge'},{to:'/question-bank',l:'🗃️ Question Bank'},{to:'/error-log',l:'❌ Error Log'}] },
  { s:'SSB PREP', c:true, items:[{to:'/ssb',l:'🛡️ SSB Overview'},{to:'/ssb/oir',l:'🧠 OIR Practice'},{to:'/ssb/ppdt',l:'🖼️ PPDT'},{to:'/ssb/tat',l:'🎭 TAT'},{to:'/ssb/wat',l:'💭 WAT'},{to:'/ssb/srt',l:'⚡ SRT'},{to:'/ssb/sdt',l:'✍️ SDT'},{to:'/ssb/gd',l:'👥 Group Discussion'},{to:'/ssb/interview',l:'🎤 Interview'},{to:'/ssb/personality',l:'💡 Personality Tips'},{to:'/ssb/screenout',l:'🔍 Screen-out Analysis'}] },
  { s:'COMMUNITY', c:true, items:[{to:'/community',l:'👥 Community'},{to:'/community/chat',l:'💬 Live Chat'},{to:'/leaderboard',l:'🏅 Leaderboard'},{to:'/mentors',l:'🎓 Mentors'},{to:'/study-partners',l:'🤝 Study Partners'},{to:'/success-stories',l:'⭐ Success Stories'}] },
  { s:'FITNESS', c:true, items:[{to:'/fitness',l:'💪 Fitness Plan'},{to:'/fitness/running',l:'🏃 Running Tracker'},{to:'/fitness/eligibility',l:'✅ Am I Fit?'},{to:'/fitness/medical',l:'🏥 Medical Standards'},{to:'/fitness/medical-check',l:'🔬 Medical Check'}] },
  { s:'RESOURCES', c:true, items:[{to:'/resources',l:'📦 Resources'},{to:'/resources/books',l:'📚 Books'},{to:'/resources/videos',l:'🎥 Videos'},{to:'/resources/downloads',l:'⬇️ Downloads'},{to:'/faq',l:'❓ FAQ'}] },
]

export default function Layout() {
  const { profile, signOut, isAdmin } = useAuth()
  const { isDark, toggleDark, lang, setLang, theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [col, setCol] = useState<Record<string,boolean>>({'SSB PREP':true,'COMMUNITY':true,'FITNESS':true,'RESOURCES':true})
  const [ann, setAnn] = useState<any>(null); const [showAnn, setShowAnn] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    const seen = localStorage.getItem('dna_ann_seen')
    if(seen !== new Date().toDateString()){
      supabase.from('announcements').select('*').eq('is_active',true).order('created_at',{ascending:false}).limit(1).single().then(({data})=>{ if(data){setAnn(data);setShowAnn(true)} })
    }
  },[])

  function dismissAnn(){ setShowAnn(false); localStorage.setItem('dna_ann_seen',new Date().toDateString()) }

  return (
    <div className="flex h-screen overflow-hidden" style={{background:theme.bg}}>
      {showAnn&&ann&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="rounded-xl p-6 max-w-md w-full relative" style={{background:theme.bgMid,border:`1px solid ${theme.border}`}}>
            <button onClick={dismissAnn} className="absolute top-3 right-3 text-gray-400"><X size={18}/></button>
            {ann.image_url&&<img src={ann.image_url} className="w-full rounded-lg mb-3 max-h-48 object-cover" alt=""/>}
            {ann.title&&<h3 className="font-bebas text-xl mb-1" style={{color:theme.accent}}>{ann.title}</h3>}
            {ann.message&&<p className="text-gray-300 text-sm">{ann.message}</p>}
            <button onClick={dismissAnn} className="w-full py-2 rounded-xl font-bold text-sm mt-4" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Got it 🎖️</button>
          </div>
        </div>
      )}
      {open&&<div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={()=>setOpen(false)}/>}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-56 flex flex-col transition-transform duration-300 ${open?'translate-x-0':'-translate-x-full lg:translate-x-0'}`} style={{background:theme.bgMid,borderRight:`1px solid ${theme.border}`}}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{borderColor:theme.border}}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bebas text-sm" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>DNA</div>
          <div><div className="font-bebas text-sm tracking-widest" style={{color:theme.accent}}>DEVRAYOG NDA AI</div><div className="font-mono text-[8px] opacity-50" style={{color:theme.accent}}>NDA IN DNA</div></div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {NAV.map(sec=>(
            <div key={sec.s}>
              {sec.c?(
                <button onClick={()=>setCol(p=>({...p,[sec.s]:!p[sec.s]}))} className="w-full flex items-center justify-between px-2 py-1 text-[9px] font-mono tracking-widest text-gray-500 hover:text-gray-300">
                  {sec.s}{col[sec.s]?<ChevronRight size={9}/>:<ChevronDown size={9}/>}
                </button>
              ):<div className="px-2 py-1 text-[9px] font-mono tracking-widest text-gray-500">{sec.s}</div>}
              {!col[sec.s]&&sec.items.map(item=>(
                <NavLink key={item.to} to={item.to} onClick={()=>setOpen(false)}
                  className={({isActive})=>`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive?'font-bold':'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  style={({isActive})=>isActive?{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}:{}}>
                  {item.l}
                </NavLink>
              ))}
            </div>
          ))}
          <div className="border-t pt-2 mt-1" style={{borderColor:theme.border}}>
            {[{to:'/profile',l:'👤 Profile'},{to:'/settings',l:'⚙️ Settings'},{to:'/faq',l:'💬 Feedback'},{to:'/blogs',l:'✍️ Blogs'},{to:'/contact',l:'📞 Contact'},
              ...(profile?.gender==='female'?[{to:'/girls',l:'💗 Girls NDA'}]:[])
            ].map(item=>(
              <NavLink key={item.to} to={item.to} onClick={()=>setOpen(false)}
                className={({isActive})=>`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive?'font-bold':'text-gray-400 hover:text-white hover:bg-white/5'}`}
                style={({isActive})=>isActive?{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}:{}}>
                {item.l}
              </NavLink>
            ))}
            {isAdmin&&<NavLink to="/admin" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-yellow-400 hover:bg-yellow-900/20"><Shield size={11}/>Admin Panel</NavLink>}
            <button onClick={signOut} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-900/20 w-full"><LogOut size={11}/>Sign Out</button>
          </div>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-2 px-4 py-2.5 border-b shrink-0" style={{background:theme.bgMid+'ee',borderColor:theme.border,backdropFilter:'blur(20px)'}}>
          <button className="lg:hidden" onClick={()=>setOpen(true)}><Menu size={18} className="text-gray-400"/></button>
          <div className="flex-1"/>
          <button onClick={toggleDark} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400">{isDark?<Sun size={14}/>:<Moon size={14}/>}</button>
          <button onClick={()=>setLang(lang==='hindi'?'english':'hindi')} className="px-2 py-1 rounded text-[10px] font-mono text-gray-400 hover:bg-white/5">{lang==='hindi'?'हिंदी':'EN'}</button>
          {!profile?.is_premium&&<button onClick={()=>navigate('/premium')} className="text-[10px] font-mono px-2 py-1 rounded" style={{background:`${theme.accent}20`,color:theme.accent,border:`1px solid ${theme.accent}40`}}>👑 Premium</button>}
          <button onClick={()=>navigate('/notifications')} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400"><Bell size={14}/></button>
          <button onClick={()=>navigate('/profile')} className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center font-bebas text-xs shrink-0" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>
            {profile?.avatar_url?<img src={profile.avatar_url} className="w-full h-full object-cover" alt=""/>:(profile?.name?.[0]?.toUpperCase()||'D')}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet/></main>
      </div>
    </div>
  )
}