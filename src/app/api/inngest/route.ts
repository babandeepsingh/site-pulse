import { serve } from "inngest/next";
import { inngest } from "@/inngest/inngest";
import { sendSiteDownEmail } from "@/inngest/functions/sendEmail";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendSiteDownEmail],
});
