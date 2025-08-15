import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import { Pool } from "pg";

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
