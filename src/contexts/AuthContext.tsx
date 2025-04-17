import { createContext, useEffect } from "react";
import React from "react";
import { supabase } from "../services/supabaseClient";

const authContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user,setUser] = React.useState<any>(null);

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.error("Error signing up:", error.message);
            return null;
        }
        console.log("Sign up successful:", data);
        return data;
    }

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error("Error signing in:", error.message);
            return null;
        }
        console.log("Sign in successful:", data);
        return data;
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
            return null;
        }
        localStorage.removeItem('user_id')
        console.log("Sign out successful");
        return true;
    }

    useEffect(()=>{
        const session = supabase.auth.getSession()
        session.then(({data})=>{
            if(data.session){
                setUser(data.session.user)
                console.log("User session:", user);
                localStorage.setItem('user_id',data.session.user.id)
            }
        })
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth state changed:", event, session);
            setUser(session?.user || null);
            console.log("User session(Auth State Change):", session);
        });
        return () => {
            authListener.subscription.unsubscribe();
        };
    },[])

  return (
    <authContext.Provider value={{signIn, signUp, signOut, user}}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => React.useContext(authContext);