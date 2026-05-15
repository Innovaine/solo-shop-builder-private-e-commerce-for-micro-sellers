// Email sending utility using nodemailer
// ASSUMPTION: SMTP credentials are configured in environment variables

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendMagicLinkEmail(
  email: string,
  token: string
): Promise<void> {
  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  const magicLink = `${appUrl}/auth/verify?token=${token}`

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@soloshop.com',
    to: email,
    subject: 'Sign in to Solo Shop Builder',
    text: `Click this link to sign in to Solo Shop Builder:\n\n${magicLink}\n\nThis link expires in 15 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B4C63;">Sign in to Solo Shop Builder</h2>
        <p>Click the button below to sign in or create your account:</p>
        <a href="${magicLink}" style="display: inline-block; background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Sign In</a>
        <p style="color: #64748B; font-size: 14px;">Or copy and paste this link into your browser:<br/>${magicLink}</p>
        <p style="color: #64748B; font-size: 12px;">This link expires in 15 minutes.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
