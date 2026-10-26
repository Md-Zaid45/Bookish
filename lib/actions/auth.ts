"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!result) return { success: false, error: "SignIn error" };
    const user = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return { success: true, role: user[0]?.role ?? "USER" };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { success: false, error: "Incorrect email or password" };
      }
      console.error("SignIn failed:", error.type, error.message, error.cause);
      return { success: false, error: "Unable to sign in, please try again" };
    }
    console.error("Unexpected signIn error:", error);
    return { success: false, error: "SignIn error" };
  }
};

export const logOut = async () => {
  await signOut({ redirectTo: "/sign-in" });
};

export const signUp = async (params: AuthCredentials) => {
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  const { fullName, email, password, universityId, universityCard } = params;
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0)
    return { success: false, error: "User already existed" };

  const hashedPassword = await hash(password, 10);

  try {
    const newUser = await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
      universityId,
      universityCard,
    });

    const isProd = process.env.NODE_ENV === "production";
    const baseUrl = isProd
      ? process.env.NEXT_PUBLIC_PROD_API_ENDPOINT
      : process.env.NEXT_PUBLIC_API_ENDPOINT;

    await workflowClient.trigger({
      url: `${baseUrl}/api/auth/workflow/onboarding`,
      body: { email, fullName },
    });
  } catch (error) {
    console.log("Signup error");
    return { success: false, error: "Signup error" };
  }
  return { success: true };
};
