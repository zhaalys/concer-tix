"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "./supabase";
import type { AdminProfile, AdminRole } from "@/types";

interface AdminCtx {
  user: { id: string; email: string | undefined } | null;
  profile: AdminProfile | null;
  role: AdminRole | null;
  isSuperAdmin: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AdminContext = createContext<AdminCtx>({
  user: null,
  profile: null,
  role: null,
  isSuperAdmin: false,
  loading: true,
  refresh: async () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string | undefined } | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const sessionUser = data?.session?.user;
    if (!sessionUser) {
      setUser(null);
      setProfile(null);
      setRole(null);
      setLoading(false);
      return;
    }
    setUser({ id: sessionUser.id, email: sessionUser.email });

    const { data: p } = await supabase
      .from("profiles")
      .select("id, role, display_name, avatar_url, phone, created_at")
      .eq("id", sessionUser.id)
      .maybeSingle();

    if (p && (p.role === "admin" || p.role === "super_admin")) {
      setProfile(p as AdminProfile);
      setRole(p.role as AdminRole);
    } else {
      setProfile(null);
      setRole(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AdminContext.Provider
      value={{ user, profile, role, isSuperAdmin: role === "super_admin", loading, refresh }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
