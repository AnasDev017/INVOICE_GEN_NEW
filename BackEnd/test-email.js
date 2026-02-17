import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
import path from 'path';

// Load env from current directory
configDotenv({ path: path.join(process.cwd(), '.env') });

console.log("Testing Email Configuration with service: 'gmail'...");
console.log("SMTP_USER:", process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, 
      subject: "Test Email from Invoice Generator",
      text: "If you receive this, the email configuration is correct.",
    });
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
}

sendTestEmail();
