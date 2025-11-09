const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
// console.log(transporter);
exports.sendBookingEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Eventify" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(info);
    return info;
    // console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};
