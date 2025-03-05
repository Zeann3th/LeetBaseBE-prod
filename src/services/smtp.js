import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendVerifyEmail = async (addr) => {
  const pin = Math.floor(100000 + Math.random() * 900000);
  try {
    // Save to Redis
    //
    // Send email
    const mail = await transporter.sendMail({
      from: `"LeetBase" <${process.env.SMTP_SENDER}>`,
      to: `${addr}`,
      subject: "Welcome to LeetBase! Confirm your email",
      html: `<!DOCTYPE html>
<html>
<head>
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
    .copy-btn {
      background: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .copy-btn:hover {
      background: #45a049;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to LeetBase!</h1>
    <p>Thank you for signing up. Please confirm your email using the verification code below:</p>
    <div class="pin">${pin}</div>
    <button class="copy-btn" onclick="copyPin()">Copy to Clipboard</button>
    <p>If you didn’t sign up for LeetBase, please ignore this email.</p>
  </div>

  <script>
    function copyPin() {
      const pin = document.querySelector('.pin').textContent;
      navigator.clipboard.writeText(pin).then(() => {
        alert('Verification code copied!');
      }).catch(err => {
        alert('Failed to copy code');
      });
    }
  </script>
</body>
</html>`,
    });
    console.log("Message sent: %s", mail.messageId);
  } catch (error) {
    throw new Error(`Error sending email to ${addr}`);
  }
}

const sendRecoveryEmail = async (addr) => {
  try {
    const mail = await transporter.sendMail({
      from: `"LeetBase" <${process.env.SMTP_SENDER}>`,
      to: `${addr}`,
      subject: "LeetBase Password Recovery",
      html: "<b>Hello world?</b>",
    });
  } catch (error) {
    throw new Error(`Error sending email to ${addr}`);
  }
}

export { sendVerifyEmail, sendRecoveryEmail };
