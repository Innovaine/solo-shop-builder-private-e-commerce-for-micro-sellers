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

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  const resetLink = `${appUrl}/auth/reset-password?token=${token}`

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@soloshop.com',
    to: email,
    subject: 'Reset your Solo Shop password',
    text: `Click this link to reset your password:\n\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B4C63;">Reset your password</h2>
        <p>Click the button below to reset your Solo Shop password:</p>
        <a href="${resetLink}" style="display: inline-block; background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
        <p style="color: #64748B; font-size: 14px;">Or copy and paste this link into your browser:<br/>${resetLink}</p>
        <p style="color: #64748B; font-size: 12px;">This link expires in 1 hour.</p>
        <p style="color: #64748B; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

// FR-35 & FR-36: Send order confirmation email with custom template
export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  shopName: string,
  orderSummary: string,
  trackingUrl: string | null,
  customTemplate?: string | null
): Promise<void> {
  const defaultTemplate = `Hi {{customerName}},

Thank you for your order!

{{orderSummary}}

{{trackingInfo}}

If you have any questions, please reply to this email.

Best regards,
{{shopName}}`;

  const template = customTemplate || defaultTemplate;
  
  // Replace template variables
  let emailBody = template
    .replace(/\{\{customerName\}\}/g, customerName)
    .replace(/\{\{shopName\}\}/g, shopName)
    .replace(/\{\{orderSummary\}\}/g, orderSummary);

  // Handle tracking URL conditionally
  if (trackingUrl) {
    emailBody = emailBody.replace(
      /\{\{trackingUrl\}\}/g,
      trackingUrl
    ).replace(
      /\{\{trackingInfo\}\}/g,
      `Track your order: ${trackingUrl}`
    );
  } else {
    emailBody = emailBody
      .replace(/\{\{trackingUrl\}\}/g, 'Not available yet')
      .replace(/\{\{trackingInfo\}\}/g, "We'll send you tracking information once your order ships.");
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@soloshop.com',
    to: customerEmail,
    subject: `Order Confirmation - ${shopName}`,
    text: emailBody,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #3B4C63; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">Order Confirmation</h2>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">${shopName}</p>
        </div>
        <div style="padding: 24px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
          <div style="white-space: pre-wrap; line-height: 1.6; color: #1F2937;">
            ${emailBody.replace(/\n/g, '<br/>')}
          </div>
        </div>
        <p style="color: #64748B; font-size: 12px; text-align: center; margin-top: 16px;">
          Powered by Solo Shop Builder
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Generic email sending function for custom use cases (refunds, etc.)
export async function sendEmail(options: {
  to: string
  subject: string
  text: string
  html?: string
}): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@soloshop.com',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html || options.text.replace(/\n/g, '<br/>'),
  }

  await transporter.sendMail(mailOptions)
}
