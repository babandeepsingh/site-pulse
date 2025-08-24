import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URL,
});

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { url, name, userId } = body;

    const { userId: userData } = await auth()
    let userIdServerClient
    try {
        userIdServerClient = await pool.connect();
        const query = `
                select * from users where loginid = $1;
                `;
        const result = await userIdServerClient.query(query, [userData]);
        // const result = await userIdServerClient.query(query)
        console.log(result?.rows[0].id)

        if (result?.rows[0].id != userId) {
            return NextResponse.json({ error: "You are not authrized for this user." }, { status: 401 });
        } else {
            try {
                const result = await fetch(url);
                if (!result.ok) {
                    return NextResponse.json({ error: "Failed to fetch the URL" }, { status: 400 });
                }
                console.log(result, "siteCheck");

                let client;
                try {
                    client = await pool.connect();

                    // Correct query with parameterized values
                    const query = `
                INSERT INTO sites (url, name, userId)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;

                    // Execute the query with the provided values
                    const queryValues = [url, name, userId];

                    const queryResult = await client.query(query, queryValues);
                    if (queryResult.rows[0]) {
                        const insertQuery = `
                        INSERT INTO checks (siteId, ok, status, latencyMs, error)
                        VALUES (${queryResult.rows[0].id}, ${true}, ${200}, ${0}, ${0})
                        RETURNING *;
                    `;
                        const queryResultInsert = await client.query(insertQuery);
                        return NextResponse.json({ site: queryResult.rows || null });
                    } else {
                        const query = `
                DELETE FROM sites WHERE id = ${queryResult.rows[0].id}
            `;
                        const queryResultFailure = await client.query(query, queryValues);
                        return NextResponse.json({ error: "currently Unable to process the request" }, { status: 400 });

                    }

                    // Return the newly added site

                } catch (error) {
                    console.error("Error inserting site:", error);
                    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
                } finally {
                    if (client) {
                        client.release();
                    }
                }

            } catch (error) {
                console.error("Error in POST:", error);
                return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
            }
        }
    } catch {
        return NextResponse.json({ error: "Internal Server Error", message: 'unable to retreive user' }, { status: 500 });

    } finally {
        if (userIdServerClient) {
            userIdServerClient.release();
        }
    }



    try {
        const result = await fetch(url);
        if (!result.ok) {
            return NextResponse.json({ error: "Failed to fetch the URL" }, { status: 400 });
        }
        console.log(result, "siteCheck");

        let client;
        try {
            client = await pool.connect();

            // Correct query with parameterized values
            const query = `
                INSERT INTO sites (url, name, userId)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;

            // Execute the query with the provided values
            const queryValues = [url, name, userId];

            const queryResult = await client.query(query, queryValues);
            if (queryResult.rows[0]) {
                const insertQuery = `
                        INSERT INTO checks (siteId, ok, status, latencyMs, error)
                        VALUES (${queryResult.rows[0].id}, ${true}, ${200}, ${0}, ${0})
                        RETURNING *;
                    `;
                const queryResultInsert = await client.query(insertQuery);
                return NextResponse.json({ site: queryResult.rows || null });
            } else {
                const query = `
                DELETE FROM sites WHERE id = ${queryResult.rows[0].id}
            `;
                const queryResultFailure = await client.query(query, queryValues);
                return NextResponse.json({ error: "currently Unable to process the request" }, { status: 400 });

            }

            // Return the newly added site

        } catch (error) {
            console.error("Error inserting site:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        } finally {
            if (client) {
                client.release();
            }
        }

    } catch (error) {
        console.error("Error in POST:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
