import { NextResponse } from 'next/server';
import { clientIp, isRateLimited, recordFailure } from '@/app/api/_auth';

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      name.length > 200 ||
      message.length > 5000
    ) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;

    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
      console.warn("WEB3FORMS_ACCESS_KEY is not configured. Simulating success for development.");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ message: "Simulated success" }, { status: 200 });
    }

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name,
        email,
        message,
        subject: `New Portfolio Message from ${name}`
      }),
    });

    recordFailure(ip); // ponytail: reuses the login attempt tracker (10/5min per IP)

    const result = await res.json();

    if (res.ok && result.success) {
      return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    } else {
      console.error("Web3Forms error fallback:", result);
      return NextResponse.json({ message: result.message || "Failed to send email" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
