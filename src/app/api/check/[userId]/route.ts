import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URL,
});

export async function GET(req: NextRequest, context: any ) {
    const { userId } = context.params; // Correct: access via context.params;
    const userIdInt = parseInt(userId, 10);

    if (isNaN(userIdInt)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    let client;

    try {
        client = await pool.connect();

        // SQL query to fetch checks along with site info
        const query = `
      SELECT checks.id AS checkId, checks.status, checks.latencyMs, checks.error, checks.createdAt AS checkCreatedAt,
             sites.name, sites.url
      FROM checks
      JOIN sites ON checks.siteId = sites.id
      WHERE sites.userId = $1
      ORDER BY checks.createdAt DESC;
    `;

        const result = await client.query(query, [userIdInt]);

        // console.log("Fetched checks for user:", userIdInt, result.rows);

        // Transform the result into an object with URL as the key
        const groupedByUrl = result.rows.reduce((acc, row) => {
            const { url, checkId, status, latencyms, error, checkcreatedat, name } = row;
            // console.log("Query result rows:", row, url, checkId, status, latencyMs, error, checkCreatedAt);

            if (!acc[url]) {
                acc[url] = [];
            }

            acc[url].push({
                checkId,
                status,
                latencyms,
                error,
                checkcreatedat,
                name
            });

            return acc;
        }, {});

        return NextResponse.json({ sites: groupedByUrl });
    } catch (error) {
        // console.error("Error fetching checks:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}

// export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
//     const { userId } = await params;
//     const userIdInt = parseInt(userId, 10);

//     if (isNaN(userIdInt)) {
//         return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
//     }
//     // console.log("POST:siteAdd", userId);

//     let client;

//     try {
//         client = await pool.connect();

//         // Insert or return existing user by loginId
//         const query = `
//             select * from sites where userId = $1
//         `;

//         const values = [userIdInt]; // user should be a JSON object

//         const result = await client.query(query, values);
//         console.log("POST:siteAdd", result);

//         return NextResponse.json({ user: result.rows[0] || null });
//     } catch (error) {
//         console.error("Error inserting user:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     } finally {
//         if (client) {
//             client.release();
//         }
//     }
// }