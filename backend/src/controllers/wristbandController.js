const supabase = require("../lib/supabase");
const midtransClient = require('midtrans-client');
const config = require('../config');

const snap = new midtransClient.Snap({
  isProduction: config.midtrans.isProduction,
  serverKey: config.midtrans.serverKey,
});

function generateOrderCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "WB-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

exports.createWristbandOrder = async (req, res, next) => {
  try {
    const { variant, quantity, customer_name, customer_whatsapp, shipping_address, user_id } = req.body;

    if (!variant || !quantity || !customer_name || !customer_whatsapp || !shipping_address) {
      return res.status(400).json({ success: false, message: "Semua field wajib diisi" });
    }

    if (!["without_qr", "with_qr"].includes(variant)) {
      return res.status(400).json({ success: false, message: "Variant tidak valid" });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: "Quantity minimal 1" });
    }

    const unitPrice = 3500;
    const totalAmount = qty * unitPrice;
    const orderCode = generateOrderCode();

    const insertData = {
      order_code: orderCode,
      variant,
      quantity: qty,
      unit_price: unitPrice,
      total_amount: totalAmount,
      customer_name,
      customer_whatsapp,
      shipping_address,
    };
    if (user_id) insertData.user_id = user_id;

    const { data, error } = await supabase
      .from("wristband_orders")
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Pesanan wristband berhasil dibuat",
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getWristbandOrderByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    const { data, error } = await supabase
      .from("wristband_orders")
      .select("*")
      .eq("order_code", code)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.updateWristbandOrderStatus = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { status, payment_method, payment_token, payment_url } = req.body;

    const updateData = { status };
    if (status === "paid") updateData.paid_at = new Date().toISOString();
    if (payment_method) updateData.payment_method = payment_method;
    if (payment_token) updateData.payment_token = payment_token;
    if (payment_url) updateData.payment_url = payment_url;

    const { data, error } = await supabase
      .from("wristband_orders")
      .update(updateData)
      .eq("order_code", code)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getWristbandOrderHistory = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ success: false, message: "user_id required" });
    }

    const { data, error } = await supabase
      .from("wristband_orders")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: data || [] });
  } catch (err) {
    next(err);
  }
};

exports.createWristbandPaymentToken = async (req, res, next) => {
  try {
    const { orderCode } = req.body;
    if (!orderCode) {
      return res.status(400).json({ success: false, message: "orderCode required" });
    }

    const { data: order, error } = await supabase
      .from("wristband_orders")
      .select("*")
      .eq("order_code", orderCode)
      .single();

    if (error || !order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status === "paid") {
      return res.status(400).json({ success: false, message: "Order already paid" });
    }

    const orderId = `${order.order_code}.${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(order.total_amount),
      },
      customer_details: {
        first_name: order.customer_name,
        phone: order.customer_whatsapp,
      },
      item_details: [
        {
          id: order.variant,
          price: Number(order.unit_price),
          quantity: Number(order.quantity),
          name: `Wristband ${order.variant === "with_qr" ? "With QR" : "Without QR"}`,
        },
      ],
    };

    const token = await snap.createTransactionToken(parameter);

    await supabase
      .from("wristband_orders")
      .update({ payment_token: token, payment_url: orderId })
      .eq("id", order.id);

    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
};
