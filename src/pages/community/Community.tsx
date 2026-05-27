import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/ui/PageHeader'
import { Heart, MessageCircle, Send } from 'lucide-react'
export default function Community() {
  const { profile }=useAuth(); const { theme }=useTheme()
  const [posts,setPosts]=useState<any[]>([]); const [newPost,setNewPost]=useState(''); const [posting,setPosting]=useState(false)
  const load=async()=>{ const {data}=await supabase.from('community_posts').select('*,user:profiles(name,avatar_url,service,attempt)').is('parent_id',null).eq('is_active',true).order('created_at',{ascending:false}).limit(30); setPosts(data||[]) }
  useEffect(()=>{ load() },[])
  async function post(){ if(!newPost.trim()||!profile?.id) return; setPosting(true); await supabase.from('community_posts').insert({user_id:profile.id,content:newPost}); setNewPost(''); setPosting(false); load() }
  async function like(id:string,likes:number){ await supabase.from('community_posts').update({likes:likes+1}).eq('id',id); load() }
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <PageHeader title="COMMUNITY" subtitle="Connect with NDA aspirants across India." icon="👥" page="Community" image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800"/>
      <div className="rounded-xl p-4 mb-4 border" style={{background:theme.bgMid,borderColor:theme.border}}>
        <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} rows={2} placeholder="Share your thoughts, questions, or motivation..." className="w-full bg-black/30 border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none resize-none mb-2" style={{borderColor:theme.border}}/>
        <div className="flex justify-end"><button onClick={post} disabled={posting||!newPost.trim()} className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}><Send size={12}/>{posting?'Posting...':'Post'}</button></div>
      </div>
      <div className="space-y-3">{posts.map(p=>(
        <div key={p.id} className="rounded-xl p-4 border" style={{background:theme.bgMid,borderColor:theme.border}}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bebas text-sm shrink-0" style={{background:`linear-gradient(135deg,${theme.accent},#E8C96A)`,color:theme.bg}}>{p.user?.avatar_url?<img src={p.user.avatar_url} className="w-full h-full object-cover" alt=""/>:(p.user?.name?.[0]||'?')}</div>
            <div><p className="text-sm font-medium text-white">{p.user?.name||'Anonymous'}</p><p className="text-xs text-gray-500">{p.user?.attempt} · {p.user?.service} · {new Date(p.created_at).toLocaleDateString('en-IN')}</p></div>
          </div>
          {p.image_url&&<img src={p.image_url} className="w-full rounded-xl mb-2 max-h-64 object-cover" alt=""/>}
          <p className="text-gray-300 text-sm">{p.content}</p>
          <div className="flex gap-4 mt-3"><button onClick={()=>like(p.id,p.likes||0)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"><Heart size={12}/>{p.likes||0}</button><span className="flex items-center gap-1 text-xs text-gray-500"><MessageCircle size={12}/>Reply</span></div>
        </div>
      ))}</div>
    </div>
  )
}