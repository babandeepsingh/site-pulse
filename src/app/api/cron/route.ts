import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import { Pool } from "pg";
import { Resend } from 'resend';
import { useAuth } from "@clerk/nextjs";

const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URL,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {

    let client;
    // const { userId } = useAuth();

    try {
        client = await pool.connect();

        const siteQuery = `SELECT * FROM sites`;
        const siteResult = await client.query(siteQuery);
        const sites = siteResult.rows;

        for (const row of sites) {
            try {
                const start = Date.now();
                const response = await axios.get(row.url, { timeout: 5000 });
                const end = Date.now();

                const latencyMs = end - start;
                const status = response.status;
                const ok = status >= 200 && status < 300;

                const insertQuery = `
                    INSERT INTO checks (siteId, ok, status, latencyMs, error)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *;
                `;
                const insertValues = [row.id, ok, status, latencyMs, null];

                await client.query(insertQuery, insertValues);

                console.log(`✅ Checked ${row.url} in ${latencyMs}ms`);

            } catch (err: any) {
                console.error(`❌ Error fetching ${row.url}:`, err.message);

                const insertQuery = `
                    INSERT INTO checks (siteId, ok, status, latencyMs, error)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *;
                `;
                const insertValues = [row.id, false, 400, 5000, err.message];

                await client.query(insertQuery, insertValues);

                const emailInfo = `
                SELECT u.emailid, s.url
                FROM users u
                JOIN sites s ON u.id = s.userId
                WHERE s.id = $1;
                `
                const getValues = [row.id]



                const resultUser = await client.query(emailInfo, [row.id])



                console.log(resultUser, "data::")
                const { data, error } = await resend.emails.send({
                    from: 'NoReply <noreply@mail.babandeep.in>',
                    to: [resultUser.rows[0].emailid],
                    subject: `Alert from SitesPulse, Your site ${resultUser.rows[0].url} is down`,
                    html: `<div>Hello</div>,
                    <br />
                    <div>Your website is down ${resultUser.rows[0].url}</div>
                    <br />
                    <div>Thanks and Regards,</div>
                    <div>Admin</div>`
                });
                if (data) {
                    //do nothing
                } else {
                    console.log("We faced issue in sending email : " +  resultUser.rows[0].url )
                }
            }
        }

        return NextResponse.json({ message: 'updated successfully' });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}
