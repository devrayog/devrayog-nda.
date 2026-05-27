import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/ui/PageHeader'
export default function Tests() {
  const { theme } = useTheme(); const navigate = useNavigate()
  const [tests, setTests] = useState<any[]>([]); const [tab, setTab] = useState<'nda'|'ai'|'admin'>('nda')
  useEffect(()=>{ supabase.from('mock_tests').select('*').eq('is_active',true).order('created_at',{ascending:false}).then(({data})=>setTests(data||[])) },[])
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageHeader title="MOCK TESTS" subtitle="Practice exactly like the real NDA exam." icon="📝" page="Mock Tests" image="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800"/>
      <div className="flex gap-2 mb-5">{[{k:'nda',l:'NDA Standard'},{k:'ai',l:'🤖 AI Generated'},{k:'admin',l:'📋 Admin Sets'}].map(t=>(
        <button key={t.k} onClick={()=>setTab(t.k as any)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab===t.k?'text-[#0B1628] font-bold':'text-gray-400 border'}`} style={tab===t.k?{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`}:{borderColor:theme.border}}>{t.l}</button>
      ))}</div>
      {tab==='nda'&&<div className="grid md:grid-cols-2 gap-4">{[
        {type:'paper1_maths',title:'Paper 1 — Mathematics',desc:'120 Questions · 2.5 hrs · 2.5 marks correct · -0.83 negative',img:'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'},
        {type:'paper2_gat',title:'Paper 2 — GAT',desc:'150 Questions · 2.5 hrs · 4 marks correct · -1.33 negative',img:'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400'}
      ].map(p=>(
        <div key={p.type} className="rounded-xl overflow-hidden border" style={{borderColor:theme.border}}>
          <img src={p.img} className="w-full h-28 object-cover" alt=""/>
          <div className="p-4" style={{background:theme.bgMid}}><h3 className="font-bebas text-base tracking-wide text-white mb-1">{p.title}</h3><p className="text-xs text-gray-400 mb-3">{p.desc}</p>
          <button onClick={()=>navigate(`/tests/take/new?type=${p.type}`)} className="w-full py-2.5 rounded-xl text-sm font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start Test</button></div>
        </div>
      ))}</div>}
      {tab==='ai'&&<div className="text-center py-10"><img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200" className="w-24 h-24 rounded-full mx-auto mb-3 opacity-60 object-cover" alt=""/><p className="font-bebas text-xl mb-2" style={{color:theme.accent}}>AI MOCK TEST</p><p className="text-gray-400 text-sm mb-4">AI creates a personalized test from your weak areas.</p><button onClick={()=>navigate('/tests/take/new?type=ai')} className="px-6 py-3 rounded-xl font-bold text-sm" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Generate AI Test</button></div>}
      {tab==='admin'&&<div className="space-y-2">{tests.length===0?<div className="text-center py-10 text-gray-400">No admin tests added yet.</div>:tests.map(t=>(
        <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div><p className="font-bebas tracking-wide text-white">{t.title}</p>{t.description&&<p className="text-xs text-gray-400">{t.description}</p>}</div>
          <button onClick={()=>navigate(`/tests/take/${t.id}`)} className="px-4 py-2 rounded-xl text-xs font-bold" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>Start</button>
        </div>
      ))}</div>}
    </div>
  )
}