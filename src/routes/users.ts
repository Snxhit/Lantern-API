import { FastifyInstance } from "fastify";
import { db } from "../db.js";

export default async function (app: FastifyInstance) {
  app.post("/users", async (req) => {
    const { username } = req.body as any;

    const result = await db.query(
      `INSERT INTO users (username)
      VALUES ($1)
      RETURNING *`,
      [username]
    );

    return result.rows[0];
  });
}
