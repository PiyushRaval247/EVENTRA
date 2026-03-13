"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";

export const sendTicketEmail = action({
  args: {
    attendeeEmail: v.string(),
    attendeeName: v.string(),
    eventTitle: v.string(),
    eventDate: v.string(),
    eventLocation: v.string(),
    qrCode: v.string(),
  },
  handler: async (ctx, args) => {
    const { attendeeEmail, attendeeName, eventTitle, eventDate, eventLocation, qrCode } = args;

    // Use SMTP environment variable
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,       // Your Gmail address
        pass: process.env.SMTP_APP_PASSWORD // 16-character App Password
      },
    });

    try {
      await transporter.sendMail({
        from: `"EVENTRA" <${process.env.SMTP_EMAIL}>`,
        to: attendeeEmail,
        subject: `Your Ticket for ${eventTitle}!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
            <h1 style="color: #1e3a8a; margin-bottom: 24px;">Your Event Ticket</h1>
            
            <p>Hi <strong>${attendeeName}</strong>,</p>
            <p>You're all set! You've successfully registered for <strong>${eventTitle}</strong>.</p>
            
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <h2 style="font-size: 18px; margin-top: 0;">Event Details</h2>
              <p style="margin: 4px 0;"><strong>Date:</strong> ${eventDate}</p>
              <p style="margin: 4px 0;"><strong>Location:</strong> ${eventLocation}</p>
            </div>

            <div style="text-align: center; margin: 32px 0; padding: 20px; border: 2px dashed #cbd5e0; border-radius: 8px;">
              <p style="margin-bottom: 16px; font-weight: bold; color: #4a5568;">Your Check-in QR Code</p>
              
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}" 
                alt="Ticket QR Code" 
                style="display: block; margin: 0 auto; width: 200px; height: 200px;"
              />
              
              <p style="margin-top: 16px; font-family: monospace; color: #718096; font-size: 12px;">
                Ticket ID: ${qrCode}
              </p>
            </div>
            
            <p style="font-size: 14px; color: #718096; margin-top: 32px;">
              Please show this QR code at the entrance for a smooth check-in.
            </p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            
            <p style="font-size: 12px; color: #a0aec0; text-align: center;">
              Sent with ❤️ by EVENTRA
            </p>
          </div>
        `,
      });

      return { success: true };
    } catch (err) {
      console.error("Nodemailer Error:", err);
      return { success: false, error: err.message };
    }
  },
});
