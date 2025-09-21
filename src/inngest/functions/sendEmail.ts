// inngest/functions/sendEmail.ts
import { inngest } from "../inngest";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendSiteDownEmail = inngest.createFunction(
  { id: "send-site-down-email" },
  { event: "site/down" },
  async ({ event }) => {
    const { emailid, fullname, url } = event.data;

    const { data, error } = await resend.emails.send({
      from: "NoReply <noreply@mail.babandeep.in>",
      to: [emailid],
      subject: `Alert from SitesPulse: Your site ${url} is down`,
      html: `
        <div>Hello ${fullname},</div>
        <br />
        <div>Your website is down: ${url} at ${new Date().toUTCString()}</div>
        <br />
        <div>Thanks and Regards,<br/>SitesPulse Team</div>
      `
    });

    if (error) {
      throw new Error(`Email send failed: ${error.message}`);
    }

    return { message: "Email sent successfully" };
  }
);
