const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Use the cors middleware
app.use(cors());

// Middleware to parse JSON data
app.use(express.json());

// Route to handle email sending
app.post("/send-email", (req, res) => {
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

app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

// Serve static files from the "public" folder
app.use(express.static("public"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
