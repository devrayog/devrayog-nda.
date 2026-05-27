import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
export type ServiceTheme = 'army'|'navy'|'airforce'|'default'
export type Gender = 'male'|'female'
interface Theme { bg:string; bgMid:string; bgLight:string; accent:string; border:string; serviceIcon:string; heroImg:string; officerImg:string }
const THEMES: Record<ServiceTheme,Theme> = {
  army:    { bg:'#0d1a0f', bgMid:'#152015', bgLight:'#1e321e', accent:'#C9A84C', border:'rgba(74,124,89,0.3)',   serviceIcon:'🪖', heroImg:'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=1600', officerImg:'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800' },
  navy:    { bg:'#050e1c', bgMid:'#0a1929', bgLight:'#0f2540', accent:'#C9A84C', border:'rgba(30,77,140,0.3)',   serviceIcon:'⚓', heroImg:'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1600', officerImg:'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800' },
  airforce:{ bg:'#050d1f', bgMid:'#091526', bgLight:'#0f2040', accent:'#C9A84C', border:'rgba(26,95,168,0.3)',   serviceIcon:'✈️', heroImg:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600', officerImg:'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800' },
  default: { bg:'#0B1628', bgMid:'#112040', bgLight:'#1A3060', accent:'#C9A84C', border:'rgba(201,168,76,0.2)', serviceIcon:'🎖️', heroImg:'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=1600', officerImg:'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800' },
}

interface ThemeCtx { service:ServiceTheme; gender:Gender; theme:Theme; isDark:boolean; toggleDark:()=>void; setServiceTheme:(s:ServiceTheme,g:Gender)=>void; lang:'hindi'|'english'; setLang:(l:'hindi'|'english')=>void }
const ThemeContext = createContext<ThemeCtx>({ service:'default', gender:'male', theme:THEMES.default, isDark:true, toggleDark:()=>{}, setServiceTheme:()=>{}, lang:'hindi', setLang:()=>{} })

export function ThemeProvider({ children }:{ children:ReactNode }) {
  const [service, setService] = useState<ServiceTheme>('default')
  const [gender, setGender] = useState<Gender>('male')
  const [isDark, setIsDark] = useState(true)
  const [lang, setLangState] = useState<'hindi'|'english'>('hindi')

  useEffect(()=>{
    const s = localStorage.getItem('dna_service') as ServiceTheme
    const g = localStorage.getItem('dna_gender') as Gender
    const d = localStorage.getItem('dna_dark')
    const l = localStorage.getItem('dna_lang') as 'hindi'|'english'
    if(s) setService(s); if(g) setGender(g)
    if(d!==null) setIsDark(d==='true'); if(l) setLangState(l)
  },[])

  useEffect(()=>{
    if(isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  },[isDark])

  function setServiceTheme(s:ServiceTheme, g:Gender){ setService(s); setGender(g); localStorage.setItem('dna_service',s); localStorage.setItem('dna_gender',g) }
  function toggleDark(){ setIsDark(p=>{ localStorage.setItem('dna_dark',String(!p)); return !p }) }
  function setLang(l:'hindi'|'english'){ setLangState(l); localStorage.setItem('dna_lang',l) }

  return <ThemeContext.Provider value={{ service, gender, theme:THEMES[service], isDark, toggleDark, setServiceTheme, lang, setLang }}>{children}</ThemeContext.Provider>
}
export const useTheme = () => useContext(ThemeContext)
export { THEMES }
