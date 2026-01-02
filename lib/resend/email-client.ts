import { Resend } from 'resend';
import type { ContactFormData, PerformerFormData } from '@/lib/validations';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey && !apiKey.includes('your_') ? new Resend(apiKey) : null;

if (!resend) {
  console.warn('[Resend] API key not configured. Emails disabled.');
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatPacificTimestamp = () =>
  new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'full',
    timeStyle: 'short',
  });

const formatError = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
};

export interface BookingConfirmationData {
  guestName: string;
  guestEmail: string;
  cabinName: string;
  confirmationCode: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  currency: string;
  nights: number;
  guests: number;
  cleaningFee: number;
  guestNotes?: string | null; // Optional field
}

export async function sendBookingConfirmation(
  data: BookingConfirmationData
) {
  if (!resend) {
    console.log('[Resend] Skipping email (not configured)');
    return { success: false, skipped: true };
  }

  const checkInDate = new Date(data.checkIn).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const checkOutDate = new Date(data.checkOut).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'bookings@theoutpostvfm.com',
      to: data.guestEmail,
      subject: `Booking Confirmed - ${data.cabinName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #A0563B 0%, #D97945 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Your Outpost VFM Booking is Confirmed!</h1>
          </div>

          <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; margin-top: 0;">Hello ${data.guestName},</p>

            <p style="font-size: 16px;">Great news! Your reservation at <strong>${data.cabinName}</strong> has been confirmed.</p>

            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #A0563B;">
              <h2 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #A0563B; letter-spacing: 1px;">Confirmation Code</h2>
              <p style="margin: 0; font-size: 24px; font-weight: bold; font-family: monospace; color: #333;">${data.confirmationCode}</p>
            </div>

            <h3 style="color: #A0563B; margin-top: 30px; margin-bottom: 15px;">Reservation Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 12px 0; font-weight: 600;">Cabin:</td>
                <td style="padding: 12px 0; text-align: right;">${data.cabinName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 12px 0; font-weight: 600;">Check-in:</td>
                <td style="padding: 12px 0; text-align: right;">${checkInDate} at 3:00 PM</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 12px 0; font-weight: 600;">Check-out:</td>
                <td style="padding: 12px 0; text-align: right;">${checkOutDate} at 11:00 AM</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 12px 0; font-weight: 600;">Nights:</td>
                <td style="padding: 12px 0; text-align: right;">${data.nights}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 12px 0; font-weight: 600;">Guests:</td>
                <td style="padding: 12px 0; text-align: right;">${data.guests}</td>
              </tr>
            </table>

            <h3 style="color: #A0563B; margin-top: 30px; margin-bottom: 15px;">Price Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 12px 0;">Accommodation</td>
                <td style="padding: 12px 0; text-align: right;">$${(data.totalPrice - data.cleaningFee).toFixed(2)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 12px 0;">Cleaning Fee</td>
                <td style="padding: 12px 0; text-align: right;">$${data.cleaningFee.toFixed(2)}</td>
              </tr>
              <tr style="border-top: 2px solid #A0563B;">
                <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Total</td>
                <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px; color: #A0563B;">$${data.totalPrice.toFixed(2)}</td>
              </tr>
            </table>

            ${data.guestNotes ? `
            <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h4 style="margin: 0 0 8px 0; color: #1e40af;">Special Requests</h4>
              <p style="margin: 0; color: #1e3a8a;">${data.guestNotes}</p>
            </div>
            ` : ''}

            <h3 style="color: #A0563B; margin-top: 30px; margin-bottom: 15px;">Important Information</h3>
            <ul style="padding-left: 20px; margin: 10px 0;">
              <li style="margin: 8px 0;">Check-in time is 3:00 PM</li>
              <li style="margin: 8px 0;">Check-out time is 11:00 AM</li>
              <li style="margin: 8px 0;">Please bring a valid photo ID</li>
              <li style="margin: 8px 0;">Quiet hours are 10:00 PM - 8:00 AM</li>
            </ul>

            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
              <p style="margin: 0 0 10px 0; font-weight: 600;">Questions or need to make changes?</p>
              <p style="margin: 0; font-size: 14px;">Contact us at <a href="tel:+16195148002" style="color: #A0563B; text-decoration: none;">(619) 514-8002</a></p>
            </div>

            <p style="font-size: 16px; margin-bottom: 0;">We look forward to welcoming you!</p>
            <p style="font-size: 16px; margin-top: 5px;"><strong>The Outpost VFM Team</strong></p>
          </div>

          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;">The Outpost VFM</p>
            <p style="margin: 5px 0;">Pine Valley, CA</p>
            <p style="margin: 5px 0;">(619) 514-8002</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`[Resend] Email sent to ${data.guestEmail}`);
    return { success: true };
  } catch (error) {
    console.error('[Resend] Email failed:', error);
    return { success: false, error };
  }
}

const CONTACT_RECIPIENTS = [
  'cam@valleyfarmmarkets.com',
  'christine@valleyfarmmarkets.com',
  'ashley@valleyfarmmarkets.com',
  'derek@valleyfarmmarkets.com',
  'diana@valleyfarmmarkets.com',
  'martha@valleyfarmmarkets.com',
];

export async function sendContactMessage(data: ContactFormData) {
  if (!resend) {
    console.log('[Resend] Skipping contact email (not configured)');
    return { success: false, skipped: true };
  }

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone) : '';
  const safeSubject = data.subject ? escapeHtml(data.subject) : 'New inquiry';
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');
  const submittedAt = formatPacificTimestamp();

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'team@theoutpostvfm.com',
      to: CONTACT_RECIPIENTS,
      subject: `[Contact] ${safeSubject} – ${safeName}`,
      replyTo: data.email,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission - The Outpost</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden;">
    New inquiry from ${safeName} - The Outpost Contact Form
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #FFFDF9; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(34, 31, 31, 0.08);">
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #B13330 0%, #CE7C23 50%, #F9AC30 100%);"></td>
          </tr>
          <tr>
            <td align="center" style="padding: 40px 40px 24px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width: 60px; height: 60px; background-color: #221F1F; border-radius: 50%; display: inline-block; text-align: center; line-height: 60px;">
                      <span style="color: #F9AC30; font-size: 24px; font-weight: bold;">O</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 16px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #221F1F; font-family: Georgia, 'Times New Roman', serif;">
                      The Outpost
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #6B6966; letter-spacing: 1px; text-transform: uppercase;">
                      Mt. Laguna, CA
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #B13330; color: #ffffff; font-size: 12px; font-weight: 600; padding: 8px 20px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">
                    New Contact Form Submission
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #E8E4DE;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      Name
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #B13330;">
                    <span style="font-size: 16px; color: #221F1F; font-weight: 500;">
                      ${safeName}
                    </span>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      Email
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #CE7C23;">
                    <a href="mailto:${safeEmail}" style="font-size: 16px; color: #B13330; font-weight: 500; text-decoration: none;">
                      ${safeEmail}
                    </a>
                  </td>
                </tr>
              </table>
              ${safePhone ? `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      Phone
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #DE9A2E;">
                    <a href="tel:${safePhone}" style="font-size: 16px; color: #221F1F; font-weight: 500; text-decoration: none;">
                      ${safePhone}
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 0;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      Message
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 16px 16px; border-left: 4px solid #F9AC30;">
                    <p style="font-size: 15px; color: #221F1F; line-height: 1.7; margin: 0;">${safeMessage}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="mailto:${safeEmail}?subject=Re: Your Inquiry to The Outpost" style="display: inline-block; background: linear-gradient(135deg, #B13330 0%, #CE7C23 100%); color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; margin-right: 12px;">
                      Reply to ${safeName}
                    </a>
                    ${safePhone ? `
                    <a href="tel:${safePhone}" style="display: inline-block; background-color: #221F1F; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                      Call
                    </a>
                    ` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #E8E4DE;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 13px; color: #6B6966;">
                      <strong style="color: #221F1F;">Submitted:</strong> ${submittedAt}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin: 0; font-size: 13px; color: #6B6966;">
                      <strong style="color: #221F1F;">Source:</strong> Website Contact Form
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #221F1F; padding: 28px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff; font-weight: 500;">
                      The Outpost by Valley Farm Market
                    </p>
                    <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.6);">
                      Mt. Laguna, CA · (619) 514-8002
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px;">
          <tr>
            <td align="center" style="padding: 24px 20px;">
              <p style="margin: 0; font-size: 12px; color: #6B6966;">
                This is an automated notification from your website contact form.<br>
                Please respond to inquiries within 24 hours.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    console.log(`[Resend] Contact email sent for ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('[Resend] Contact email failed:', error);
    return { success: false, error: formatError(error) };
  }
}

export async function sendContactConfirmation(data: ContactFormData) {
  if (!resend) {
    console.log('[Resend] Skipping contact confirmation email (not configured)');
    return { success: false, skipped: true };
  }

  const safeName = escapeHtml(data.name);
  const trimmedName = safeName.trim();
  const firstName = (trimmedName && trimmedName.split(' ')[0]) || 'there';
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'team@theoutpostvfm.com',
      to: data.email,
      subject: 'We received your message – The Outpost',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Got Your Message - The Outpost</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden;">
    Thanks for reaching out! We'll get back to you soon.
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #FFFDF9; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(34, 31, 31, 0.08);">
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #B13330 0%, #CE7C23 50%, #F9AC30 100%);"></td>
          </tr>
          <tr>
            <td align="center" style="padding: 48px 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width: 70px; height: 70px; background-color: #221F1F; border-radius: 50%; display: inline-block; text-align: center; line-height: 70px;">
                      <span style="color: #F9AC30; font-size: 28px; font-weight: bold;">O</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 20px;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #221F1F; font-family: Georgia, 'Times New Roman', serif;">
                      The Outpost
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #6B6966; letter-spacing: 1.5px; text-transform: uppercase;">
                      Mt. Laguna, California
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 48px 40px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="width: 56px; height: 56px; background-color: #4A7C59; border-radius: 50%; display: inline-block; text-align: center; line-height: 56px; margin-bottom: 24px;">
                      <span style="color: #ffffff; font-size: 28px;">✓</span>
                    </div>
                    <h2 style="margin: 0 0 16px 0; font-size: 26px; font-weight: 600; color: #221F1F; font-family: Georgia, 'Times New Roman', serif;">
                      We Got Your Message!
                    </h2>
                    <p style="margin: 0 0 24px 0; font-size: 16px; color: #6B6966; line-height: 1.7; max-width: 420px;">
                      Thanks for reaching out, ${firstName}. We've received your message and a member of our team will get back to you as soon as possible.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="background-color: #FAF8F5; border-radius: 12px; padding: 20px 32px; text-align: center;">
                          <p style="margin: 0 0 4px 0; font-size: 13px; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                            Expected Response Time
                          </p>
                          <p style="margin: 0; font-size: 20px; font-weight: 600; color: #B13330;">
                            Within 24 Hours
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 1px; background-color: #E8E4DE;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #221F1F; text-transform: uppercase; letter-spacing: 1px;">
                      Here's What You Sent
                    </h3>
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5; border-radius: 12px; overflow: hidden;">
                      <tr>
                        <td style="padding: 20px; border-left: 4px solid #CE7C23;">
                          <p style="margin: 0; font-size: 15px; color: #221F1F; line-height: 1.7; white-space: pre-wrap; font-style: italic;">${safeMessage}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 1px; background-color: #E8E4DE;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #221F1F; font-family: Georgia, 'Times New Roman', serif;">
                      Need a Faster Response?
                    </h3>
                    <p style="margin: 0 0 20px 0; font-size: 15px; color: #6B6966; line-height: 1.6;">
                      For urgent matters, give us a call. We're happy to help.
                    </p>
                    <a href="tel:+16195148002" style="display: inline-block; background-color: #221F1F; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                      Call (619) 514-8002
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 48px 40px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 16px; color: #6B6966; line-height: 1.7;">
                      In the meantime, we hope you're having a great day.<br>
                      <span style="color: #221F1F; font-weight: 500;">Talk soon!</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #221F1F; padding: 36px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 12px 0; font-size: 16px; color: #ffffff; font-weight: 500; font-family: Georgia, 'Times New Roman', serif;">
                      The Outpost
                    </p>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: rgba(255,255,255,0.7);">
                      Rustic Cabins & Mountain Dining<br>
                      Mt. Laguna, CA
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="padding: 0 12px;">
                          <a href="https://theoutpostvfm.com/cabins" style="color: #F9AC30; font-size: 13px; text-decoration: none;">Our Cabins</a>
                        </td>
                        <td style="color: rgba(255,255,255,0.3);">|</td>
                        <td style="padding: 0 12px;">
                          <a href="https://theoutpostvfm.com/menu" style="color: #F9AC30; font-size: 13px; text-decoration: none;">Menu</a>
                        </td>
                        <td style="color: rgba(255,255,255,0.3);">|</td>
                        <td style="padding: 0 12px;">
                          <a href="https://theoutpostvfm.com/live-music" style="color: #F9AC30; font-size: 13px; text-decoration: none;">Live Music</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.5);">
                      © 2024 The Outpost by Valley Farm Market. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px;">
          <tr>
            <td align="center" style="padding: 24px 20px;">
              <p style="margin: 0; font-size: 12px; color: #6B6966;">
                You're receiving this email because you submitted a form on our website.<br>
                <a href="#" style="color: #6B6966;">Unsubscribe</a> from future marketing emails.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    console.log(`[Resend] Contact confirmation email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('[Resend] Contact confirmation email failed:', error);
    return { success: false, error: formatError(error) };
  }
}

