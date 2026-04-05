import { FastifyInstance } from "fastify";
import { db } from "../db.js";

export default async function (app: FastifyInstance) {
  app.post("/conversations", async (req) => {
    const { user1_id, user2_id } = req.body as any;
    
    const result = await db.query(
      `INSERT INTO conversations (user1_id, user2_id)
      VALUES ($1, $2)
      RETURNING *`,
      [user1_id, user2_id]
    );

    return result.rows[0];
  });

  app.get("/conversations/:userId", async (req) => {
    const { userId } = req.params as any;

    const result = await db.query(
      `SELECT * FROM conversations
      WHERE user1_id=$1 OR user2_id=$1
      ORDER BY id DESC`,
      [userId]
    );

    return result.rows;
  });
}
