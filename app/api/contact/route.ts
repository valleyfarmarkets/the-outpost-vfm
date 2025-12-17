import { NextResponse } from "next/server";
import { validateContactForm, type ContactFormData } from "@/lib/validations";
import { sendContactMessage } from "@/lib/resend/email-client";

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

    const result = await sendContactMessage(data);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, skipped: result.skipped ?? false });
  } catch (error) {
    console.error("[Contact] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Unexpected error" },
      { status: 500 }
    );
  }
}
