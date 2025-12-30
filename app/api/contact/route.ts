import { NextResponse } from "next/server";
import { validateContactForm, type ContactFormData } from "@/lib/validations";
import { sendContactMessage, sendContactConfirmation } from "@/lib/resend/email-client";

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[Contact] TURNSTILE_SECRET_KEY not configured, skipping verification");
    return true;
  }

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
        }),
      }
    );
    const data = await res.json();
    return data.success === true;
  } catch (error) {
    console.error("[Contact] Turnstile verification error:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data: ContactFormData = {
      name: body.name ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      subject: body.subject ?? "",
      message: body.message ?? "",
    };

    const validation = validateContactForm(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Verify Turnstile captcha
    const turnstileToken = body.turnstileToken;
    if (!turnstileToken) {
      return NextResponse.json(
        { success: false, message: "Captcha verification required" },
        { status: 400 }
      );
    }

    const isValidCaptcha = await verifyTurnstile(turnstileToken);
    if (!isValidCaptcha) {
      console.warn("[Contact] Captcha verification failed");
      return NextResponse.json(
        { success: false, message: "Captcha verification failed. Please try again." },
        { status: 400 }
      );
    }

    const staffResult = await sendContactMessage(data);
    const staffOk = staffResult.success || staffResult.skipped;
    if (!staffOk) {
      console.error("[Contact] Staff email failed:", staffResult.error);
      return NextResponse.json(
        { success: false, message: "Failed to send message" },
        { status: 500 }
      );
    }

    const guestResult = await sendContactConfirmation(data);
    const guestError = !guestResult.success && !guestResult.skipped;
    if (guestError) {
      console.error("[Contact] Guest confirmation failed:", guestResult.error);
    }

    return NextResponse.json({
      success: true, // return success as long as staff notification succeeds
      skipped: staffResult.skipped ?? false,
      guestSkipped: guestResult.skipped ?? false,
      guestError,
    });
  } catch (error) {
    console.error("[Contact] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Unexpected error" },
      { status: 500 }
    );
  }
}
