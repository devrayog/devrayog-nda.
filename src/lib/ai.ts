import { supabase } from './supabase'

let _cfg: any = null
export function clearAICache(){ _cfg = null }

export async function getAIConfig() {
  if (_cfg) return _cfg
  const { data } = await supabase.from('admin_settings').select('key,value').in('key',['ai_provider','ai_api_key','ai_model'])
  const s: Record<string,string> = {}
  data?.forEach(({key,value}:any)=>{ if(value) s[key]=value })
  const urls: Record<string,string> = {
    groq:'https://api.groq.com/openai/v1', openai:'https://api.openai.com/v1',
    gemini:'https://generativelanguage.googleapis.com/v1beta/openai',
    together:'https://api.together.xyz/v1', sarvam:'https://api.sarvam.ai/v1',
    openrouter:'https://openrouter.ai/api/v1'
  }
  const models: Record<string,string> = {
    groq:'llama-3.3-70b-versatile', openai:'gpt-4o', gemini:'gemini-1.5-flash',
    together:'meta-llama/Llama-3-70b-chat-hf', openrouter:'meta-llama/llama-3.1-70b-instruct'
  }
  const p = s.ai_provider || 'groq'
  _cfg = { provider:p, apiKey:s.ai_api_key||'', model:s.ai_model||models[p]||'llama-3.3-70b-versatile', baseUrl:urls[p]||urls.groq }
  return _cfg
}

export type Msg = { role:'system'|'user'|'assistant'; content:string }

export async function callAI(messages:Msg[], opts:{maxTokens?:number}={}): Promise<string> {
  const cfg = await getAIConfig()
  if (!cfg.apiKey) return 'No AI API key configured. Please set it in Admin > Settings.'
  try {
    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${cfg.apiKey}`},
      body: JSON.stringify({ model:cfg.model, messages, max_tokens:opts.maxTokens||800, temperature:0.7 })
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content || ''
  } catch { return 'AI error. Check API key in Admin Settings.' }
}

export async function streamAI(messages:Msg[], onChunk:(t:string)=>void, onDone:()=>void) {
  const cfg = await getAIConfig()
  if (!cfg.apiKey) { onChunk('No AI API key configured.'); onDone(); return }
  try {
    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${cfg.apiKey}`},
      body: JSON.stringify({ model:cfg.model, messages, max_tokens:2000, temperature:0.7, stream:true })
    })
    const reader = res.body?.getReader(); const dec = new TextDecoder()
    if (!reader) { onDone(); return }
    while (true) {
      const {done,value} = await reader.read(); if(done) break
      const lines = dec.decode(value).split('\n').filter(l=>l.startsWith('data: '))
      for (const line of lines) {
        const d = line.slice(6); if(d==='[DONE]'){ onDone(); return }
        try { const t=JSON.parse(d).choices?.[0]?.delta?.content; if(t) onChunk(t) } catch {}
      }
    }
    onDone()
  } catch { onChunk('Stream error.'); onDone() }
}

export function buildUserContext(profile:any, extra?:any): string {
  if (!profile) return 'You are DNA, an NDA exam preparation AI assistant.'
  return `You are DNA — personal AI mentor for ${profile.name||'this student'} on Devrayog NDA AI.
STUDENT: Name=${profile.name}, Service=${profile.service?.toUpperCase()}, Attempt=${profile.attempt}, Written=${profile.written_cleared?'cleared':'not cleared'}, State=${profile.state}, Medium=${profile.medium}, Challenge=${profile.challenge}, StudyHours=${profile.study_hours}, DNAScore=${profile.dna_score||0}%, Streak=${extra?.streak||0}
TONE: ${profile.attempt==='1st'?'encouraging':profile.attempt==='3rd'||profile.attempt==='4th+'?'direct and honest':'focused'}. Use ${profile.medium==='hindi'?'Hinglish':'English'}. Be concise. Never explicitly mention student's past metrics — use them silently to help better.`
}
