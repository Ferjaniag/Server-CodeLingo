const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "codelingo950@gmail.com",
    pass: "",
  },
});

module.exports = sendEmail;