const PERFORMER_RECIPIENTS = [
  'music@theoutpostvfm.com',
];

export async function sendPerformerSubmission(data: PerformerFormData) {
  if (!resend) {
    console.log('[Resend] Skipping performer email (not configured)');
    return { success: false, skipped: true };
  }

  const safeStageName = escapeHtml(data.stageName);
  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone) : '';
  const safeLocation = escapeHtml(data.location);
  const safeSocialMedia = data.socialMedia ? escapeHtml(data.socialMedia) : '';
  const safeGenre = escapeHtml(data.genre);
  const safeRate = data.desiredRate ? escapeHtml(data.desiredRate) : '';
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');
  const submittedAt = formatPacificTimestamp();

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'team@theoutpostvfm.com',
      to: PERFORMER_RECIPIENTS,
      subject: `[Performer] ${safeStageName} – ${safeGenre}`,
      replyTo: data.email,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Performer Application - The Outpost</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden;">
    New performer application from ${safeStageName}
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #FFFDF9; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(34, 31, 31, 0.08);">
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #B13330 0%, #CE7C23 50%, #F9AC30 100%);"></td>
          </tr>
          <tr>
            <td align="center" style="padding: 40px 40px 24px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width: 60px; height: 60px; background-color: #221F1F; border-radius: 50%; display: inline-block; text-align: center; line-height: 60px;">
                      <span style="color: #F9AC30; font-size: 24px; font-weight: bold;">O</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 16px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #221F1F; font-family: Georgia, 'Times New Roman', serif;">
                      The Outpost
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #6B6966; letter-spacing: 1px; text-transform: uppercase;">
                      Mt. Laguna, CA
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #4A7C59; color: #ffffff; font-size: 12px; font-weight: 600; padding: 8px 20px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">
                    New Performer Application
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #E8E4DE;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      Stage Name
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #B13330;">
                    <span style="font-size: 16px; color: #221F1F; font-weight: 500;">
                      ${safeStageName}
                    </span>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      Genre/Style
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #CE7C23;">
                    <span style="font-size: 16px; color: #221F1F; font-weight: 500;">
                      ${safeGenre}
                    </span>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      Email
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #DE9A2E;">
                    <a href="mailto:${safeEmail}" style="font-size: 16px; color: #B13330; font-weight: 500; text-decoration: none;">
                      ${safeEmail}
                    </a>
                  </td>
                </tr>
              </table>
              ${safePhone ? `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      Phone
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #F9AC30;">
                    <a href="tel:${safePhone}" style="font-size: 16px; color: #221F1F; font-weight: 500; text-decoration: none;">
                      ${safePhone}
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      Location
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #4A7C59;">
                    <span style="font-size: 16px; color: #221F1F; font-weight: 500;">
                      ${safeLocation}
                    </span>
                  </td>
                </tr>
              </table>
              ${safeSocialMedia ? `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      Social Media / Website
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #6B6966;">
                    <span style="font-size: 16px; color: #221F1F; font-weight: 500;">
                      ${safeSocialMedia}
                    </span>
                  </td>
                </tr>
              </table>
              ` : ''}
              ${safeRate ? `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      Desired Rate
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #B13330;">
                    <span style="font-size: 16px; color: #221F1F; font-weight: 500;">
                      ${safeRate}
                    </span>
                  </td>
                </tr>
              </table>
              ` : ''}
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 0;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                      About Themselves
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #FAF8F5; border-radius: 8px; padding: 16px 16px; border-left: 4px solid #CE7C23;">
                    <p style="font-size: 15px; color: #221F1F; line-height: 1.7; margin: 0;">${safeMessage}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="mailto:${safeEmail}?subject=Re: Your Performance Application at The Outpost" style="display: inline-block; background: linear-gradient(135deg, #B13330 0%, #CE7C23 100%); color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; margin-right: 12px;">
                      Reply to ${safeStageName}
                    </a>
                    ${safePhone ? `
                    <a href="tel:${safePhone}" style="display: inline-block; background-color: #221F1F; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                      Call
                    </a>
                    ` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #E8E4DE;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 13px; color: #6B6966;">
                      <strong style="color: #221F1F;">Submitted:</strong> ${submittedAt}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin: 0; font-size: 13px; color: #6B6966;">
                      <strong style="color: #221F1F;">Source:</strong> Live Music Page
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #221F1F; padding: 28px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff; font-weight: 500;">
                      The Outpost by Valley Farm Market
                    </p>
                    <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.6);">
                      Mt. Laguna, CA
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    console.log(`[Resend] Performer email sent for ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('[Resend] Performer email failed:', error);
    return { success: false, error: formatError(error) };
  }
}

