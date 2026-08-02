const supabase = require("../lib/supabase");

const ALL_ROLES = ["admin", "super_admin"];

async function requireAdmin(req, res, next) {
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ success: false, message: "Token tidak valid" });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, display_name, avatar_url, phone, created_at")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile || !ALL_ROLES.includes(profile.role)) {
      return res.status(403).json({ success: false, message: "Akses ditolak. Anda bukan admin." });
    }

    req.admin = {
      id: data.user.id,
      email: data.user.email,
      role: profile.role,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
      phone: profile.phone,
    };
    next();
  } catch (err) {
    next(err);
  }
}

function requireSuperAdmin(req, res, next) {
  if (req.admin?.role !== "super_admin") {
    return res.status(403).json({ success: false, message: "Hanya Super Admin yang dapat mengakses fitur ini." });
  }
  next();
}

module.exports = { requireAdmin, requireSuperAdmin };
