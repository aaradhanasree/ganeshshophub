//// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  try {
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: e.record.get("email") }],
      subject: "Welcome to Our Store!",
      html: "<h1>Welcome, " + (e.record.get("firstName") || e.record.get("name") || "Customer") + "!</h1>" +
            "<p>Thank you for creating an account with us.</p>" +
            "<p>Your account has been successfully created and is ready to use.</p>" +
            "<p><a href='https://yourstore.com/products'>Browse Our Products</a></p>" +
            "<p>If you have any questions, feel free to contact our support team.</p>" +
            "<p>Happy shopping!</p>"
    });
    $app.newMailClient().send(message);
  } catch (err) {
    console.log('welcome-email hook skipped:', err);
  }
  e.next();
}, "users");