"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

const router = express.Router();
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});
router.get("/another", (req, res) => res.json({ route: req.originalUrl }));
router.post("/", (req, res) => res.json({ postBody: req.body }));
router.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  // Replace these values with your own email account configuration
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL, // Replace with your Gmail email address
      pass: process.env.EMAIL, // Replace with your Gmail password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL, // Replace with your Gmail email address
    to: process.env.RECIPIENT, // Replace with the recipient's email address
    subject: "New Message from Contact Form",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error:", error);
      res.status(500).json({
        success: false,
        error: "An error occurred while sending the email.",
      });
    } else {
      console.log("Email sent:", info.response);
      res.json({ success: true, message: "Email sent successfully!" });
    }
  });
});
router.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
