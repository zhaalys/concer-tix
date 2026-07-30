"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Navbar, Footer } from "@/components";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session?.user) {
        router.replace("/login");
        return;
      }
      setUser(data.session.user);
      setName(data.session.user.user_metadata?.display_name || "");
    };
    init();
  }, [router]);

  const saveName = async () => {
    if (!user || !name.trim() || name === user.user_metadata?.display_name) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { display_name: name },
    });
    if (!error) {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const photo = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px 80px" }}
          className="profile-wrap">
          <style>{`@media(min-width:768px){.profile-wrap{padding:48px 32px 80px !important;}}`}</style>
          {/* Avatar */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {photo && !avatarError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" onError={() => setAvatarError(true)} referrerPolicy="no-referrer"
                  style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#1ABC9C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#ffffff", fontSize: "28px", fontWeight: 700 }}>
                  {(user.user_metadata?.display_name || user.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#1A1D2E", margin: "0 0 2px", letterSpacing: "-0.01em" }}>
                  {user.user_metadata?.display_name || "User"}
                </h1>
                <p style={{ fontSize: "13px", color: "#868E96", margin: 0 }}>{user.email}</p>
                <p style={{ fontSize: "12px", color: "#ADB5BD", margin: "2px 0 0" }}>
                  {user.app_metadata?.provider === "google" ? "Google" : "Email"} sign-in
                </p>
              </div>
            </div>
          </div>

          {/* Edit Name */}
          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#868E96", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Display Name
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }}
                placeholder="Your name"
                style={{ flex: 1, height: "40px", padding: "0 12px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "14px", color: "#1A1D2E", backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none" }}
                onFocus={(e) => (e.target.style.borderColor = "#1ABC9C")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
              <button onClick={saveName} disabled={saving || !name.trim() || name === user.user_metadata?.display_name}
                style={{ height: "40px", padding: "0 16px", backgroundColor: name.trim() && name !== user.user_metadata?.display_name ? "#1ABC9C" : "#F1F3F5", color: name.trim() && name !== user.user_metadata?.display_name ? "#ffffff" : "#ADB5BD", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 600, cursor: name.trim() && name !== user.user_metadata?.display_name ? "pointer" : "default", transition: "all 0.15s" }}>
                {saving ? "Saving..." : saved ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#F1F3F5", marginBottom: "32px" }} />

          {/* Log Out */}
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            style={{ width: "100%", height: "40px", backgroundColor: "#ffffff", color: "#EF4444", borderRadius: "8px", border: "1px solid #F1F3F5", fontSize: "13px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEF2F2")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}>
            Log out
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
