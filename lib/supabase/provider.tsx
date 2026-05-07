"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session, User, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type UserRole = 'admin' | 'user' | 'mitra' | 'agent' | 'factory';

interface SupabaseContextType {
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  role: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
    setRole((session?.user?.user_metadata?.role as UserRole) ?? "user");
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setRole((session?.user?.user_metadata?.role as UserRole) ?? "user");
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setRole((session?.user?.user_metadata?.role as UserRole) ?? "user");
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider 
      value={{ 
        supabase, 
        session, 
        user, 
        role, 
        loading, 
        signOut,
        refreshSession 
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase harus digunakan di dalam <SupabaseProvider>");
  }
  return context;
}