import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { clearAICache } from '../../lib/ai'

const PROVIDERS = [
  {v:'groq',l:'Groq (Free & Fast)',m:'llama-3.3-70b-versatile'},
  {v:'openai',l:'OpenAI (GPT-4o)',m:'gpt-4o'},
  {v:'gemini',l:'Google Gemini',m:'gemini-1.5-flash'},
  {v:'together',l:'Together AI',m:'meta-llama/Llama-3-70b-chat-hf'},
  {v:'sarvam',l:'Sarvam AI',m:'sarvam-2b'},
  {v:'openrouter',l:'OpenRouter',m:'meta-llama/llama-3.1-70b-instruct'},
]

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string,string>>({})
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false); const [testResult, setTestResult] = useState('')

  useEffect(()=>{
    supabase.from('admin_settings').select('key,value').then(({data})=>{
      const s:Record<string,string>={}; data?.forEach(({key,value}:any)=>{ if(value) s[key]=value }); setSettings(s)
    })
  },[])

  async function save() {
    setSaving(true)
    const entries = Object.entries(settings).map(([key,value])=>({key,value}))
    for (const e of entries) { await supabase.from('admin_settings').upsert({key:e.key,value:e.value}) }
    clearAICache(); setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  async function testAI() {
    setTesting(true); setTestResult('')
    try {
      const provider = settings.ai_provider||'groq'
      const urls:Record<string,string> = {groq:'https://api.groq.com/openai/v1',openai:'https://api.openai.com/v1',gemini:'https://generativelanguage.googleapis.com/v1beta/openai',together:'https://api.together.xyz/v1',openrouter:'https://openrouter.ai/api/v1'}
      const res = await fetch(`${urls[provider]||urls.groq}/chat/completions`,{
        method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${settings.ai_api_key}`},
        body:JSON.stringify({model:settings.ai_model||'llama-3.3-70b-versatile',messages:[{role:'user',content:'Say "API working!" in 3 words.'}],max_tokens:20})
      })
      const data = await res.json()
      setTestResult(data.choices?.[0]?.message?.content||JSON.stringify(data))
    } catch(e:any) { setTestResult('Error: '+e.message) }
    setTesting(false)
  }

  const set = (k:string,v:string) => setSettings(p=>({...p,[k]:v}))
  const INP = "w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors"

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="font-bebas text-3xl text-yellow-400 tracking-wider mb-6">ADMIN SETTINGS</h1>

      <div className="bg-gray-800 rounded-xl p-5 mb-5 border border-gray-700">
        <h2 className="font-bebas text-lg text-yellow-400 mb-4">AI PROVIDER</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">PROVIDER</label>
            <select value={settings.ai_provider||'groq'} onChange={e=>{const p=PROVIDERS.find(x=>x.v===e.target.value); set('ai_provider',e.target.value); if(p) set('ai_model',p.m)}} className={INP} style={{backgroundColor:'#111827'}}>
              {PROVIDERS.map(p=><option key={p.v} value={p.v}>{p.l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">API KEY</label>
            <input type="password" value={settings.ai_api_key||''} onChange={e=>set('ai_api_key',e.target.value)} placeholder="Paste your API key here" className={INP}/>
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">MODEL</label>
            <input value={settings.ai_model||''} onChange={e=>set('ai_model',e.target.value)} placeholder="Model name" className={INP}/>
          </div>
          <div className="flex gap-2">
            <button onClick={testAI} disabled={testing||!settings.ai_api_key} className="px-4 py-2 rounded-lg text-xs font-bold bg-gray-700 text-white disabled:opacity-50 hover:bg-gray-600">
              {testing?'Testing...':'🔌 Test Connection'}
            </button>
            {testResult&&<span className={`text-xs px-3 py-2 rounded-lg ${testResult.includes('Error')?'bg-red-900/40 text-red-300':'bg-green-900/40 text-green-300'}`}>{testResult}</span>}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 mb-5 border border-gray-700">
        <h2 className="font-bebas text-lg text-yellow-400 mb-4">SITE SETTINGS</h2>
        <div className="space-y-3">
          {[{k:'admin_email',l:'Admin Email',p:'devrayog@gmail.com'},{k:'site_name',l:'Site Name',p:'Devrayog NDA AI'},{k:'site_tagline',l:'Tagline',p:'NDA in DNA'}].map(f=>(
            <div key={f.k}><label className="block text-xs font-mono text-gray-400 mb-1">{f.l.toUpperCase()}</label><input value={settings[f.k]||''} onChange={e=>set(f.k,e.target.value)} placeholder={f.p} className={INP}/></div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving} className="w-full py-3 rounded-xl font-bold disabled:opacity-50 bg-gradient-to-r from-yellow-500 to-yellow-300 text-gray-900">
        {saving?'Saving...':(saved?'✅ Saved!':'Save All Settings')}
      </button>
    </div>
  )
}