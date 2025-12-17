import { Resend } from 'resend';
import type { ContactFormData } from '@/lib/validations';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey && !apiKey.includes('your_') ? new Resend(apiKey) : null;

if (!resend) {
  console.warn('[Resend] API key not configured. Emails disabled.');
}

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
              <p style="margin: 0; font-size: 14px;">Contact us at <a href="tel:+16194738341" style="color: #A0563B; text-decoration: none;">(619) 473-8341</a></p>
            </div>

            <p style="font-size: 16px; margin-bottom: 0;">We look forward to welcoming you!</p>
            <p style="font-size: 16px; margin-top: 5px;"><strong>The Outpost VFM Team</strong></p>
          </div>

          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;">The Outpost VFM</p>
            <p style="margin: 5px 0;">Pine Valley, CA</p>
            <p style="margin: 5px 0;">(619) 473-8341</p>
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
];

export async function sendContactMessage(data: ContactFormData) {
  if (!resend) {
    console.log('[Resend] Skipping contact email (not configured)');
    return { success: false, skipped: true };
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'hello@theoutpostvfm.com',
      to: CONTACT_RECIPIENTS,
      subject: `[Contact] ${data.subject || 'New inquiry'} – ${data.name}`,
      replyTo: data.email,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #111; max-width: 640px; margin: 0 auto; padding: 20px; background: #fff; border: 1px solid #eee; border-radius: 12px;">
          <h1 style="margin-top: 0; color: #A0563B; font-size: 22px;">New Contact Form Submission</h1>
          <p style="margin: 0 0 16px 0;">A visitor submitted the contact form on the Outpost VFM site.</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Name</td>
              <td style="padding: 8px 0; text-align: right;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Email</td>
              <td style="padding: 8px 0; text-align: right;">${data.email}</td>
            </tr>
            ${data.phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Phone</td>
              <td style="padding: 8px 0; text-align: right;">${data.phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Subject</td>
              <td style="padding: 8px 0; text-align: right;">${data.subject}</td>
            </tr>
          </table>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; border: 1px solid #eee;">
            <div style="font-weight: 600; margin-bottom: 8px; color: #555;">Message</div>
            <div style="white-space: pre-wrap; color: #222;">${data.message}</div>
          </div>
        </div>
      `,
    });

    console.log(`[Resend] Contact email sent for ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('[Resend] Contact email failed:', error);
    return { success: false, error };
  }
}
