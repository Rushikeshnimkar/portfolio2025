import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { applyCors, corsMiddleware } from "@/lib/cors";

async function handler(req: NextRequest) {
  try {
    const { content, prompt, senderName, senderEmail, subject } =
      await req.json();

    // Verify email if provided
    if (senderEmail) {
      // Basic format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(senderEmail)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }

      // Verify with Abstract API
      const response = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${senderEmail}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Failed to verify email");
      }

      const data = await response.json();
      const isValid =
        data.is_valid_format.value &&
        data.deliverability === "DELIVERABLE" &&
        !data.is_disposable_email.value;

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();

    const emailSubject =
      subject || `AI Generated Email: ${prompt.substring(0, 50)}...`;

    // Create a from address that includes the name if provided
    const fromAddress = senderEmail
      ? senderName
        ? `"${senderName}" <${process.env.EMAIL_USER}>`
        : `"${senderEmail}" <${process.env.EMAIL_USER}>`
      : `"AI Email Generator" <${process.env.EMAIL_USER}>`;

    const mailOptions = {
      from: fromAddress,
      to: process.env.EMAIL_USER,
      subject: emailSubject,
      text: content,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #333;">Email Received</h2>
          ${senderName ? `<p><strong>From:</strong> ${senderName}</p>` : ""}
          ${senderEmail ? `<p><strong>Email:</strong> ${senderEmail}</p>` : ""}
          <p><strong>Subject:</strong> ${emailSubject}</p>
          ${prompt ? `<p><strong>Prompt:</strong> ${prompt}</p>` : ""}
          <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
            ${content.replace(/\n/g, "<br>")}
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    // Return more detailed information about the sent email
    return NextResponse.json(
      {
        message: "Email sent successfully",
        id: info.messageId,
        details: {
          from: fromAddress,
          subject: emailSubject,
          content: content,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to send email", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to send email", details: "Unknown error" },
      { status: 500 }
    );
  }
}

export const POST = (req: NextRequest) => applyCors(req, handler);
export const OPTIONS = (req: NextRequest) =>
  corsMiddleware(req);
