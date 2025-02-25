import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to verify email");
    }

    const data = await response.json();

    // Simple validation check
    const isValid =
      data.is_valid_format.value &&
      data.deliverability === "DELIVERABLE" &&
      !data.is_disposable_email.value;

    return NextResponse.json({
      isValid,
      error: isValid ? undefined : "Invalid email address",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { isValid: false, error: "Invalid email address" },
      { status: 500 }
    );
  }
}
