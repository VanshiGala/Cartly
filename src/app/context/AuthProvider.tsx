"use client"
import { SessionProvider } from "next-auth/react" //to provide authentication state
//allowing any child component to access current session using useSession()

export default function AuthProvider({
  children,
}:{children : React.ReactNode}){  //React.ReactNode -> anything that can be rendered in react
  return (
    <SessionProvider>
     
      {children}
    </SessionProvider>
  )
}

//should run in browser
//all children will have access to session