import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { auth } from "@clerk/nextjs/server";


const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URL,
});

export async function GET(req: NextRequest, context: any) {
    let { userId } = context.params; // Correct: access via context.params;
    const userIdInt = parseInt(userId, 10);
    const { userId: userData } = await auth()
    console.log(userData, "Clerk:::")
    let userIdServerClient
    try {
        userIdServerClient = await pool.connect();
        const query = `
            select * from users where loginid = $1;
            `;
        const result = await userIdServerClient.query(query, [userData]);
        // const result = await userIdServerClient.query(query)
        console.log(result?.rows[0].id)

        if (result?.rows[0].id != userIdInt) {
            return NextResponse.json({ error: "You are not authrized for this user." }, { status: 401 });
        } else {
            if (isNaN(userIdInt)) {
                return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
            }
            let client;

            try {
                client = await pool.connect();

                // SQL query to fetch checks along with site info, including site createdAt
                const query = `
      SELECT checks.id AS checkId, checks.status, checks.latencyMs, checks.error, checks.createdAt AS checkCreatedAt,
             sites.name, sites.url, sites.createdAt AS siteCreatedAt, sites.isActive  AS "isActive"
      FROM checks
      JOIN sites ON checks.siteId = sites.id
      WHERE sites.userId = $1
      ORDER BY checks.createdAt DESC;
    `;

                const result = await client.query(query, [userIdInt]);

                // Transform the result into an object with URL as the key
                const groupedByUrl = result.rows.reduce((acc, row) => {
                    const { url, checkId, status, latencyms, error, checkcreatedat, name, sitecreatedat, isActive } = row;

                    if (!acc[url]) {
                        acc[url] = {
                            metadata: {
                                createdAt: sitecreatedat,  // Adding site createdAt as metadata
                                name: name,
                                isActive: isActive
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
        // userId = result.row[0].id
    } catch {
        return NextResponse.json({ error: "Internal Server Error", message: 'unable to retreive user' }, { status: 500 });

    } finally {
        if (userIdServerClient) {
            userIdServerClient.release();
        }
    }
}
