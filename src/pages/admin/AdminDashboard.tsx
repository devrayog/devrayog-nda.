import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users:0, waitlist:0, tests:0, feedback:0, chats:0 })
  useEffect(()=>{
    Promise.all([
      supabase.from('profiles').select('id',{count:'exact',head:true}),
      supabase.from('waitlist').select('id',{count:'exact',head:true}),
      supabase.from('test_results').select('id',{count:'exact',head:true}),
      supabase.from('feedback').select('id',{count:'exact',head:true}),
      supabase.from('ai_chat_history').select('id',{count:'exact',head:true}),
    ]).then(([u,w,t,f,c])=>{
      setStats({ users:u.count||0, waitlist:w.count||0, tests:t.count||0, feedback:f.count||0, chats:c.count||0 })
    })
  },[])
  const cards = [
    {l:'Total Users',v:stats.users,e:'👥'},{l:'Waitlist',v:stats.waitlist,e:'📋'},
    {l:'Tests Taken',v:stats.tests,e:'📝'},{l:'Feedback',v:stats.feedback,e:'💬'},
    {l:'AI Chats',v:stats.chats,e:'🤖'},
  ]
  return (
    <div className="p-6">
      <h1 className="font-bebas text-3xl text-yellow-400 tracking-wider mb-6">ADMIN DASHBOARD</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map(c=>(
          <div key={c.l} className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
            <div className="text-3xl mb-1">{c.e}</div>
            <div className="font-bebas text-2xl text-yellow-400">{c.v}</div>
            <div className="text-xs text-gray-400">{c.l}</div>
          </div>
        ))}
      </div>
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h2 className="font-bebas text-lg text-yellow-400 mb-3">QUICK LINKS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['/admin/waitlist','/admin/users','/admin/topics','/admin/current-affairs','/admin/ssb','/admin/mock-tests','/admin/settings','/admin/ai'].map(link=>(
            <a key={link} href={link} className="px-3 py-2 bg-gray-700 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-gray-600 transition-colors">{link.replace('/admin/','')}</a>
          ))}
        </div>
      </div>
    </div>
  )
}