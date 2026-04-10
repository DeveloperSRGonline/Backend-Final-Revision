const Razorpay = require("razorpay");
const productModel = require("../models/product.model");
const paymentModel = require("../models/payment.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createOrder(req, res) {
  const product = await productModel.findOne();
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const options = {
    amount: product.price.amount * 100, // Convert to paise
    currency: product.price.currency,
  };

  try {
    const order = await razorpay.orders.create(options);

    const newPayment = await paymentModel.create({
      orderId: order.id,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
      status: "PENDING",
    });
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Error creating order",
        error: error.message,
      });
    }
  }
}

async function verifyPayment(req, res) {
  console.log("Payment verification request body:", req.body);
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const {
      validatePaymentVerification,
    } = require("razorpay/dist/utils/razorpay-utils");

    const result = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret,
    );
    
    if (result) {
      const payment = await paymentModel.findOne({ orderId: razorpayOrderId });
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = "COMPLETED";
      await payment.save();
      res.json({ status: "success" });
    } else {
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ 
      message: "Payment verification failed", 
      error: error.message 
    });
  }
}

module.exports = {
  createOrder,
  verifyPayment
};
