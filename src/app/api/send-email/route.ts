/** @format */

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Changed back to false for STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    minVersion: "TLSv1.2",
    ciphers: "HIGH",
    rejectUnauthorized: true,
  },
});

// Verify transporter connection
transporter.verify(function (error) {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to take our messages");
  }
});

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send main email to recipient
    const mainMailOptions = {
      from: process.env.SMTP_USER,
      replyTo: `"${name}" <${email}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: message,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .email-container {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              border-bottom: 2px solid #2563eb;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .content {
              margin: 20px 0;
            }
            .message-box {
              background-color: #f8fafc;
              border-left: 4px solid #2563eb;
              padding: 15px;
              margin: 15px 0;
              border-radius: 4px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
              font-size: 0.9em;
              color: #64748b;
            }
            .label {
              font-weight: 600;
              color: #1e40af;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2 style="color: #1e40af; margin: 0;">New Contact Form Submission</h2>
            </div>
            <div class="content">
              <p><span class="label">Name:</span> ${name}</p>
              <p><span class="label">Email:</span> ${email}</p>
              <div class="message-box">
                <p class="label">Message:</p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            <div class="footer">
              <p>This message was sent through your portfolio contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send confirmation email to sender
    const confirmationMailOptions = {
      from: `"Jick Lampago" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thank you for your message",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You for Your Message</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .email-container {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .content {
              margin: 20px 0;
            }
            .message-box {
              background-color: #f8fafc;
              border-left: 4px solid #2563eb;
              padding: 15px;
              margin: 15px 0;
              border-radius: 4px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
              font-size: 0.9em;
              color: #64748b;
              text-align: center;
            }
            .signature {
              margin-top: 25px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
            }
            .social-links {
              margin-top: 15px;
              text-align: center;
            }
            .social-links a {
              color: #2563eb;
              text-decoration: none;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2 style="color: #1e40af; margin: 0;">Thank You for Contacting Me</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for reaching out through my portfolio website. I have received your message and will get back to you as soon as possible.</p>
              
              <div class="message-box">
                <p style="font-weight: 600; margin-bottom: 10px;">Your Message:</p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>

              <div class="signature">
                <p>Best regards,<br><strong>Jick Lampago</strong></p>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated response. Please do not reply directly to this email.</p>
              <div class="social-links">
                <p>Connect with me:</p>
                <a href="https://linkedin.com/in/yourusername" style="margin: 0 10px;">LinkedIn</a> |
                <a href="https://github.com/yourusername" style="margin: 0 10px;">GitHub</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mainMailOptions),
      transporter.sendMail(confirmationMailOptions),
    ]);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
