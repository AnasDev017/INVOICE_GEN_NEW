import { transporter } from "./Email.confiq.js";

export  const sendVerificationMail = async (email, verificationCode, verificationLink) => {
  try {
    const htmlContent = `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; }
          .hero { padding: 28px 20px !important; }
          .code-box { font-size: 28px !important; letter-spacing: 3px !important; }
          .btn { display: block !important; width: 100% !important; }
        }
      </style>
    </head>
    <body style="margin:0;padding:0;background:#ffffff;color:#111111;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;padding:30px 0;">
        <tr>
          <td align="center">
            <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:600px;max-width:600px;border-collapse:collapse;">
              <tr>
                <td style="padding:24px 20px 8px;text-align:left;">
                  <span style="display:inline-block;background:#000;color:#fff;padding:8px 12px;font-weight:700;border-radius:4px;font-size:14px;">Invoice-Gen</span>
                </td>
              </tr>
              <tr>
                <td class="hero" style="background:#000;color:#fff;padding:36px;border-radius:8px 8px 4px 4px;text-align:left;">
                  <h1 style="margin:0;font-size:22px;line-height:1.2;font-weight:700;letter-spacing:0.2px;color:#fff;">Verify your email address</h1>
                  <p style="margin:12px 0 0;font-size:15px;line-height:1.5;color:#e6e6e6;">You're one step away. Use the verification code below to confirm your email.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 20px 10px;background:#fff;text-align:center;">
                  <div style="display:inline-block;padding:22px 28px;border:1px solid #111;border-radius:8px;background:#f9f9f9;">
                    <p style="margin:0;font-size:13px;color:#555;text-transform:uppercase;letter-spacing:1px;font-weight:600">Your verification code</p>
                    <div class="code-box" style="margin-top:10px;font-family: 'Courier New', Courier, monospace;font-size:32px;letter-spacing:6px;background:#111;color:#fff;padding:12px 18px;border-radius:6px;display:inline-block;">
                      <strong style="letter-spacing:6px;">${verificationCode}</strong>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 20px 22px;text-align:center;">
                  <a class="btn" href="${verificationLink}" style="text-decoration:none;display:inline-block;padding:12px 20px;border-radius:6px;border:1px solid #111;background:#fff;color:#111;font-weight:700;font-size:15px;">Verify Email</a>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 20px 22px;color:#555;font-size:13px;line-height:1.5;text-align:left;">
                  <p style="margin:0 0 8px;">If the button doesn't work, copy and paste this URL into your browser:</p>
                  <p style="margin:0;font-size:12px;color:#111;word-break:break-all;">${verificationLink}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 20px;border-top:1px solid #eee;color:#777;font-size:12px;text-align:left;">
                  <p style="margin:0 0 6px;">If you didn't request this, you can ignore this email — no changes will be made.</p>
                  <p style="margin:0;">© <strong style="font-weight:700;color:#111;">Invoice-Gen</strong></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const info = await transporter.sendMail({
      from: '"InvoiceGen" <invoicegenbusiness@gmail.com>',
      to: email,
      subject: "Email Verification ✔",
       html: htmlContent,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    // Re-throw the error so signup knows it failed
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

export const welcomeMail = async(email) =>{
    try{
      const htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to Invoice Gen</title>
<style>
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        color: #000000;
    }
    .email-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        border: 1px solid #ddd;
    }
    .header {
        background-color: #000000;
        color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .body {
        padding: 30px 20px;
        text-align: left;
        line-height: 1.6;
    }
    .body h2 {
        color: #000000;
    }
    .body p {
        color: #333333;
    }
    .cta-button {
    display: inline-block;
    padding: 12px 25px;
    margin: 20px 0;
    background-color: #000000;
    color: #ffffff !important; /* force white */
    text-decoration: none;
    font-weight: bold;
    border-radius: 5px;
}
    .footer {
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #777777;
        border-top: 1px solid #ddd;
    }
    @media screen and (max-width: 600px) {
        .body {
            padding: 20px 15px;
        }
        .cta-button {
            padding: 10px 20px;
        }
    }
</style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            Invoice Gen
        </div>
        <div class="body">
            <h2>Welcome to Invoice Gen!</h2>
            <p>Hi there,</p>
            <p>Thank you for verifying your email. Your account is now active and ready to use. Start creating professional invoices quickly and efficiently.</p>
            <a href="https://yourwebsite.com/login" class="cta-button">Go to Dashboard</a>
            <p>If you did not create an account with us, please ignore this email.</p>
            <p>Cheers,<br><strong>The Invoice Gen Team</strong></p>
        </div>
        <div class="footer">
            &copy; 2025 Invoice Gen. All rights reserved.
        </div>
    </div>
</body>
</html>

      `
      const info = await transporter.sendMail({
        from: '"InvoiceGen" <invoicegenbusiness@gmail.com>',
        to: email,
        subject: "WellCome ✔",
         html: htmlContent,
      });
    console.log("Email sent: ", info.messageId);

    } catch (error) {
    console.log(error);  
    }
}