/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateRequest((e) => {
  try {
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: e.record.get("email") }],
      subject: "Password Reset Confirmation",
      html: "<h1>Password Reset</h1>" +
            "<p>Your password has been successfully reset.</p>" +
            "<p>If you did not request this change, please contact our support team immediately.</p>" +
            "<p><a href='https://yourstore.com/login'>Log In to Your Account</a></p>" +
            "<p>For security reasons, we recommend:</p>" +
            "<ul>" +
            "<li>Using a strong, unique password</li>" +
            "<li>Not sharing your password with anyone</li>" +
            "<li>Logging out from other devices if you suspect unauthorized access</li>" +
            "</ul>" +
            "<p>Thank you for keeping your account secure!</p>"
    });
    $app.newMailClient().send(message);
  } catch (err) {
    console.log("Password reset email failed:", err);
  }
}, "users");
