
import { supabase } from "@/supabase/authHelper";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password
  })
  if (!user) {
    return NextResponse.json({
      message: "User does not exist",
      status: 404,
    });
  }

  return NextResponse.json({
    message: "Successful Login",
    status: 200,
    success: true
  })
}
