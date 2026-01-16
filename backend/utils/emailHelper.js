import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 2525,              // ✅ Render-safe port
  secure: false,           // ✅ REQUIRED
  auth: {
    user: "apikey",        // ✅ MUST be exactly "apikey"
    pass: process.env.SENDGRID_API_KEY,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Optional but VERY useful
await transporter.verify();
console.log("SMTP connection verified");

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `Kavya Arts&crafts <${process.env.EMAIL_FROM}>`, // must be verified sender
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};
