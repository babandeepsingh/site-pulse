import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URL,
});

export async function GET(req: NextRequest, context: any) {
    const { userId } = context.params; // Correct: access via context.params;
    const userIdInt = parseInt(userId, 10);

    if (isNaN(userIdInt)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    let client;

    try {
        client = await pool.connect();

        // SQL query to fetch checks along with site info, including site createdAt
        const query = `
      SELECT checks.id AS checkId, checks.status, checks.latencyMs, checks.error, checks.createdAt AS checkCreatedAt,
             sites.name, sites.url, sites.createdAt AS siteCreatedAt
      FROM checks
      JOIN sites ON checks.siteId = sites.id
      WHERE sites.userId = $1
      ORDER BY checks.createdAt DESC;
    `;

        const result = await client.query(query, [userIdInt]);

        // Transform the result into an object with URL as the key
        const groupedByUrl = result.rows.reduce((acc, row) => {
            const { url, checkId, status, latencyms, error, checkcreatedat, name, sitecreatedat, siteName } = row;

            if (!acc[url]) {
                acc[url] = {
                    metadata: {
                        createdAt: sitecreatedat,  // Adding site createdAt as metadata
                        name: name
                    },
                    checks: [],
                };
            }

            acc[url].checks.push({
                checkId,
                status,
                latencyms,
                error,
                checkcreatedat,
                name,
            });

            return acc;
        }, {});

        return NextResponse.json({ sites: groupedByUrl });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}
