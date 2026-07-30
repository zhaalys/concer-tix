"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        router.replace("/");
      } else {
        router.replace("/login");
      }
    });
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "14px",
        color: "#64748B",
      }}
    >
      Loading...
    </div>
  );
}
