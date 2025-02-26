import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from.env file

let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Bypass SSL certificate verification
    },
  });
  
  export function sendMail(to, sub, msg) {
    transport.sendMail(
      {
        from: "filalliance769@gmail.com", // Sender address
        to: to, // Recipient address
        subject: sub, // Subject line
        text: msg, // Plain text body
      },
      (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );
  }