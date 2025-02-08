// pages/api/send-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, subject, text } = req.body;
  if (!email || !subject || !text) {
    return res.status(400).json({ error: 'Email, subject, and text are required' });
  }

  // Configure the nodemailer transporter
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "your_ethereal_user@example.com", // Replace with your Ethereal or production credentials
      pass: "your_ethereal_password"
    }
  });

  try {
    let info = await transporter.sendMail({
      from: '"Volo" <noreply@volo.com>',
      to: email,
      subject: subject,
      text: text,
    });
    res.status(200).json({ message: 'Email sent', info });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
