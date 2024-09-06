import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase } from "../utils/supabase"

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return { session }
}
