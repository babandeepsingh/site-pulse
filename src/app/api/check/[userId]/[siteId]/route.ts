import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_DB_URL,
});

export async function GET(
  req: NextRequest,
  context: any // ✅ Let Next.js handle the actual type internally
) {
  const { userId, siteId } = context.params; // Correct: access via context.params
  const userIdInt = parseInt(userId, 10);
  const siteIdInt = parseInt(siteId, 10);

  if (isNaN(userIdInt) || isNaN(siteIdInt)) {
    return NextResponse.json(
      { error: "Invalid user ID or site ID" },
      { status: 400 }
    );
  }

  let client;

  try {
    client = await pool.connect();

    const query = `
      SELECT checks.id AS checkId, checks.status, checks.latencyMs, checks.error, checks.createdAt AS checkCreatedAt,
             sites.name, sites.url
      FROM checks
      JOIN sites ON checks.siteId = sites.id
      WHERE sites.userId = $1 AND sites.id = $2
      ORDER BY checks.createdAt DESC;
    `;

    const result = await client.query(query, [userIdInt, siteIdInt]);

    return NextResponse.json({ sites: result.rows });
  } catch (error) {
    console.error("Error fetching checks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}
