import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { content, prompt } = await req.json();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter
    await transporter.verify();

    const mailOptions = {
      from: `"AI Email Generator" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `AI Generated Email: ${prompt.substring(0, 50)}...`,
      text: content,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #333;">AI Generated Email</h2>
          <p><strong>Prompt:</strong> ${prompt}</p>
          <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
            ${content.replace(/\n/g, '<br>')}
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully', id: info.messageId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to send email', details: 'Unknown error' },
      { status: 500 }
    );
  }
} 