import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { sendEmail } from "@/lib/workflow";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";

type InitialData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAY_IN_MS = ONE_DAY_IN_MS * 3;
const THIRTY_DAY_IN_MS = THREE_DAY_IN_MS * 10;

export const { POST } = serve<InitialData>(async (context) => {
  const { email } = context.requestPayload;

  await context.run("new-signup", async () => {
    await sendEmail(email, "Welcome to the platform", `Welcome to the Bookish, Enjoy the ease of learning with our wide variety of books`);
  });

  await context.sleep("wait-for-3-days", THREE_DAY_IN_MS);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail(email, "Hey, where are you", `Dont miss out learning, Learn new everyday`);
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail(email, "Welcome Back", `Welcome  Back to the Bookish, We've missed you`);
      });
    }

    await context.sleep("wait-for-1-month", THIRTY_DAY_IN_MS);
  }
});

type UserState = "non-active" | "active";

const getUserState = async (email:string): Promise<UserState> => {
  const user = await db.select().from(users).where(eq(users.email,email))
  if(user.length === 0) return 'non-active'

  const lastActivity = new Date(user[0].lastActivityDate!)
  const now = new Date()
  const timeDiff = now.getTime()-lastActivity.getTime()

  if(timeDiff>THREE_DAY_IN_MS && timeDiff<=THIRTY_DAY_IN_MS) return "non-active"
  return "active";
};
