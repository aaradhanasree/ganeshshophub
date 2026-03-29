//// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  try {
    const status = e.record.get("status");
    const originalStatus = e.record.original().get("status");
    
    if (status !== originalStatus && (status === "processing" || status === "shipped" || status === "delivered")) {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: e.record.get("email") || "customer@example.com" }],
        subject: "Order #" + e.record.id + " - Status Update: " + status,
        html: "<h1>Order Status Update</h1>" +
              "<p><strong>Order ID:</strong> " + e.record.id + "</p>" +
              "<p><strong>New Status:</strong> " + status + "</p>" +
              (status === "shipped" ? "<p><strong>Tracking Info:</strong> Your order is on its way!</p>" : "") +
              (status === "delivered" ? "<p><strong>Delivered:</strong> Your order has been delivered. Thank you for your purchase!</p>" : "") +
              "<p>We appreciate your business!</p>"
      });
      $app.newMailClient().send(message);
    }
  } catch (err) {
    console.log("Order status update email failed:", err);
  }
  e.next();
}, "orders");