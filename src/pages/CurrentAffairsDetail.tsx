import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'
import { ChevronLeft, ExternalLink } from 'lucide-react'
export default function CurrentAffairsDetail() {
  const {slug}=useParams(); const {theme}=useTheme(); const navigate=useNavigate()
  const [article,setArticle]=useState<any>(null)
  useEffect(()=>{ if(!slug) return; supabase.from('current_affairs').select('*').or(`slug.eq.${slug},id.eq.${slug}`).single().then(({data})=>setArticle(data)) },[slug])
  if(!article) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"/></div>
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <button onClick={()=>navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4"><ChevronLeft size={14}/>Back</button>
      {article.image_url&&<img src={article.image_url} className="w-full h-48 object-cover rounded-xl mb-4" alt=""/>}
      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 capitalize">{article.category}</span>
      <h1 className="font-bebas text-2xl tracking-wider text-white mt-2 mb-1">{article.title}</h1>
      <p className="text-xs text-gray-500 font-mono mb-4">{new Date(article.published_at).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{article.body}</p>
      {article.source_link&&<a href={article.source_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 mt-4 text-yellow-400 text-sm hover:underline"><ExternalLink size={13}/>Read original source</a>}
    </div>
  )
}