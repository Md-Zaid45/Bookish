import { Client as WorkflowClient, WorkflowContext } from "@upstash/workflow";
import { Client as QstashClient, resend } from "@upstash/qstash";
import config from "./config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const client = new QstashClient({ token: config.env.upstash.qstashToken });

export const sendEmail = async (
  email: string,
  subject: string,
  html: string,
) => {
  await client.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resend.resendToken! }),
    },
    body: {
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: html,
    },
  });
};
