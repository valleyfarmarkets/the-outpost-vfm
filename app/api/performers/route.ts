import { NextResponse } from "next/server";
import { validatePerformerForm, type PerformerFormData } from "@/lib/validations";
import { sendPerformerSubmission, sendPerformerConfirmation } from "@/lib/resend/email-client";

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[Performers] TURNSTILE_SECRET_KEY not configured, skipping verification");
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
    console.error("[Performers] Turnstile verification error:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data: PerformerFormData = {
      stageName: body.stageName ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      location: body.location ?? "",
      socialMedia: body.socialMedia ?? "",
      genre: body.genre ?? "",
      desiredRate: body.desiredRate ?? "",
      message: body.message ?? "",
    };

    const validation = validatePerformerForm(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const turnstileToken = body.turnstileToken;
    if (!turnstileToken) {
      return NextResponse.json(
        { success: false, message: "Captcha verification required" },
        { status: 400 }
      );
    }

    const isValidCaptcha = await verifyTurnstile(turnstileToken);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { success: false, message: "Captcha verification failed" },
        { status: 400 }
      );
    }

    // Send notification to staff
    const staffResult = await sendPerformerSubmission(data);
    const staffOk = staffResult.success || staffResult.skipped;
    if (!staffOk) {
      return NextResponse.json(
        { success: false, message: "Failed to send submission" },
        { status: 500 }
      );
    }

    // Send confirmation to performer
    await sendPerformerConfirmation(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Performers] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Unexpected error" },
      { status: 500 }
    );
  }
}
