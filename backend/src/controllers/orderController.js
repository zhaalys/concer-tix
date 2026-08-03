const supabase = require("../lib/supabase");

function generateOrderCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TIX-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function generateTicketCode() {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return rand;
}

async function enrichOrder(order) {
  if (!order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("ticket_label, quantity, unit_price, subtotal, events!inner(title, event_date, event_time, location, image_url, slug)")
    .eq("order_id", order.id);

  const { data: attendees } = await supabase
    .from("attendees")
    .select("ticket_code, full_name, email, whatsapp, identity_type, identity_number, booker_name, gender, age, domicile")
    .eq("order_id", order.id);

  const firstItem = items?.[0];
  return {
    id: order.id,
    order_code: order.order_code,
    status: order.status,
    total_amount: order.total_amount,
    payment_method: order.payment_method,
    payment_token: order.payment_token,
    paid_at: order.paid_at,
    created_at: order.created_at,
    updated_at: order.updated_at,
    event: firstItem?.events || null,
    items: items || [],
    attendees: attendees || [],
  };
}

exports.createOrder = async (req, res, next) => {
  try {
    const {
      user_id, event_slug, category, unit_price,
      quantity, full_name, email, whatsapp,
      identity_type, identity_number,
      gender, age, domicile, booker_name,
    } = req.body;

    if (!user_id || !event_slug || !full_name || !email || !whatsapp || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const { data: event, error: evErr } = await supabase
      .from("events")
      .select("id, title")
      .eq("slug", event_slug)
      .single();

    if (evErr || !event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const { data: staleOrders, error: staleErr } = await supabase
      .from("orders")
      .select("id, order_items!inner(order_id)")
      .eq("user_id", user_id)
      .eq("status", "pending")
      .eq("order_items.event_id", event.id);

    if (staleErr) throw staleErr;

    if (staleOrders && staleOrders.length > 0) {
      await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .in("id", staleOrders.map((o) => o.id));
    }

    const { data: ticket, error: tkErr } = await supabase
      .from("event_tickets")
      .select("id")
      .eq("event_id", event.id)
      .eq("label", category)
      .maybeSingle();

    if (tkErr) throw tkErr;

    const qty = quantity || 1;
    const subtotal = unit_price * qty;
    const orderCode = generateOrderCode();

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id,
        order_code: orderCode,
        status: "pending",
        total_amount: subtotal,
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    const { data: orderItem, error: itemErr } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        event_id: event.id,
        ticket_id: ticket?.id || null,
        ticket_label: category,
        quantity: qty,
        unit_price: unit_price,
        subtotal: subtotal,
      })
      .select()
      .single();

    if (itemErr) throw itemErr;

    const ticketCode = generateTicketCode();

    const { error: attErr } = await supabase.from("attendees").insert({
      order_id: order.id,
      order_item_id: orderItem.id,
      event_id: event.id,
      user_id,
      ticket_code: ticketCode,
      full_name,
      email,
      whatsapp,
      identity_type: identity_type || null,
      identity_number: identity_number || null,
      gender: gender || null,
      age: age ? parseInt(age, 10) : null,
      domicile: domicile || null,
      booker_name: booker_name || null,
    });

    if (attErr) throw attErr;

    const enriched = await enrichOrder(order);

    res.status(201).json({
      success: true,
      data: enriched,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrderHistory = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ success: false, message: "user_id required" });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const visibleOrders = (orders || []).filter(
      (o) => o.status !== "cancelled" && !(o.status === "pending" && !o.payment_token)
    );

    const enriched = await Promise.all((visibleOrders || []).map(enrichOrder));

    res.json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
};

exports.getOrderByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_code", code)
      .single();

    if (error || !order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const enriched = await enrichOrder(order);

    res.json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { status, payment_method, payment_token, payment_url } = req.body;

    const updateData = { status };
    if (status === "paid") updateData.paid_at = new Date().toISOString();
    if (payment_method) updateData.payment_method = payment_method;
    if (payment_token) updateData.payment_token = payment_token;
    if (payment_url) updateData.payment_url = payment_url;

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("order_code", code)
      .select()
      .single();

    if (error) throw error;

    const enriched = await enrichOrder(data);

    res.json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
};