export async function sendPerformerConfirmation(data: PerformerFormData) {
  if (!resend) {
    console.log('[Resend] Skipping performer confirmation email (not configured)');
    return { success: false, skipped: true };
  }

  const safeStageName = escapeHtml(data.stageName);
  const safeGenre = escapeHtml(data.genre);

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'team@theoutpostvfm.com',
      to: data.email,
      subject: 'We received your application – The Outpost',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received - The Outpost</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden;">
    Thanks for your interest in performing at The Outpost!
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #FFFDF9; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(34, 31, 31, 0.08);">
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #B13330 0%, #CE7C23 50%, #F9AC30 100%);"></td>
          </tr>
          <tr>
            <td align="center" style="padding: 48px 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width: 70px; height: 70px; background-color: #221F1F; border-radius: 50%; display: inline-block; text-align: center; line-height: 70px;">
                      <span style="color: #F9AC30; font-size: 28px; font-weight: bold;">O</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 20px;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #221F1F; font-family: Georgia, 'Times New Roman', serif;">
                      The Outpost
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #6B6966; letter-spacing: 1.5px; text-transform: uppercase;">
                      Mt. Laguna, California
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 48px 40px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="width: 56px; height: 56px; background-color: #4A7C59; border-radius: 50%; display: inline-block; text-align: center; line-height: 56px; margin-bottom: 24px;">
                      <span style="color: #ffffff; font-size: 28px;">&#9835;</span>
                    </div>
                    <h2 style="margin: 0 0 16px 0; font-size: 26px; font-weight: 600; color: #221F1F; font-family: Georgia, 'Times New Roman', serif;">
                      Application Received!
                    </h2>
                    <p style="margin: 0 0 24px 0; font-size: 16px; color: #6B6966; line-height: 1.7; max-width: 420px;">
                      Hey ${safeStageName}, thanks for your interest in performing at The Outpost! We love connecting with local talent and bringing live music to our mountain community.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="background-color: #FAF8F5; border-radius: 12px; padding: 20px 32px; text-align: center;">
                          <p style="margin: 0 0 4px 0; font-size: 13px; color: #6B6966; text-transform: uppercase; letter-spacing: 1px;">
                            Your Genre
                          </p>
                          <p style="margin: 0; font-size: 20px; font-weight: 600; color: #B13330;">
                            ${safeGenre}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 1px; background-color: #E8E4DE;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #221F1F; font-family: Georgia, 'Times New Roman', serif;">
                      What Happens Next?
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #6B6966; font-size: 15px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;">Our team will review your application</li>
                      <li style="margin-bottom: 8px;">If we think you'd be a good fit, we'll reach out to discuss available dates</li>
                      <li style="margin-bottom: 8px;">We typically book shows on Saturday evenings</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 1px; background-color: #E8E4DE;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #221F1F; font-family: Georgia, 'Times New Roman', serif;">
                      Questions?
                    </h3>
                    <p style="margin: 0 0 20px 0; font-size: 15px; color: #6B6966; line-height: 1.6;">
                      Feel free to reach out if you have any questions about performing at The Outpost.
                    </p>
                    <a href="mailto:music@theoutpostvfm.com" style="display: inline-block; background: linear-gradient(135deg, #B13330 0%, #CE7C23 100%); color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                      Contact Us
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 48px 40px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 16px; color: #6B6966; line-height: 1.7;">
                      Thanks again for reaching out.<br>
                      <span style="color: #221F1F; font-weight: 500;">We look forward to possibly making music together!</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #221F1F; padding: 36px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 12px 0; font-size: 16px; color: #ffffff; font-weight: 500; font-family: Georgia, 'Times New Roman', serif;">
                      The Outpost
                    </p>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: rgba(255,255,255,0.7);">
                      Live Music in the Mountains<br>
                      Mt. Laguna, CA
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="padding: 0 12px;">
                          <a href="https://theoutpostvfm.com/live-music" style="color: #F9AC30; font-size: 13px; text-decoration: none;">Live Music</a>
                        </td>
                        <td style="color: rgba(255,255,255,0.3);">|</td>
                        <td style="padding: 0 12px;">
                          <a href="https://theoutpostvfm.com/menu" style="color: #F9AC30; font-size: 13px; text-decoration: none;">Menu</a>
                        </td>
                        <td style="color: rgba(255,255,255,0.3);">|</td>
                        <td style="padding: 0 12px;">
                          <a href="https://theoutpostvfm.com/cabins" style="color: #F9AC30; font-size: 13px; text-decoration: none;">Our Cabins</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.5);">
                      The Outpost by Valley Farm Market
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    console.log(`[Resend] Performer confirmation email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('[Resend] Performer confirmation email failed:', error);
    return { success: false, error: formatError(error) };
  }
}
