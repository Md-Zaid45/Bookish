import { Client as WorkflowClient, WorkflowContext } from "@upstash/workflow";
import config from "./config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.redisToken,
});

export const sendEmail = async (
  context: WorkflowContext<{ email: string }>,
  message: string,
  email: string,
) => {
  console.log(`Sending ${message} email to ${email}`);
  const { status, body } = await context.api.resend.call("Call Resend", {
    token: process.env.RESESND_API_KEY!,
    body: {
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Hello World",
      html: `<p>${message}</p>`,
    },
    headers: {
      "content-type": "application/json",
    },
  });
};
