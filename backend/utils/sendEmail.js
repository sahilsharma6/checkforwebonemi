import nodemailer from "nodemailer";
import config from "../config/config.js";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    // service: config.SMTP_SERVICE,
    service: "gmail",
    auth: {
      user: "mytesting6666@gmail.com",
      pass: "mytesting6666mytesting6666",
    },
  });

  const mailOptions = {
    from: config.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
