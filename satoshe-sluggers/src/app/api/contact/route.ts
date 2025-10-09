import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();


    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_DOMAIN ? `Satoshe Marketplace <noreply@${process.env.EMAIL_DOMAIN}>` : 'onboarding@resend.dev', // Use default if domain not verified
      to: [process.env.CONTACT_EMAIL || 'contact@yourdomain.com'], // Replace with your contact email
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #FF0099; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>

          <div style="background-color: white; padding: 20px; border-left: 4px solid #FF0099; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #777;">
              This message was sent from the Satoshe Marketplace contact form.
            </p>
          </div>
        </div>
      `,
      // Also send a plain text version
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

This message was sent from the Satoshe Marketplace contact form.
      `,
      // Optional: Send a copy to the sender
      replyTo: email,
    });

    if (error) {
      console.error('Resend error details:', {
        error,
        from: process.env.EMAIL_DOMAIN ? `Satoshe Marketplace <noreply@${process.env.EMAIL_DOMAIN}>` : 'onboarding@resend.dev',
        to: process.env.CONTACT_EMAIL,
        domain: process.env.EMAIL_DOMAIN,
        apiKeyPresent: !!process.env.RESEND_API_KEY
      });
      return NextResponse.json(
        { error: `Failed to send email: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Optional: Send a confirmation email to the sender
    try {
      await resend.emails.send({
        from: process.env.EMAIL_DOMAIN ? `Satoshe Marketplace <noreply@${process.env.EMAIL_DOMAIN}>` : 'onboarding@resend.dev', // Use default if domain not verified
        to: [email],
        subject: 'Thank you for contacting Satoshe Marketplace',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #FF0099; padding-bottom: 10px;">
              Thank You for Your Message!
            </h2>

            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Hi ${name},
            </p>

            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Thank you for reaching out to us! We've received your message and will get back to you as soon as possible.
            </p>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Message:</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Best regards,<br>
              The Satoshe Marketplace Team
            </p>

            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; font-size: 14px; color: #777;">
                This is an automated confirmation email. Please do not reply to this message.
              </p>
            </div>
          </div>
        `,
      });
    } catch (confirmationError) {
      // Don't fail the main request if confirmation email fails
      console.warn('Failed to send confirmation email:', confirmationError);
    }

    return NextResponse.json(
      {
        message: 'Email sent successfully',
        id: data?.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
