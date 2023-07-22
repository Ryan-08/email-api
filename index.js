const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Route to handle email sending
app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  // Replace these values with your own email account configuration
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "your-email@gmail.com", // Replace with your Gmail email address
      pass: "your-password", // Replace with your Gmail password
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com", // Replace with your Gmail email address
    to: "recipient@example.com", // Replace with the recipient's email address
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
