//// <reference path="../pb_data/types.d.ts" />
onRecordAfterDeleteSuccess((e) => {
  try {
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: e.record.get("email") || "customer@example.com" }],
      subject: "Order Cancellation Confirmation #" + e.record.id,
      html: "<h1>Order Cancelled</h1>" +
            "<p><strong>Order ID:</strong> " + e.record.id + "</p>" +
            "<p>Your order has been successfully cancelled.</p>" +
            "<p><strong>Refund Information:</strong></p>" +
            "<p>Your refund of \u20b9" + e.record.get("totalAmount") + " will be processed to your original payment method within 5-7 business days.</p>" +
            "<p>If you have any questions about your cancellation or refund, please contact our support team.</p>" +
            "<p>We hope to see you again soon!</p>"
    });
    $app.newMailClient().send(message);
  } catch (err) {
    console.log("Order cancellation email failed:", err);
  }
  e.next();
}, "orders");