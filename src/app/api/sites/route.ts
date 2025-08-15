import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URL,
});

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { url, name, userId } = body;

    // console.log("POST:siteAdd", url, name, userId);

    let client;

    try {
        client = await pool.connect();

        // Insert or return existing user by loginId
        const query = `
            WITH inserted AS (
            INSERT INTO sites (url, name, userId)
            VALUES ($1, $2, $3)
            ON CONFLICT (url) DO NOTHING
            RETURNING *
            )
            SELECT * FROM inserted
            UNION
            SELECT * FROM sites WHERE url = $1
            LIMIT 1;
        `;

        const values = [url, name, userId]; // user should be a JSON object

        const result = await client.query(query, values);

        return NextResponse.json({ user: result.rows[0] || null });
    } catch (error) {
        // console.error("Error inserting user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function GET(req: NextRequest) {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
