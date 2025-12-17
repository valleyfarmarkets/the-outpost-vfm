import { NextResponse } from "next/server";
import { validateContactForm, type ContactFormData } from "@/lib/validations";
import { sendContactMessage, sendContactConfirmation } from "@/lib/resend/email-client";

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

    const staffResult = await sendContactMessage(data);
    if (!staffResult.success) {
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
