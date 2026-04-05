import { FastifyInstance } from "fastify";
import { db } from "../db.js";

export default async function (app: FastifyInstance) {
  app.post("/messages", async (req, reply) => {
    const { conversation_id, sender_id, content } = req.body as any;

    const result = await db.query(
      `INSERT INTO messages
      (conversation_id, sender_id, content)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [conversation_id, sender_id, content]
    );

    return result.rows[0];
  });

  app.get("/messages/:conversationId", async (req) => {
    const { conversationId } = req.params as any;

    const result = await db.query(
      `SELECT * FROM messages
      WHERE conversation_id=$1
      ORDER BY created_at ASC`,
      [conversationId]
    );

    return result.rows;
  });
}
