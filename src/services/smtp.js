import nodemailer from "nodemailer";
import "dotenv/config";
import cache from "./cache.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const generateOTP = () => {
  return crypto.randomInt(100000, 999999);
}

const sendVerifyEmail = async (addr) => {
  const pin = generateOTP();
  try {
    const tmp = cache.set(`verify:${addr}`, pin)
    const mail = transporter.sendMail({
      from: `"LeetBase" <${process.env.SMTP_SENDER}>`,
      to: `${addr}`,
      subject: "Welcome to LeetBase! Confirm your email",
      html: ` <!DOCTYPE html><html><head>${css}</head><body><div class="container"><h1>Welcome to LeetBase!</h1><p>Thank you for signing up. Please confirm your email using the verification code below:</p><div class="pin">${pin}</div><p>If you didn’t sign up for LeetBase, please ignore this email.</p></div></body></html>`,
    });

    await Promise.all([tmp, mail]);
    console.log("[SMTP]: Verify Message sent: %s", mail.messageId);
  } catch (error) {
    throw new Error(`Error sending email to ${addr}`);
  }
}

const sendResetPasswordEmail = async (addr) => {
  const pin = generateOTP();
  try {
    const tmp = cache.set(`reset:${addr}`, pin);
    const mail = transporter.sendMail({
      from: `"LeetBase" <${process.env.SMTP_SENDER}>`,
      to: `${addr}`,
      subject: "LeetBase Password Reset Request",
      html: `<!DOCTYPE html><html><head>${css}</head><body><div class="container"><h1>Reset Your LeetBase Password</h1><p>We received a request to reset your password. Use the verification code below to proceed:</p><div class="pin">${pin}</div><p>If you didn’t request a password reset, please ignore this email.</p></div></body></html>`
    });

    await Promise.all([tmp, mail]);
    console.log("[SMTP]: Password Reset Message sent: %s", mail.messageId);
  } catch (error) {
    throw new Error(`Error sending password reset email to ${addr}`);
  }
}

const css = `
<style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      background: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h1 {
      color: #333;
    }
    p {
      font-size: 18px;
      color: #555;
    }
    .pin {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 4px;
      background: #eee;
      display: inline-block;
      padding: 10px 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
  </style>
`

export { sendVerifyEmail, sendResetPasswordEmail };
