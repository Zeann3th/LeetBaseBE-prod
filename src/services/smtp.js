import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendVerifyEmail = async (addr, data) => {
  try {
    const mail = await transporter.sendMail({
      from: `"LeetBase" <${process.env.SMTP_SENDER}>`,
      to: `${addr}`,
      subject: "Welcome to LeetBase! Confirm your email",
      html: "<b>Hello world?</b>",
    });
    console.log("Message sent: %s", mail.messageId);
  } catch (error) {
    throw new Error(`Error sending email to ${addr}`);
  }
}

const sendRecoveryEmail = async (addr, data) => {
}

export { sendVerifyEmail, sendRecoveryEmail };
