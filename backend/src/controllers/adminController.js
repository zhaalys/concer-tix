const supabase = require("../lib/supabase");

function generatePassword(length = 10) {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pass = "";
  for (let i = 0; i < length; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

const authAdminHeaders = {
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};

async function findUserByEmail(email) {
  const res = await fetch(
    `${process.env.SUPABASE_URL}/auth/v1/admin/users?filter=${encodeURIComponent(email)}&per_page=50`,
    { headers: authAdminHeaders }
  );
  if (!res.ok) throw new Error(`Gagal mencari user (${res.status})`);
  const data = await res.json();
  return (data.users || []).find((u) => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
}

async function createAuthUser(payload) {
  const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: authAdminHeaders,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.msg || `Gagal membuat user (${res.status})`);
  }
  return res.json();
}

async function patchAuthUser(id, payload) {
  const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/admin/users/${id}`, {
    method: "PATCH",
    headers: authAdminHeaders,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.msg || `Gagal memperbarui user (${res.status})`);
  }
  return res.json();
}

exports.getOverview = async (req, res, next) => {
  try {
    const [
      ordersRes,
      wristbandRes,
      eventsRes,
      attendeesRes,
      orderItemsRes,
      usersRes,
    ] = await Promise.all([
      supabase.from("orders").select("id, status, total_amount, order_code, created_at"),
      supabase.from("wristband_orders").select("id, status, total_amount, order_code, created_at"),
      supabase.from("events").select("id, title, city, image_url, event_date, status", { count: "exact" }),
      supabase.from("attendees").select("id, is_checked_in"),
      supabase.from("order_items").select("id, quantity, orders!inner(status)"),
      supabase.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    const orders = ordersRes.data || [];
    const wristbands = wristbandRes.data || [];
    const events = eventsRes.data || [];
    const attendees = attendeesRes.data || [];
    const orderItems = orderItemsRes.data || [];

    const ticketRevenue = orders.filter((o) => o.status === "paid").reduce((s, o) => s + (o.total_amount || 0), 0);
    const wristbandRevenue = wristbands.filter((o) => o.status === "paid").reduce((s, o) => s + (o.total_amount || 0), 0);
    const ticketsSold = orderItems
      .filter((it) => it.orders && it.orders.status === "paid")
      .reduce((s, it) => s + (it.quantity || 0), 0);

    const { data: recentOrders } = await supabase
      .from("orders")
      .select("id, order_code, status, total_amount, created_at, order_items(ticket_label, quantity, events(title)), attendees(email, full_name)")
      .order("created_at", { ascending: false })
      .limit(6);

    res.json({
      success: true,
      data: {
        total_revenue: ticketRevenue + wristbandRevenue,
        ticket_revenue: ticketRevenue,
        wristband_revenue: wristbandRevenue,
        total_orders: orders.length + wristbands.length,
        ticket_orders: orders.length,
        wristband_orders: wristbands.length,
        tickets_sold: ticketsSold,
        total_users: usersRes.data?.users?.length || 0,
        total_events: events.length,
        checked_in: attendees.filter((a) => a.is_checked_in).length,
        recent_orders: recentOrders || [],
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.listAdmins = async (req, res, next) => {
  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, role, display_name, avatar_url, created_at")
      .in("role", ["admin", "super_admin"]);

    if (error) throw error;

    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (usersError) throw usersError;

    const emailById = {};
    for (const u of users || []) emailById[u.id] = u.email;

    const admins = profiles.map((p) => ({
      id: p.id,
      email: emailById[p.id] || null,
      role: p.role,
      display_name: p.display_name,
      avatar_url: p.avatar_url,
      created_at: p.created_at,
    }));

    admins.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ success: true, data: admins });
  } catch (err) {
    next(err);
  }
};

exports.addAdmin = async (req, res, next) => {
  try {
    const { email, role = "admin", display_name, password } = req.body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Email tidak valid" });
    }
    if (!["admin", "super_admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Role harus admin atau super_admin" });
    }

    const existing = await findUserByEmail(email);
    const finalPassword = password || generatePassword();
    let userId;
    let created = false;

    if (existing) {
      userId = existing.id;
      if (existing.email_confirmed_at === null) {
        await patchAuthUser(userId, { email_confirm: true });
      }
      if (display_name) {
        await patchAuthUser(userId, { user_metadata: { display_name } });
      }
    } else {
      const createdUser = await createAuthUser({
        email,
        password: finalPassword,
        email_confirm: true,
        user_metadata: { display_name: display_name || email.split("@")[0] },
      });
      userId = createdUser.id;
      created = true;
    }

    const { error: upsertError } = await supabase.from("profiles").upsert(
      { id: userId, role, display_name: display_name || email.split("@")[0] },
      { onConflict: "id" }
    );
    if (upsertError) throw upsertError;

    res.status(201).json({
      success: true,
      message: created ? "Admin baru berhasil ditambahkan" : "Admin berhasil diperbarui",
      data: { id: userId, email, role, display_name: display_name || email.split("@")[0], created, generated_password: created ? finalPassword : undefined },
    });
  } catch (err) {
    next(err);
  }
};

exports.removeAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "ID admin wajib diisi" });
    if (id === req.admin.id) {
      return res.status(400).json({ success: false, message: "Anda tidak dapat menghapus akun sendiri" });
    }

    const { data: target } = await supabase.from("profiles").select("id, role").eq("id", id).single();
    if (!target || !["admin", "super_admin"].includes(target.role)) {
      return res.status(404).json({ success: false, message: "Admin tidak ditemukan" });
    }

    if (target.role === "super_admin") {
      const { data: superAdmins } = await supabase.from("profiles").select("id").eq("role", "super_admin");
      if ((superAdmins || []).length <= 1) {
        return res.status(400).json({ success: false, message: "Tidak dapat menghapus satu-satunya Super Admin" });
      }
    }

    const { error } = await supabase.from("profiles").update({ role: "user" }).eq("id", id);
    if (error) throw error;

    res.json({ success: true, message: "Admin berhasil dihapus (role dikembalikan menjadi user)" });
  } catch (err) {
    next(err);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (usersError) throw usersError;

    const ids = (users || []).map((u) => u.id);
    const { data: profiles } = await supabase.from("profiles").select("id, role, display_name, avatar_url, created_at").in("id", ids);
    const profileById = {};
    for (const p of profiles || []) profileById[p.id] = p;

    const { data: orders } = await supabase.from("orders").select("user_id, status, total_amount");

    const ordersByUser = {};
    for (const o of orders || []) {
      if (!ordersByUser[o.user_id]) ordersByUser[o.user_id] = { count: 0, paid: 0, spent: 0 };
      ordersByUser[o.user_id].count += 1;
      if (o.status === "paid") {
        ordersByUser[o.user_id].paid += 1;
        ordersByUser[o.user_id].spent += o.total_amount || 0;
      }
    }

    const list = (users || []).map((u) => {
      const p = profileById[u.id] || {};
      return {
        id: u.id,
        email: u.email,
        display_name: p.display_name || u.user_metadata?.display_name || null,
        role: p.role || "user",
        avatar_url: p.avatar_url || u.user_metadata?.avatar_url || null,
        provider: u.app_metadata?.provider || "email",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        orders_count: ordersByUser[u.id]?.count || 0,
        orders_paid: ordersByUser[u.id]?.paid || 0,
        total_spent: ordersByUser[u.id]?.spent || 0,
      };
    });

    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.listOrders = async (req, res, next) => {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, order_items(ticket_label, quantity, unit_price, subtotal, events(id, title, image_url, city, event_date)), attendees(email, full_name)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: orders || [] });
  } catch (err) {
    next(err);
  }
};

function slugify(text) {
  return (text || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

exports.listEvents = async (req, res, next) => {
  try {
    const { data: events, error } = await supabase
      .from("events")
      .select("*, event_tickets(id, label, price, quantity, remaining, max_per_order, is_active)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: events || [] });
  } catch (err) {
    next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data: event, error } = await supabase
      .from("events")
      .select("*, event_tickets(id, label, price, quantity, remaining, max_per_order, is_active)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!event) return res.status(404).json({ success: false, message: "Event tidak ditemukan" });
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const {
      title,
      organizer,
      organizer_logo,
      image_url,
      category,
      city,
      city_label,
      location,
      venue,
      event_date,
      event_time,
      description,
      is_hot,
      status,
      facilities,
      social_media,
      terms,
      map_url,
      stage_image,
      stages,
      tickets = [],
    } = req.body || {};

    if (!title) return res.status(400).json({ success: false, message: "Judul event wajib diisi" });

    const slug = slugify(title) + "-" + Date.now().toString(36);

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        slug,
        title,
        organizer: organizer || null,
        organizer_logo: organizer_logo || "/logo/tix_logo.png",
        image_url: image_url || null,
        category: category || null,
        city: city || null,
        city_label: city_label || null,
        location: location || null,
        venue: venue || null,
        event_date: event_date || null,
        event_time: event_time || null,
        description: description || null,
        is_hot: !!is_hot,
        status: status || "upcoming",
        facilities: facilities || [],
        social_media: social_media || [],
        terms: terms || [],
        map_url: map_url || null,
        stage_image: stage_image || null,
        stages: Array.isArray(stages) ? stages : [],
      })
      .select("id")
      .single();

    if (error) throw error;

    const rows = (tickets || [])
      .filter((t) => t.label && t.price != null)
      .map((t) => ({
        event_id: event.id,
        label: t.label,
        price: Number(t.price) || 0,
        icon: t.icon || "confirmation_number",
        quantity: Number(t.quantity) || 0,
        remaining: Number(t.remaining ?? t.quantity) || 0,
        max_per_order: Number(t.max_per_order) || 5,
        is_active: t.is_active !== false,
      }));

    if (rows.length) {
      const { error: ticketError } = await supabase.from("event_tickets").insert(rows);
      if (ticketError) throw ticketError;
    }

    res.status(201).json({ success: true, message: "Event berhasil dibuat", data: { id: event.id } });
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      organizer,
      organizer_logo,
      image_url,
      category,
      city,
      city_label,
      location,
      venue,
      event_date,
      event_time,
      description,
      is_hot,
      status,
      facilities,
      social_media,
      terms,
      map_url,
      stage_image,
      stages,
      tickets,
    } = req.body || {};

    const patch = {};
    if (title !== undefined) patch.title = title;
    if (organizer !== undefined) patch.organizer = organizer;
    if (organizer_logo !== undefined) patch.organizer_logo = organizer_logo;
    if (image_url !== undefined) patch.image_url = image_url;
    if (category !== undefined) patch.category = category;
    if (city !== undefined) patch.city = city;
    if (city_label !== undefined) patch.city_label = city_label;
    if (location !== undefined) patch.location = location;
    if (venue !== undefined) patch.venue = venue;
    if (event_date !== undefined) patch.event_date = event_date;
    if (event_time !== undefined) patch.event_time = event_time;
    if (description !== undefined) patch.description = description;
    if (is_hot !== undefined) patch.is_hot = !!is_hot;
    if (status !== undefined) patch.status = status;
    if (facilities !== undefined) patch.facilities = facilities;
    if (social_media !== undefined) patch.social_media = social_media;
    if (terms !== undefined) patch.terms = terms;
    if (map_url !== undefined) patch.map_url = map_url;
    if (stage_image !== undefined) patch.stage_image = stage_image;
    if (stages !== undefined) patch.stages = Array.isArray(stages) ? stages : [];
    patch.updated_at = new Date().toISOString();

    const { error } = await supabase.from("events").update(patch).eq("id", id);
    if (error) throw error;

    if (Array.isArray(tickets)) {
      const clean = tickets.filter((t) => t.label && t.price != null);
      const current = await supabase.from("event_tickets").select("id").eq("event_id", id);
      const existingIds = new Set((current.data || []).map((t) => t.id));
      const keepIds = new Set(clean.filter((t) => t.id && existingIds.has(t.id)).map((t) => t.id));

      for (const t of clean) {
        const row = {
          event_id: id,
          label: t.label,
          price: Number(t.price) || 0,
          icon: t.icon || "confirmation_number",
          quantity: Number(t.quantity) || 0,
          remaining: Number(t.remaining ?? t.quantity) || 0,
          max_per_order: Number(t.max_per_order) || 5,
          is_active: t.is_active !== false,
        };
        if (t.id && existingIds.has(t.id)) {
          await supabase.from("event_tickets").update(row).eq("id", t.id);
        } else {
          await supabase.from("event_tickets").insert(row);
        }
      }

      for (const oldId of existingIds) {
        if (!keepIds.has(oldId)) {
          await supabase.from("event_tickets").delete().eq("id", oldId);
        }
      }
    }

    res.json({ success: true, message: "Event berhasil diperbarui" });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data: orderItems } = await supabase.from("order_items").select("id").eq("event_id", id).limit(1);
    if (orderItems && orderItems.length > 0) {
      return res.status(400).json({ success: false, message: "Event memiliki order terikat dan tidak dapat dihapus" });
    }

    await supabase.from("event_tickets").delete().eq("event_id", id);
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;

    res.json({ success: true, message: "Event berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    const { data, filename = `event-${Date.now()}.png` } = req.body || {};
    if (!data) return res.status(400).json({ success: false, message: "Data gambar kosong" });

    const mimeMatch = data.match(/^data:(image\/(png|jpeg|jpg|webp|gif));base64,(.+)$/s);
    if (!mimeMatch) {
      return res.status(400).json({ success: false, message: "Format gambar tidak valid. Gunakan PNG/JPG/WEBP/GIF." });
    }
    const mime = mimeMatch[1] === "image/jpg" ? "image/jpeg" : mimeMatch[1];
    const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
    const buffer = Buffer.from(mimeMatch[3], "base64");

    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: "Ukuran gambar maksimal 5 MB" });
    }

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `events/${safeName}`;

    const { data: uploaded, error } = await supabase.storage
      .from("event-images")
      .upload(path, buffer, { contentType: mime, upsert: true });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage.from("event-images").getPublicUrl(path);
    res.json({ success: true, data: { url: publicUrl.publicUrl, path } });
  } catch (err) {
    next(err);
  }
};

exports.listPayments = async (req, res, next) => {
  try {
    const [ordersRes, wristbandRes] = await Promise.all([
      supabase
        .from("orders")
        .select("id, order_code, status, total_amount, payment_method, payment_token, payment_url, paid_at, created_at, attendees(email, full_name), order_items(events(title))")
        .order("created_at", { ascending: false }),
      supabase
        .from("wristband_orders")
        .select("id, order_code, variant, quantity, unit_price, total_amount, status, payment_method, payment_token, payment_url, paid_at, customer_name, customer_whatsapp, created_at")
        .order("created_at", { ascending: false }),
    ]);

    if (ordersRes.error) throw ordersRes.error;
    if (wristbandRes.error) throw wristbandRes.error;

    const ticketPayments = (ordersRes.data || []).map((o) => ({
      id: o.id,
      order_code: o.order_code,
      type: "tiket",
      customer: o.attendees?.[0]?.full_name || o.attendees?.[0]?.email || "-",
      description: o.order_items?.[0]?.events?.title || "Event",
      status: o.status,
      amount: o.total_amount,
      payment_method: o.payment_method,
      payment_token: o.payment_token,
      payment_url: o.payment_url,
      paid_at: o.paid_at,
      created_at: o.created_at,
    }));

    const wristbandPayments = (wristbandRes.data || []).map((o) => ({
      id: o.id,
      order_code: o.order_code,
      type: "wristband",
      customer: o.customer_name || "-",
      description: `${o.variant || "Gelang"} x${o.quantity || 1}`,
      status: o.status,
      amount: o.total_amount,
      payment_method: o.payment_method,
      payment_token: o.payment_token,
      payment_url: o.payment_url,
      paid_at: o.paid_at,
      created_at: o.created_at,
    }));

    const all = [...ticketPayments, ...wristbandPayments].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    res.json({ success: true, data: all });
  } catch (err) {
    next(err);
  }
};

const TICKET_STATUS = ["pending", "paid", "cancelled", "refunded"];
const WRISTBAND_STATUS = ["pending", "paid", "processed", "shipped", "completed", "cancelled"];

exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type = "tiket", status } = req.body || {};

    if (!status) return res.status(400).json({ success: false, message: "Status wajib diisi" });

    if (type === "wristband") {
      if (!WRISTBAND_STATUS.includes(status)) {
        return res.status(400).json({ success: false, message: "Status wristband tidak valid" });
      }
      const { error } = await supabase.from("wristband_orders").update({ status }).eq("id", id);
      if (error) throw error;
    } else {
      if (!TICKET_STATUS.includes(status)) {
        return res.status(400).json({ success: false, message: "Status tiket tidak valid" });
      }
      const patch = { status, updated_at: new Date().toISOString() };
      if (status === "paid" && !req.body.keep_paid_at) patch.paid_at = new Date().toISOString();
      if (status === "refunded" && !req.body.keep_paid_at) patch.paid_at = null;
      const { error } = await supabase.from("orders").update(patch).eq("id", id);
      if (error) throw error;
    }

    res.json({ success: true, message: `Status pembayaran diperbarui menjadi ${status}` });
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, total_amount, payment_method } = req.body || {};

    const patch = { updated_at: new Date().toISOString() };
    if (status !== undefined) {
      if (!TICKET_STATUS.includes(status)) {
        return res.status(400).json({ success: false, message: "Status order tidak valid" });
      }
      patch.status = status;
      if (status === "paid" && req.body.set_paid_at !== false) patch.paid_at = new Date().toISOString();
    }
    if (total_amount !== undefined) {
      const num = Number(total_amount);
      if (!Number.isFinite(num) || num < 0) {
        return res.status(400).json({ success: false, message: "Total amount tidak valid" });
      }
      patch.total_amount = Math.round(num);
    }
    if (payment_method !== undefined) patch.payment_method = payment_method || null;

    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) throw error;

    res.json({ success: true, message: "Order berhasil diperbarui" });
  } catch (err) {
    next(err);
  }
};

const PLACEMENTS = ["hero", "banner", "inline"];
const OBJECT_FITS = ["cover", "contain"];

function validBannerHeight(value) {
  if (value === undefined || value === null || value === "") return true;
  const n = Number(value);
  return Number.isInteger(n) && n >= 40 && n <= 2000;
}

const NOTIFICATION_SELECT =
  "id, title, message, type, link, is_active, image_url, placement, object_fit, banner_height, created_at, updated_at";

exports.listNotifications = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(NOTIFICATION_SELECT)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    next(err);
  }
};

exports.getNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("notifications")
      .select(NOTIFICATION_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: "Pemberitahuan tidak ditemukan" });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const { title, message = "", type = "info", link, is_active = true, image_url, placement = "inline", object_fit = "cover", banner_height } = req.body || {};
    if (!title) return res.status(400).json({ success: false, message: "Judul pemberitahuan wajib diisi" });
    if (!["info", "promo", "warning", "update"].includes(type)) {
      return res.status(400).json({ success: false, message: "Tipe pemberitahuan tidak valid" });
    }
    if (!PLACEMENTS.includes(placement)) {
      return res.status(400).json({ success: false, message: "Penempatan banner tidak valid" });
    }
    if (!OBJECT_FITS.includes(object_fit)) {
      return res.status(400).json({ success: false, message: "Mode ukuran gambar tidak valid" });
    }
    if (!validBannerHeight(banner_height)) {
      return res.status(400).json({ success: false, message: "Tinggi banner harus angka antara 40–2000" });
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        title,
        message,
        type,
        link: link || null,
        is_active: !!is_active,
        created_by: req.admin.id,
        image_url: image_url || null,
        placement,
        object_fit,
        banner_height: banner_height ? Number(banner_height) : null,
      })
      .select(NOTIFICATION_SELECT)
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: "Pemberitahuan dibuat", data });
  } catch (err) {
    next(err);
  }
};

exports.updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, message, type, link, is_active, image_url, placement, object_fit, banner_height } = req.body || {};

    const patch = { updated_at: new Date().toISOString() };
    if (title !== undefined) patch.title = title;
    if (message !== undefined) patch.message = message;
    if (type !== undefined) {
      if (!["info", "promo", "warning", "update"].includes(type)) {
        return res.status(400).json({ success: false, message: "Tipe pemberitahuan tidak valid" });
      }
      patch.type = type;
    }
    if (link !== undefined) patch.link = link || null;
    if (is_active !== undefined) patch.is_active = !!is_active;
    if (image_url !== undefined) patch.image_url = image_url || null;
    if (placement !== undefined) {
      if (!PLACEMENTS.includes(placement)) {
        return res.status(400).json({ success: false, message: "Penempatan banner tidak valid" });
      }
      patch.placement = placement;
    }
    if (object_fit !== undefined) {
      if (!OBJECT_FITS.includes(object_fit)) {
        return res.status(400).json({ success: false, message: "Mode ukuran gambar tidak valid" });
      }
      patch.object_fit = object_fit;
    }
    if (banner_height !== undefined) {
      if (!validBannerHeight(banner_height)) {
        return res.status(400).json({ success: false, message: "Tinggi banner harus angka antara 40–2000" });
      }
      patch.banner_height = banner_height ? Number(banner_height) : null;
    }

    const { data, error } = await supabase
      .from("notifications")
      .update(patch)
      .eq("id", id)
      .select(NOTIFICATION_SELECT)
      .single();

    if (error) throw error;
    res.json({ success: true, message: "Pemberitahuan diperbarui", data });
  } catch (err) {
    next(err);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true, message: "Pemberitahuan dihapus" });
  } catch (err) {
    next(err);
  }
};

async function logCheckin({ status, message, ticketCode, attendee, order, event, scannedBy }) {
  try {
    const { error } = await supabase.from("checkin_logs").insert({
      ticket_code: ticketCode,
      status,
      message,
      attendee_id: attendee?.id || null,
      order_id: order?.id || attendee?.order_id || null,
      event_id: event?.id || attendee?.event_id || null,
      scanned_by: scannedBy || null,
    });
    if (error) console.error("checkin_log insert error:", error.message);
  } catch (err) {
    console.error("checkin_log insert failed:", err.message);
  }
}

exports.listCheckinLogs = async (req, res, next) => {
  try {
    const { status, from, to } = req.query || {};
    const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const VALID = ["success", "already_checked_in", "not_found", "not_paid", "invalid"];
    if (status && !VALID.includes(status)) {
      return res.status(400).json({ success: false, message: "Status filter tidak valid" });
    }

    let query = supabase
      .from("checkin_logs")
      .select("id, ticket_code, status, message, attendee_id, order_id, event_id, scanned_by, scanned_at", { count: "exact" });

    if (status) query = query.eq("status", status);
    if (from) query = query.gte("scanned_at", from);
    if (to) query = query.lte("scanned_at", to);

    const { data, error, count } = await query.order("scanned_at", { ascending: false }).range(offset, offset + limit - 1);
    if (error) throw error;

    const ids = [...new Set((data || []).map((l) => l.scanned_by).filter(Boolean))];
    let scanners = {};
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, display_name").in("id", ids);
      scanners = Object.fromEntries((profs || []).map((p) => [p.id, p.display_name || "-"]));
    }

    res.json({
      success: true,
      data: {
        logs: (data || []).map((l) => ({ ...l, scanner_name: scanners[l.scanned_by] || "-" })),
        total: count || 0,
        limit,
        offset,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.checkIn = async (req, res, next) => {
  try {
    const { code } = req.body || {};
    const normalized = String(code || "").trim();
    if (!normalized) {
      await logCheckin({ status: "invalid", message: "Kode QR wajib diisi", ticketCode: normalized, scannedBy: req.admin?.id });
      return res.status(400).json({ success: false, message: "Kode QR wajib diisi" });
    }

    let { data: attendee } = await supabase
      .from("attendees")
      .select("id, order_id, event_id, ticket_code, full_name, email, is_checked_in, checked_in_at")
      .eq("ticket_code", normalized)
      .maybeSingle();

    if (!attendee) {
      const { data: orderByCode } = await supabase
        .from("orders")
        .select("id")
        .eq("order_code", normalized)
        .maybeSingle();

      if (orderByCode) {
        const { data: atts } = await supabase
          .from("attendees")
          .select("id, order_id, event_id, ticket_code, full_name, email, is_checked_in, checked_in_at")
          .eq("order_id", orderByCode.id)
          .limit(1);
        attendee = atts?.[0] || null;
      }
    }

    if (!attendee) {
      await logCheckin({ status: "not_found", message: "QR tidak dikenali. Tiket tidak ditemukan.", ticketCode: normalized, scannedBy: req.admin?.id });
      return res.status(404).json({ success: false, message: "QR tidak dikenali. Tiket tidak ditemukan." });
    }

    const [orderRes, eventRes] = await Promise.all([
      supabase.from("orders").select("order_code, status, total_amount, paid_at").eq("id", attendee.order_id).maybeSingle(),
      supabase.from("events").select("title, event_date, event_time, location, city").eq("id", attendee.event_id).maybeSingle(),
    ]);

    const order = orderRes.data;
    const event = eventRes.data;

    if (!order || order.status !== "paid") {
      const reason = !order ? "order tidak ditemukan" : order.status;
      await logCheckin({
        status: "not_paid",
        message: `Tiket belum dapat digunakan (status: ${reason}). Pastikan pembayaran sudah lunas.`,
        ticketCode: normalized,
        attendee,
        order,
        event,
        scannedBy: req.admin?.id,
      });
      return res.status(400).json({
        success: false,
        message: `Tiket belum dapat digunakan (status: ${reason}). Pastikan pembayaran sudah lunas.`,
      });
    }

    const base = {
      attendee: {
        id: attendee.id,
        ticket_code: attendee.ticket_code,
        full_name: attendee.full_name,
        email: attendee.email,
        is_checked_in: attendee.is_checked_in,
        checked_in_at: attendee.checked_in_at,
      },
      order: {
        order_code: order.order_code,
        status: order.status,
        total_amount: order.total_amount,
        paid_at: order.paid_at,
      },
      event: event
        ? {
            title: event.title,
            event_date: event.event_date,
            event_time: event.event_time,
            location: event.location,
            city: event.city,
          }
        : null,
    };

    if (attendee.is_checked_in) {
      const msg = `Tiket sudah check-in pada ${attendee.checked_in_at ? new Date(attendee.checked_in_at).toLocaleString("id-ID") : "-"}.`;
      await logCheckin({ status: "already_checked_in", message: msg, ticketCode: normalized, attendee, order, event, scannedBy: req.admin?.id });
      return res.status(409).json({
        success: false,
        message: msg,
        data: base,
      });
    }

    const now = new Date().toISOString();
    const { error: updErr } = await supabase
      .from("attendees")
      .update({ is_checked_in: true, checked_in_at: now })
      .eq("id", attendee.id);
    if (updErr) throw updErr;

    await logCheckin({
      status: "success",
      message: "Check-in berhasil",
      ticketCode: normalized,
      attendee,
      order,
      event,
      scannedBy: req.admin?.id,
    });

    res.json({
      success: true,
      message: "Check-in berhasil. Selamat menikmati acara!",
      data: {
        ...base,
        attendee: { ...base.attendee, is_checked_in: true, checked_in_at: now },
      },
    });
  } catch (err) {
    next(err);
  }
};
