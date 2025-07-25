require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "FRONTEND")));

app.post("/send", (req, res) => {
  const { user_name, user_email, user_phone, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: user_email,
    to: process.env.EMAIL_USER,
    subject: `New Contact from ${user_name}`,
    text: `
      Name: ${user_name}
      Email: ${user_email}
      Phone: ${user_phone}
      Message: ${message}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Failed to send message");
    } else {
      console.log("Email sent Succesfully");
      res.redirect("/");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at PORT:${PORT}`);
});