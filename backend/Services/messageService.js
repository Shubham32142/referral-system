import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// Setup Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Twilio Client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

//send email

export async function sendEmail(to, subject, message) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text: message,
    });
    return { success: true, message: "Email send successfully!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function sendSMS(to, message) {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log("sms sent:", response.sid, "status", response.status);
    return { success: true, message: "SMS sent successfully!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
