import { FastifyInstance } from "fastify";
import { db } from "../db.js";

export default async function (app: FastifyInstance) {
  app.get("/conversations/:userId", async (req) => {
    const { userId } = req.params as any;

    const result = await db.query(
      `SELECT c.id, u.id as other_user_id, u.username as other_username
      FROM conversations c JOIN users u
      ON u.id =
        CASE
          WHEN c.user1_id = $1 THEN c.user2_id
          ELSE c.user1_id
        END
      WHERE c.user1_id = $1 OR c.user2_id = $1
      ORDER BY c.created_at DESC`,
      [userId]
    );

    return result.rows;
  });

  app.post("/conversations", async (req) => {
    const { user1_id, user2_id } = req.body as any;

    if (user1_id === user2_id) {
      throw new Error("Cannot DM yourself!");
    }

    const a = Math.min(user1_id, user2_id);
    const b = Math.max(user1_id, user2_id);

    const existing = await db.query(
      `SELECT * FROM conversations
      WHERE user1_id=$1 AND user2_id=$2`,
      [a, b]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const result = await db.query(
      `INSERT INTO conversations (user1_id, user2_id)
      VALUES ($1, $2)
      RETURNING *`,
      [a, b]
    );

    return result.rows[0];
  });
}
