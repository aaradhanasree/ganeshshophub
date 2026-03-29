/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateRequest((e) => {
  try {
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: e.record.get("email") || "customer@example.com" }],
      subject: "Order Confirmation #" + e.record.id,
      html: "<h1>Thank you for your order!</h1>" +
            "<p><strong>Order ID:</strong> " + e.record.id + "</p>" +
            "<p><strong>Items:</strong></p>" +
            "<pre>" + JSON.stringify(e.record.get("items"), null, 2) + "</pre>" +
            "<p><strong>Total:</strong> &#8377;" + e.record.get("totalAmount") + "</p>" +
            "<p><strong>Payment Method:</strong> " + (e.record.get("paymentMethod") || "N/A") + "</p>" +
            "<p><strong>Shipping Address:</strong></p>" +
            "<pre>" + e.record.get("shippingAddress") + "</pre>" +
            "<p>We'll notify you when your order ships!</p>"
    });
    $app.newMailClient().send(message);
  } catch (err) {
    console.log("Order confirmation email failed:", err);
  }
}, "orders");
