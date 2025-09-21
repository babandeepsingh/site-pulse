// app/api/monitor-cron/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import { Pool } from "pg";
import { inngest } from "@/inngest/inngest";

const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URL,
});

export async function GET(req: NextRequest) {
    let client;

    try {
        client = await pool.connect();

        const siteQuery = `SELECT * FROM sites`;
        const siteResult = await client.query(siteQuery);
        const sites = siteResult.rows;

        for (const row of sites) {
            try {
                const start = Date.now();
                const response = await axios.get(row.url, { timeout: 5000 });
                const latencyMs = Date.now() - start;
                const status = response.status;
                const ok = status >= 200 && status < 300;

                await client.query(
                    `INSERT INTO checks (siteId, ok, status, latencyMs, error, isactive)
           VALUES ($1, $2, $3, $4, $5, $6)`,
                    [row.id, ok, status, latencyMs, null, row.isactive]
                );

            } catch (err: any) {
                console.error(`❌ Error checking ${row.url}:`, err.message);

                await client.query(
                    `INSERT INTO checks (siteId, ok, status, latencyMs, error, isactive)
           VALUES ($1, $2, $3, $4, $5, $6)`,
                    [row.id, false, 400, 5000, err.message, row.isactive]
                );

                // Fetch user details to send email
                const resultUser = await client.query(`
          SELECT u.emailid, u.fullname, s.url
          FROM users u
          JOIN sites s ON u.id = s.userId
          WHERE s.id = $1;
        `, [row.id]);

                const user = resultUser.rows[0];

                // Trigger Inngest event
                await inngest.send({
                    name: "site/down",
                    data: {
                        emailid: user.emailid,
                        fullname: user.fullname,
                        url: user.url,
                    },
                });

                console.log(`📧 Email event triggered for ${user.url}`);
            }
        }

        return NextResponse.json({ message: 'Monitoring run completed' });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}
