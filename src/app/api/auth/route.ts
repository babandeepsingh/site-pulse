import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_DB_URL,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, id, email, user } = body;

  // console.log("POST:userMessage", fullName, id, email, user);

  let client;

  try {
    client = await pool.connect();

    // Insert or return existing user by loginId
    const query = `
      WITH inserted AS (
        INSERT INTO users (loginId, emailId, fullName, accountType)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (loginId) DO NOTHING
        RETURNING *
      )
      SELECT * FROM inserted
      UNION
      SELECT * FROM users WHERE loginId = $1
      LIMIT 1;
    `;

    const values = [id, email, fullName, user]; // user should be a JSON object

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
