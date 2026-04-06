import { FastifyInstance } from "fastify";
import { db } from "../db.js";

export default async function (app: FastifyInstance) {
  app.get("/search", async (req) => {
    const { q, conversation_id } = req.query as any;

    const result = await db.query(
      `SELECT * FROM messages
      WHERE conversation_id=$1
      AND content_tsv @@ plainto_tsquery($2)
      ORDER BY created_at DESC`,
      [conversation_id, q]
    );

    return result.rows;
  });
}
