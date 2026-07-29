const midtransClient = require('midtrans-client');
const config = require('../config');

const snap = new midtransClient.Snap({
  isProduction: config.midtrans.isProduction,
  serverKey: config.midtrans.serverKey,
});

const createToken = async (req, res) => {
  try {
    const { orderId, amount, name, email, category, enabledPayments } = req.body;

    if (!orderId || !amount || !name || !email) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(amount),
      },
      customer_details: {
        first_name: name,
        email: email,
      },
      item_details: [
        {
          id: category?.id || 'ticket',
          price: Number(amount),
          quantity: 1,
          name: category?.label || 'Ticket',
        },
      ],
      ...(enabledPayments && enabledPayments.length > 0 && {
        enabled_payments: enabledPayments,
      }),
    };

    const token = await snap.createTransactionToken(parameter);

    res.json({ success: true, token });
  } catch (error) {
    console.error('Midtrans error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createToken };
