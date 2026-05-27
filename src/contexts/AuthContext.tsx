import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

export type Profile = {
  id:string; email:string; name?:string; username?:string; phone?:string; state?:string;
  gender?:'male'|'female'; service?:'army'|'navy'|'airforce'; attempt?:string; target_exam?:string;
  written_cleared?:boolean; ssb_appeared?:boolean; medium?:'hindi'|'english'; challenge?:string;
  study_hours?:string; avatar_url?:string; is_premium?:boolean; is_admin?:boolean;
  dna_score?:number; streak?:number;
}

interface AuthCtx { user:any; profile:Profile|null; loading:boolean; isAdmin:boolean; isPremium:boolean; refreshProfile:()=>Promise<void>; signOut:()=>Promise<void> }
const AuthContext = createContext<AuthCtx>({ user:null,profile:null,loading:true,isAdmin:false,isPremium:false,refreshProfile:async()=>{},signOut:async()=>{} })

export function AuthProvider({ children }:{ children:ReactNode }) {
  const [user,setUser] = useState<any>(null)
  const [profile,setProfile] = useState<Profile|null>(null)
  const [loading,setLoading] = useState(true)

  async function loadProfile(id:string) {
    const {data} = await supabase.from('profiles').select('*').eq('id',id).single()
    if(data) setProfile(data as Profile)
  }
  async function refreshProfile() { if(user) await loadProfile(user.id) }
  async function signOut() { await supabase.auth.signOut(); setUser(null); setProfile(null) }

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user??null)
      if(session?.user) loadProfile(session.user.id)
      setLoading(false)
    })
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{
      setUser(session?.user??null)
      if(session?.user) loadProfile(session.user.id)
      else setProfile(null)
    })
    return ()=>subscription.unsubscribe()
  },[])

  return <AuthContext.Provider value={{user,profile,loading,isAdmin:profile?.is_admin??false,isPremium:profile?.is_premium??false,refreshProfile,signOut}}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
