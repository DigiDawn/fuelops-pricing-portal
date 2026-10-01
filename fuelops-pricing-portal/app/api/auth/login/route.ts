import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = String(body?.identifier || "").trim();
    const password = String(body?.password || "");

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Enter your email or full name and password." },
        { status: 400 }
      );
    }

    let email = identifier;

    if (!identifier.includes("@")) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serverSecret =
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serverSecret) {
        console.error(
          "Name sign-in configuration missing:",
          {
            hasUrl: Boolean(supabaseUrl),
            hasSecretKey: Boolean(process.env.SUPABASE_SECRET_KEY),
            hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
          }
        );
        return NextResponse.json(
          { error: "Name sign-in is not configured on the server. Use your email for now." },
          { status: 503 }
        );
      }

      const admin = createAdminClient(supabaseUrl, serverSecret, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data, error } = await admin
        .from("profiles")
        .select("email")
        .ilike("full_name", identifier)
        .limit(2);

      if (error) {
        console.error("Name lookup failed:", error.message);
        return NextResponse.json(
          { error: "Unable to resolve that name. Try your email." },
          { status: 500 }
        );
      }

      if (!data || data.length === 0) {
        return NextResponse.json(
          { error: "Invalid sign-in details." },
          { status: 401 }
        );
      }

      if (data.length > 1) {
        return NextResponse.json(
          { error: "More than one account uses that name. Sign in with your email." },
          { status: 409 }
        );
      }

      email = data[0].email;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Password sign-in failed:", error.message);
      return NextResponse.json(
        { error: "Invalid sign-in details." },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Login route failed:", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
