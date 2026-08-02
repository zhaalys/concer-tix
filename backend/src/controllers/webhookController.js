const supabase = require("../lib/supabase");
const midtransClient = require('midtrans-client');
const config = require('../config');

const coreApi = new midtransClient.CoreApi({
  isProduction: config.midtrans.isProduction,
  serverKey: config.midtrans.serverKey,
});

exports.midtransNotification = async (req, res, next) => {
  let notification;
  try {
    notification = await coreApi.transaction.notification(req.body);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }

  try {
    const rawOrderId = notification.order_id;
    const orderId = rawOrderId.replace(/\.retry\.\d+$/, "");
    const transactionStatus = notification.transaction_status;
    const paymentType = notification.payment_type;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "No order_id" });
    }

    let status;
    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      status = "paid";
    } else if (transactionStatus === "pending") {
      status = "pending";
    } else if (["deny", "cancel", "expire"].includes(transactionStatus)) {
      status = "cancelled";
    } else {
      status = "pending";
    }

    const updateData = {
      status,
      payment_method: String(paymentType || "").replace(/_/g, " "),
      payment_token: orderId,
    };
    if (status === "paid") {
      updateData.paid_at = new Date().toISOString();
    }

    // Try wristband orders first, then regular orders
    const { data: wbData, error: wbErr } = await supabase
      .from("wristband_orders")
      .update(updateData)
      .eq("order_code", orderId)
      .select()
      .maybeSingle();

    if (wbErr) throw wbErr;

    if (!wbData) {
      // Try regular orders
      await supabase
        .from("orders")
        .update(updateData)
        .eq("order_code", orderId);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
