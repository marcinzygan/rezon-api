const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Email options
  const mailOptions = {
    from: "Marcin Zygan <grafik.marcin@rezon.eu>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // 3) Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
