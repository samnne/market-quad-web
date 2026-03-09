import { signUpUser } from "@/app/client-utils/functions";
import { hashPassword, simplifyUserData } from "@/app/server-utils/utils";
import { prisma } from "@/db/db";
import { createSession } from "@/lib/lib";
import { supabase } from "@/supabase/authHelper";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, name, profileURL }: UserFormData = await req.json();

  try {
  
    if (!user) return NextResponse.error();
    // const createdUser = await prisma.user.create({
    //   data: {
    //     email: email,
    //     passwordHash: await hashPassword(password),
    //     name:name,
    //     profileURL:profileURL,
    //   },
    // });
    // console.log(createdUser);

    // const safeUser: SafeUser = simplifyUserData(createdUser);
    // const session = await createSession(safeUser);

    return NextResponse.json({
      message: "Successfully Registered",
      user,
    });
  } catch (e) {
    console.log("An error occured Registering", e);
    return NextResponse.error();
  }
}
