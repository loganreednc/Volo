import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { recipientEmail, matchName } = req.body;

  if (!recipientEmail || !matchName) {
    return res.status(400).json({ message: "Missing recipientEmail or matchName" });
  }

  // Configure the email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use other services (e.g., Outlook, SMTP)
    auth: {
      user: process.env.EMAIL_USER, // Your email (set in .env)
      pass: process.env.EMAIL_PASS, // App password (set in .env)
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: "🎉 You've Got a New Match!",
    text: `Hi there! You have a new match with ${matchName}. Check your dashboard for details.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Error sending email" });
  }
}
