import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/ui/PageHeader'
const CATS=['All','National','International','Defence','Science','Sports','Economy','Polity']
const CC:Record<string,string>={national:'bg-blue-900/40 text-blue-300',international:'bg-purple-900/40 text-purple-300',defence:'bg-green-900/40 text-green-300',science:'bg-cyan-900/40 text-cyan-300',sports:'bg-yellow-900/40 text-yellow-300',economy:'bg-orange-900/40 text-orange-300',polity:'bg-red-900/40 text-red-300'}
export default function CurrentAffairs() {
  const { theme }=useTheme(); const navigate=useNavigate()
  const [articles,setArticles]=useState<any[]>([]); const [featured,setFeatured]=useState<any[]>([]); const [cat,setCat]=useState('All')
  useEffect(()=>{ supabase.from('current_affairs').select('*').eq('is_active',true).eq('is_featured',true).order('published_at',{ascending:false}).limit(3).then(({data})=>setFeatured(data||[])) },[])
  useEffect(()=>{
    let q=supabase.from('current_affairs').select('*').eq('is_active',true).order('published_at',{ascending:false}).limit(30)
    if(cat!=='All') q=q.ilike('category',cat.toLowerCase())
    q.then(({data})=>setArticles(data||[]))
  },[cat])
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageHeader title="CURRENT AFFAIRS" subtitle={`${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}`} icon="📰" page="Current Affairs" image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"/>
      {featured.length>0&&<div className="grid md:grid-cols-2 gap-3 mb-5">{featured.map(a=>(
        <button key={a.id} onClick={()=>navigate(`/current-affairs/${a.slug||a.id}`)} className="relative rounded-xl overflow-hidden h-28 text-left group hover:scale-[1.02] transition-transform">
          {a.image_url&&<img src={a.image_url} className="absolute inset-0 w-full h-full object-cover" alt=""/>}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"/>
          <div className="absolute inset-0 p-3 flex flex-col justify-between">
            <div className="flex gap-1"><span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">⭐ FEATURED</span><span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full capitalize ${CC[a.category]||'bg-gray-800 text-gray-400'}`}>{a.category}</span></div>
            <p className="font-bebas text-sm text-white leading-tight">{a.title}</p>
          </div>
        </button>
      ))}</div>}
      <div className="flex gap-2 flex-wrap mb-4">{CATS.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${cat===c?'text-[#0B1628] font-bold':'text-gray-400 border'}`} style={cat===c?{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`}:{borderColor:theme.border}}>{c}</button>)}</div>
      <div className="space-y-2">{articles.length===0?<p className="text-center text-gray-400 py-8">No articles yet.</p>:articles.map(a=>(
        <button key={a.id} onClick={()=>navigate(`/current-affairs/${a.slug||a.id}`)} className="w-full text-left px-4 py-3 rounded-xl border hover:border-yellow-500/40 transition-all flex items-start gap-3" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div className="flex-1"><div className="flex gap-1.5 mb-1"><span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full capitalize ${CC[a.category]||'bg-gray-800 text-gray-400'}`}>{a.category}</span><span className="text-[9px] text-gray-500">{new Date(a.published_at).toLocaleDateString('en-IN')}</span></div><p className="font-bebas text-sm tracking-wide text-white">{a.title}</p><p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{a.body?.slice(0,80)}...</p></div>
          {a.image_url&&<img src={a.image_url} className="w-14 h-14 rounded-lg object-cover shrink-0" alt=""/>}
        </button>
      ))}</div>
    </div>
  )
}